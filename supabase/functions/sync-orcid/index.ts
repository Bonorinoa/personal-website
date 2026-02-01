import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ORCIDWork {
  'put-code': number;
  'work-summary': Array<{
    'put-code': number;
    title: { title: { value: string } };
    'publication-date'?: {
      year?: { value: string };
      month?: { value: string };
      day?: { value: string };
    };
    type: string;
    'external-ids'?: {
      'external-id'?: Array<{
        'external-id-type': string;
        'external-id-value': string;
        'external-id-url'?: { value: string };
      }>;
    };
    'journal-title'?: { value: string };
  }>;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orcid_id } = await req.json();
    
    if (!orcid_id) {
      return new Response(
        JSON.stringify({ error: 'ORCID ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Fetching works for ORCID: ${orcid_id}`);

    // Initialize Supabase client with service role for DB writes
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch works from ORCID public API
    const response = await fetch(
      `https://pub.orcid.org/v3.0/${orcid_id}/works`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ORCID API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `ORCID API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const works = data.group || [];

    console.log(`Found ${works.length} works`);

    // Get existing external_ids to check for duplicates
    const { data: existingItems } = await supabase
      .from('inbox_items')
      .select('external_id')
      .eq('source', 'orcid');
    
    const existingIds = new Set(existingItems?.map(item => item.external_id) || []);

    // Transform ORCID works and filter duplicates
    const newItems: Array<{
      source: string;
      external_id: string;
      status: string;
      raw_data: unknown;
      suggested_artifact: unknown;
      discovered_at: string;
    }> = [];

    let skippedCount = 0;

    for (const work of works as ORCIDWork[]) {
      const summary = work['work-summary']?.[0];
      if (!summary) continue;

      const externalId = `orcid-${summary['put-code']}`;
      
      // Skip if already exists
      if (existingIds.has(externalId)) {
        skippedCount++;
        continue;
      }

      const title = summary.title?.title?.value || 'Untitled';
      const pubDate = summary['publication-date'];
      const year = pubDate?.year?.value || new Date().getFullYear().toString();
      const month = pubDate?.month?.value || '01';
      const day = pubDate?.day?.value || '01';
      const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

      // Extract DOI if available
      const externalIds = summary['external-ids']?.['external-id'] || [];
      const doiEntry = externalIds.find((e) => e['external-id-type'] === 'doi');
      const doi = doiEntry?.['external-id-value'];
      const doiUrl = doiEntry?.['external-id-url']?.value || (doi ? `https://doi.org/${doi}` : undefined);

      const journalTitle = summary['journal-title']?.value;

      newItems.push({
        source: 'orcid',
        external_id: externalId,
        status: 'pending',
        raw_data: work,
        suggested_artifact: {
          title,
          type: 'paper',
          date,
          summary: journalTitle 
            ? `Published in ${journalTitle} (${year})` 
            : `${summary.type?.replace(/_/g, ' ').toLowerCase() || 'Publication'} from ${year}`,
          mode_visibility: 'both',
          section: 'publications',
          source_ids: {
            doi: doi || null,
            orcid: `${orcid_id}/${summary['put-code']}`,
          },
          links: {
            paper: doiUrl || null,
          },
        },
        discovered_at: new Date().toISOString(),
      });
    }

    // Insert new items into database
    let insertedCount = 0;
    if (newItems.length > 0) {
      const { data: inserted, error } = await supabase
        .from('inbox_items')
        .insert(newItems)
        .select();

      if (error) {
        console.error('Database insert error:', error);
        return new Response(
          JSON.stringify({ error: `Database error: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      insertedCount = inserted?.length || 0;
    }

    console.log(`Inserted ${insertedCount} new items, skipped ${skippedCount} duplicates`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        inserted: insertedCount,
        skipped: skippedCount,
        total: works.length,
        syncedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in sync-orcid:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
