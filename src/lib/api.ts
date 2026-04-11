// Client for the Flask blockchain API (blockchain/app.py)
// Run the Flask server with: cd blockchain && python app.py
// It listens on http://127.0.0.1:5000 by default

const BASE_URL = "http://127.0.0.1:5000";

export interface CreateEscrowPayload {
  sender: string;
  recipient: string;
  amount: number;
  from_currency: string;
  to_currency: string;
  exchange_rate: number;
}

export interface EscrowResponse {
  message: string;
}

export interface ChainBlock {
  index: number;
  timestamp: number;
  previous_hash: string;
  transactions: ChainTransaction[];
}

export interface ChainTransaction {
  type: string;
  status: "locked" | "released" | "refunded";
  sender: string;
  recipient: string;
  amount: number;
  from_currency: string;
  to_currency: string;
  exchange_rate: number;
  timestamp: number;
  released_at?: number;
  refunded_at?: number;
}

export interface ChainResponse {
  chain: ChainBlock[];
  length: number;
}

async function post<T>(path: string, body: object): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${path} failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API ${path} failed (${res.status})`);
  return res.json() as Promise<T>;
}

export const flaskApi = {
  createEscrow: (payload: CreateEscrowPayload) =>
    post<EscrowResponse>("/escrow/create", payload),

  releaseEscrow: (escrow_id: string) =>
    post<{ success: boolean }>("/escrow/release", { escrow_id }),

  refundEscrow: (escrow_id: string) =>
    post<{ success: boolean }>("/escrow/refund", { escrow_id }),

  getChain: () => get<ChainResponse>("/chain"),
};
