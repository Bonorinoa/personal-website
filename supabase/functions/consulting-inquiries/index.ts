import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ADMIN_EMAILS = [
  'agonz439@asu.edu',
  'augusto.gonzalez-bonorino@cgu.edu',
  'agbonorino21@gmail.com',
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace('Bearer ', '');

    const authClient = createClient(supabaseUrl, anonKey);
    const { data: userData } = await authClient.auth.getUser(token);
    const email = userData?.user?.email?.toLowerCase();

    if (!email || !ADMIN_EMAILS.includes(email)) {
      return new Response(JSON.stringify({ error: 'Not authorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {};

    if (body?.action === 'mark') {
      const { error } = await admin
        .from('consulting_inquiries')
        .update({ status: body.status === 'new' ? 'new' : 'read' })
        .eq('id', body.id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data, error } = await admin
      .from('consulting_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200);
    if (error) throw error;

    return new Response(JSON.stringify({ inquiries: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    console.error('consulting-inquiries failed:', message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
