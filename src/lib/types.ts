export type WaitlistStatus = "waiting" | "notified" | "seated" | "cancelled";

export interface WaitlistEntry {
  id: string;
  name: string;
  party_size: number;
  phone: string;
  status: WaitlistStatus;
  created_at: string;
  notified_at: string | null;
}
