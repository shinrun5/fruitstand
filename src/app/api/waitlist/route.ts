import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { normalizeToE164 } from "@/lib/twilio";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("waitlist_entries")
    .select("*")
    .in("status", ["waiting", "notified"])
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entries: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const phoneRaw = typeof body.phone === "string" ? body.phone.trim() : "";
  const partySize = Number(body.party_size);

  if (!name) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!Number.isInteger(partySize) || partySize < 1) {
    return NextResponse.json({ error: "Party size must be a positive number." }, { status: 400 });
  }

  const phone = normalizeToE164(phoneRaw);
  if (!phone) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("waitlist_entries")
    .insert({ name, party_size: partySize, phone, status: "waiting" })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ entry: data }, { status: 201 });
}
