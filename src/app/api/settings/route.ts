import { NextRequest, NextResponse } from "next/server";
import { getNotifyMessageTemplate, setNotifyMessageTemplate } from "@/lib/settings";

export async function GET() {
  const template = await getNotifyMessageTemplate();
  return NextResponse.json({ notify_message_template: template });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const template = typeof body.notify_message_template === "string" ? body.notify_message_template.trim() : "";

  if (!template) {
    return NextResponse.json({ error: "Message can't be empty." }, { status: 400 });
  }
  if (template.length > 500) {
    return NextResponse.json({ error: "Message is too long (500 characters max)." }, { status: 400 });
  }

  await setNotifyMessageTemplate(template);
  return NextResponse.json({ notify_message_template: template });
}
