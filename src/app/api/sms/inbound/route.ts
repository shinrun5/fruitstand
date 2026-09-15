import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isValidInboundRequest, normalizeToE164 } from "@/lib/twilio";

const EMPTY_TWIML = `<?xml version="1.0" encoding="UTF-8"?><Response></Response>`;

function twimlResponse() {
  return new NextResponse(EMPTY_TWIML, {
    status: 200,
    headers: { "Content-Type": "text/xml" },
  });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = String(value);
  });

  const signature = request.headers.get("x-twilio-signature");
  if (!isValidInboundRequest(signature, request.url, params)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 403 });
  }

  const from = params.From ? normalizeToE164(params.From) : null;
  const body = params.Body?.trim() ?? "";

  if (from) {
    const { data: entry } = await supabaseAdmin
      .from("waitlist_entries")
      .select("id")
      .eq("phone", from)
      .in("status", ["waiting", "notified"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (entry) {
      await supabaseAdmin
        .from("waitlist_entries")
        .update({ confirmed_at: new Date().toISOString(), last_reply: body })
        .eq("id", entry.id);
    }
  }

  return twimlResponse();
}
