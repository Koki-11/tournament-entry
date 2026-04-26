import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function csvEscape(value: unknown) {
  const s = String(value ?? "");
  return `"${s.replaceAll('"', '""')}"`;
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("registrations")
    .select("created_at,tournament_name,category_name,player_name,email,phone,partner_name,team_name,amount_total,currency,payment_status,stripe_session_id")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const headers = ["created_at","tournament_name","category_name","player_name","email","phone","partner_name","team_name","amount_total","currency","payment_status","stripe_session_id"];
  const rows = [headers.join(","), ...(data ?? []).map((row) => headers.map((h) => csvEscape((row as Record<string, unknown>)[h])).join(","))];

  return new Response(rows.join("\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=registrations.csv",
    },
  });
}
