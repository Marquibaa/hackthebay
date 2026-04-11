import { lookupUser } from "@/lib/store";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface FraudFactor {
  label: string;
  impact: "positive" | "negative" | "neutral";
  note: string;
}

export interface FraudAssessment {
  riskScore: number;
  riskLevel: "low" | "medium" | "high";
  factors: FraudFactor[];
  summary: string;
  userFound: boolean;
  resolvedName?: string;
}

function buildPrompt(
  nameOrEmail: string,
  amountUSD: number,
  rating: number,
  totalTrades: number,
  disputeCount: number,
  accountAgeDays: number
): string {
  return `You are a fraud risk analyst for VaultPay, an international crypto escrow platform.
Analyze this transaction and return ONLY valid JSON — no markdown, no explanation outside the JSON.

Recipient: ${nameOrEmail}
Escrow amount: $${amountUSD} USD

Recipient profile:
- Community rating: ${rating}/5
- Total completed trades: ${totalTrades}
- Disputes filed against them: ${disputeCount}
- Account age: ${accountAgeDays} days

Return a JSON object with exactly this shape:
{
  "riskScore": <integer 0-100>,
  "riskLevel": <"low" | "medium" | "high">,
  "factors": [
    {
      "label": <short factor name>,
      "impact": <"positive" | "negative" | "neutral">,
      "note": <one sentence explanation>
    }
  ],
  "summary": <2-3 sentence plain-English risk summary>
}

Guidelines:
- riskScore 0-30 = low, 31-65 = medium, 66-100 = high
- Include 4-6 factors covering: rating, trade history, disputes, escrow amount, account age
- Be objective and concise`;
}

export async function assessFraudRisk(
  nameOrEmail: string,
  amountUSD: number
): Promise<FraudAssessment> {
  if (!GEMINI_API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is not set. Add it to your .env file.");
  }

  // Look up user from the store
  const user = lookupUser(nameOrEmail);

  // If user not found, use conservative defaults so Gemini still runs
  const rating = user?.rating ?? 2.5;
  const totalTrades = user?.totalTrades ?? 0;
  const disputeCount = user?.disputeCount ?? 0;
  const accountAgeDays = user?.accountAgeDays ?? 30;

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(nameOrEmail, amountUSD, rating, totalTrades, disputeCount, accountAgeDays) }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const raw: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const clean = raw.replace(/```json|```/g, "").trim();

  try {
    const parsed = JSON.parse(clean);
    return {
      ...parsed,
      userFound: !!user,
      resolvedName: user?.name,
    } as FraudAssessment;
  } catch {
    throw new Error(`Failed to parse Gemini response: ${clean}`);
  }
}
