import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      throw new Error("Unauthorized");
    }

    const { email } = await req.json();

    // Create scan record
    const { data: scan, error: scanError } = await supabaseClient
      .from("dark_web_scans")
      .insert({
        user_id: user.id,
        email,
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (scanError) throw scanError;

    // Simulate dark web scanning with known breaches
    const knownBreaches = [
      {
        breach_name: "LinkedIn Data Breach 2021",
        breach_date: "2021-06-22",
        leaked_data: ["email", "full_name", "phone_number"],
        severity: "high"
      },
      {
        breach_name: "Adobe Data Breach 2013",
        breach_date: "2013-10-04",
        leaked_data: ["email", "password", "username"],
        severity: "critical"
      }
    ];

    // Randomly simulate finding breaches (60% chance)
    const foundBreaches = Math.random() > 0.4 ? knownBreaches.slice(0, Math.floor(Math.random() * 2) + 1) : [];

    // Insert leaked credentials
    for (const breach of foundBreaches) {
      await supabaseClient.from("leaked_credentials").insert({
        user_id: user.id,
        scan_id: scan.id,
        email,
        breach_name: breach.breach_name,
        breach_date: breach.breach_date,
        leaked_data: breach.leaked_data,
        severity: breach.severity,
      });
    }

    // Update scan as completed
    await supabaseClient
      .from("dark_web_scans")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        breaches_found: foundBreaches.length,
      })
      .eq("id", scan.id);

    // Create alert if breaches found
    if (foundBreaches.length > 0) {
      await supabaseClient.from("alerts").insert({
        user_id: user.id,
        type: "dark_web",
        severity: foundBreaches.some(b => b.severity === "critical") ? "critical" : "high",
        title: "Data Breach Detected",
        message: `Found ${foundBreaches.length} data breach(es) for ${email}`,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        scan_id: scan.id,
        breaches_found: foundBreaches.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Dark web scan error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
