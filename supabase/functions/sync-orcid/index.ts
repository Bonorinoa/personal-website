import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

interface InboxItem {
  id: string;
  source: 'orcid';
  discoveredAt: string;
  status: 'pending';
  rawData: unknown;
  suggestedArtifact: {
    title: string;
    type: 'paper';
    date: string;
    summary: string;
    mode_visibility: 'both';
    section: 'publications';
    source_ids?: {
      doi?: string;
      orcid?: string;
    };
    links?: {
      paper?: string;
    };
  };
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

    // Transform ORCID works to InboxItems
    const inboxItems: InboxItem[] = works.map((work: ORCIDWork) => {
      const summary = work['work-summary']?.[0];
      if (!summary) return null;

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

      return {
        id: `orcid-${summary['put-code']}`,
        source: 'orcid' as const,
        discoveredAt: new Date().toISOString(),
        status: 'pending' as const,
        rawData: work,
        suggestedArtifact: {
          title,
          type: 'paper' as const,
          date,
          summary: journalTitle 
            ? `Published in ${journalTitle} (${year})` 
            : `${summary.type?.replace(/_/g, ' ').toLowerCase() || 'Publication'} from ${year}`,
          mode_visibility: 'both' as const,
          section: 'publications' as const,
          source_ids: {
            doi: doi || undefined,
            orcid: `${orcid_id}/${summary['put-code']}`,
          },
          links: {
            paper: doiUrl || undefined,
          },
        },
      };
    }).filter(Boolean);

    return new Response(
      JSON.stringify({ 
        success: true, 
        items: inboxItems,
        count: inboxItems.length,
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
