import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendTableReadyText } from "@/lib/twilio";

type Action = "notify" | "seated" | "cancelled";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const action = body.action as Action;

  if (!["notify", "seated", "cancelled"].includes(action)) {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  const { data: entry, error: fetchError } = await supabaseAdmin
    .from("waitlist_entries")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !entry) {
    return NextResponse.json({ error: "Entry not found." }, { status: 404 });
  }

  if (action === "notify") {
    try {
      await sendTableReadyText(entry.phone, entry.name, entry.party_size);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to send text.";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    const { data, error } = await supabaseAdmin
      .from("waitlist_entries")
      .update({ status: "notified", notified_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ entry: data });
  }

  const { data, error } = await supabaseAdmin
    .from("waitlist_entries")
    .update({ status: action })
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ entry: data });
}
