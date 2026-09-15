import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

export function normalizeToE164(rawPhone: string): string | null {
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (rawPhone.startsWith("+") && digits.length >= 8) return `+${digits}`;
  return null;
}

export async function sendTableReadyText(toE164: string, name: string, partySize: number) {
  if (!accountSid || !authToken || !fromNumber) {
    throw new Error(
      "Missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_PHONE_NUMBER environment variables"
    );
  }

  const client = twilio(accountSid, authToken);

  return client.messages.create({
    to: toE164,
    from: fromNumber,
    body: `Hi ${name}, your table for ${partySize} is ready! Reply to let us know you're on your way, and head to the host stand.`,
  });
}

/**
 * Confirms an inbound webhook request actually came from Twilio. Skips the
 * check in development when there's no signature to verify against, so the
 * endpoint can be curl-tested locally without a real Twilio request; always
 * enforced in production.
 */
export function isValidInboundRequest(
  signature: string | null,
  url: string,
  params: Record<string, string>
): boolean {
  if (!signature) return process.env.NODE_ENV !== "production";
  if (!authToken) return false;
  return twilio.validateRequest(authToken, signature, url, params);
}
