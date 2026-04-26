import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getCategory, tournament } from "@/lib/tournament";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

function asText(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  const form = await request.formData();
  const playerName = asText(form.get("playerName"));
  const email = asText(form.get("email")).toLowerCase();
  const phone = asText(form.get("phone"));
  const categoryId = asText(form.get("categoryId"));
  const partnerName = asText(form.get("partnerName"));
  const teamName = asText(form.get("teamName"));
  const category = getCategory(categoryId);

  if (!playerName || !email || !phone || !category) {
    return NextResponse.json({ error: "入力内容に不足があります" }, { status: 400 });
  }

  const { count, error: countError } = await supabaseAdmin
    .from("registrations")
    .select("id", { count: "exact", head: true })
    .eq("tournament_id", tournament.id)
    .eq("category_id", category.id)
    .eq("payment_status", "paid");

  if (countError) return NextResponse.json({ error: countError.message }, { status: 500 });
  if ((count ?? 0) >= category.capacity) {
    return NextResponse.json({ error: "このカテゴリは定員に達しました" }, { status: 409 });
  }

  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: email,
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cancel`,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: tournament.currency,
          unit_amount: category.price,
          product_data: {
            name: `${tournament.name} - ${category.name}`,
          },
        },
      },
    ],
    metadata: {
      tournamentId: tournament.id,
      tournamentName: tournament.name,
      categoryId: category.id,
      categoryName: category.name,
      playerName,
      email,
      phone,
      partnerName,
      teamName,
    },
  });

  if (!session.url) return NextResponse.json({ error: "Stripe決済URLを作成できませんでした" }, { status: 500 });
  return NextResponse.redirect(session.url, 303);
}
