// Central mock database — all pages read from here.
// When a real backend/DB is ready, replace these with API calls.

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  rating: number;       // 0–5
  totalTrades: number;
  disputeCount: number;
  accountAgeDays: number;
  badge: "Trusted" | "Verified" | "New" | "Flagged";
  country: string;
}

export interface Transaction {
  id: string;
  party: string;
  partyEmail: string;
  amount: string;       // formatted string e.g. "$2,500.00"
  amountRaw: number;    // numeric for calculations
  currency: string;
  type: "sent" | "received";
  status: "in_escrow" | "completed" | "pending" | "flagged" | "disputed";
  date: string;
  country: string;
  fraudScore: number;
  escrowDays: number;
  description?: string;
  escrowId?: string;    // set when created via Flask API
}

// ── User profiles ──────────────────────────────────────────────────────────

export const userDatabase: UserProfile[] = [
  {
    id: "u1",
    name: "Alice Johnson",
    email: "alice@example.com",
    rating: 4.9,
    totalTrades: 142,
    disputeCount: 0,
    accountAgeDays: 1200,
    badge: "Trusted",
    country: "US",
  },
  {
    id: "u2",
    name: "Bob Williams",
    email: "bob@example.com",
    rating: 4.5,
    totalTrades: 67,
    disputeCount: 0,
    accountAgeDays: 540,
    badge: "Verified",
    country: "UK",
  },
  {
    id: "u3",
    name: "Carlos Martinez",
    email: "carlos@example.com",
    rating: 3.8,
    totalTrades: 22,
    disputeCount: 1,
    accountAgeDays: 210,
    badge: "Verified",
    country: "MX",
  },
  {
    id: "u4",
    name: "Diana Chen",
    email: "diana@example.com",
    rating: 4.8,
    totalTrades: 89,
    disputeCount: 0,
    accountAgeDays: 980,
    badge: "Trusted",
    country: "CN",
  },
  {
    id: "u5",
    name: "Erik Müller",
    email: "erik@example.com",
    rating: 2.1,
    totalTrades: 4,
    disputeCount: 1,
    accountAgeDays: 90,
    badge: "Flagged",
    country: "DE",
  },
  {
    id: "u6",
    name: "Fatima Al-Rashid",
    email: "fatima@example.com",
    rating: 4.7,
    totalTrades: 203,
    disputeCount: 0,
    accountAgeDays: 1500,
    badge: "Trusted",
    country: "AE",
  },
  {
    id: "u7",
    name: "George Okafor",
    email: "george@example.com",
    rating: 4.1,
    totalTrades: 18,
    disputeCount: 0,
    accountAgeDays: 160,
    badge: "Verified",
    country: "NG",
  },
  {
    id: "u8",
    name: "Hana Tanaka",
    email: "hana@example.com",
    rating: 3.2,
    totalTrades: 11,
    disputeCount: 2,
    accountAgeDays: 300,
    badge: "Flagged",
    country: "JP",
  },
];

export function lookupUser(nameOrEmail: string): UserProfile | null {
  const q = nameOrEmail.trim().toLowerCase();
  return (
    userDatabase.find(
      (u) => u.email.toLowerCase() === q || u.name.toLowerCase() === q
    ) ?? null
  );
}

// ── Transactions ───────────────────────────────────────────────────────────

// Mutable so SendMoney can push new transactions in-session
export const transactions: Transaction[] = [
  {
    id: "TXN-001", party: "Alice Johnson", partyEmail: "alice@example.com",
    amount: "$2,500.00", amountRaw: 2500, currency: "USD",
    type: "sent", status: "in_escrow", date: "Apr 10, 2026",
    country: "US", fraudScore: 5, escrowDays: 7,
  },
  {
    id: "TXN-002", party: "Bob Williams", partyEmail: "bob@example.com",
    amount: "$1,200.00", amountRaw: 1200, currency: "GBP",
    type: "received", status: "completed", date: "Apr 10, 2026",
    country: "UK", fraudScore: 2, escrowDays: 7,
  },
  {
    id: "TXN-003", party: "Carlos Martinez", partyEmail: "carlos@example.com",
    amount: "$4,800.00", amountRaw: 4800, currency: "USD",
    type: "sent", status: "pending", date: "Apr 9, 2026",
    country: "MX", fraudScore: 15, escrowDays: 14,
  },
  {
    id: "TXN-004", party: "Diana Chen", partyEmail: "diana@example.com",
    amount: "$890.00", amountRaw: 890, currency: "USD",
    type: "received", status: "completed", date: "Apr 8, 2026",
    country: "CN", fraudScore: 3, escrowDays: 3,
  },
  {
    id: "TXN-005", party: "Erik Müller", partyEmail: "erik@example.com",
    amount: "$3,200.00", amountRaw: 3200, currency: "EUR",
    type: "sent", status: "flagged", date: "Apr 7, 2026",
    country: "DE", fraudScore: 78, escrowDays: 7,
  },
  {
    id: "TXN-006", party: "Fatima Al-Rashid", partyEmail: "fatima@example.com",
    amount: "$5,100.00", amountRaw: 5100, currency: "AED",
    type: "received", status: "completed", date: "Apr 6, 2026",
    country: "AE", fraudScore: 1, escrowDays: 7,
  },
  {
    id: "TXN-007", party: "George Okafor", partyEmail: "george@example.com",
    amount: "$750.00", amountRaw: 750, currency: "NGN",
    type: "sent", status: "in_escrow", date: "Apr 5, 2026",
    country: "NG", fraudScore: 8, escrowDays: 3,
  },
  {
    id: "TXN-008", party: "Hana Tanaka", partyEmail: "hana@example.com",
    amount: "$2,100.00", amountRaw: 2100, currency: "JPY",
    type: "received", status: "disputed", date: "Apr 4, 2026",
    country: "JP", fraudScore: 45, escrowDays: 14,
  },
];

export function addTransaction(tx: Transaction) {
  transactions.unshift(tx);
}

export function updateTransactionStatus(
  id: string,
  status: Transaction["status"]
) {
  const tx = transactions.find((t) => t.id === id);
  if (tx) tx.status = status;
}

// ── Derived helpers used by dashboard ─────────────────────────────────────

export function getBalance(): number {
  return transactions
    .filter((t) => t.status === "completed")
    .reduce((acc, t) => acc + (t.type === "received" ? t.amountRaw : -t.amountRaw), 24580);
}

export function getInEscrowTotal(): number {
  return transactions
    .filter((t) => t.status === "in_escrow" && t.type === "sent")
    .reduce((acc, t) => acc + t.amountRaw, 0);
}

export function getActiveEscrowCount(): number {
  return transactions.filter((t) => t.status === "in_escrow").length;
}
