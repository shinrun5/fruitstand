import { supabaseAdmin } from "@/lib/supabase";
import { DEFAULT_NOTIFY_MESSAGE_TEMPLATE } from "@/lib/twilio";

const NOTIFY_MESSAGE_TEMPLATE_KEY = "notify_message_template";

export async function getNotifyMessageTemplate(): Promise<string> {
  const { data } = await supabaseAdmin
    .from("settings")
    .select("value")
    .eq("key", NOTIFY_MESSAGE_TEMPLATE_KEY)
    .maybeSingle();

  return data?.value ?? DEFAULT_NOTIFY_MESSAGE_TEMPLATE;
}

export async function setNotifyMessageTemplate(template: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from("settings")
    .upsert({ key: NOTIFY_MESSAGE_TEMPLATE_KEY, value: template });

  if (error) throw new Error(error.message);
}
