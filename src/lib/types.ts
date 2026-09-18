export type WaitlistStatus = "waiting" | "notified" | "seated" | "cancelled" | "no_show";

export interface WaitlistEntry {
  id: string;
  name: string;
  party_size: number;
  phone: string;
  status: WaitlistStatus;
  created_at: string;
  notified_at: string | null;
  confirmed_at: string | null;
  last_reply: string | null;
  /** Count of this phone number's past no-show entries. Computed by the API, not stored per-row. */
  no_show_count: number;
  /** Count of this phone number's past completed visits (seated, no-show, or cancelled). Computed by the API. */
  visit_count: number;
}
