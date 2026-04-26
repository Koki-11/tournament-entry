import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook署名設定が不足しています" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata ?? {};

    const row = {
      tournament_id: metadata.tournamentId,
      tournament_name: metadata.tournamentName,
      category_id: metadata.categoryId,
      category_name: metadata.categoryName,
      player_name: metadata.playerName,
      email: metadata.email,
      phone: metadata.phone,
      partner_name: metadata.partnerName || null,
      team_name: metadata.teamName || null,
      stripe_session_id: session.id,
      stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      raw_event: event,
    };

    const { error } = await supabaseAdmin
      .from("registrations")
      .upsert(row, { onConflict: "stripe_session_id" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
