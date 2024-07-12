import { type NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import { type MercuryResponse } from "~/api/queries";

export async function sendMoneyToRecipient(
  recipientId: string,
  amount: number,
  memo?: string,
): Promise<MercuryResponse> {
  const accountId = process.env.MERCURY_ACCOUNT_ID;
  const url = `https://backend.mercury.com/api/v1/account/${accountId}/request-send-money`;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const idempotencyKey: string = uuidv4();
  const apiToken = process.env.MERCURY_SEND_MONEY_TOKEN;
  const paymentMethod = "ach";

  if (!accountId) {
    throw new Error("Account ID is required in .env");
  }

  const payload = {
    id: accountId, // Include the account ID as required
    recipientId,
    amount,
    paymentMethod,
    idempotencyKey,
    memo,
  };

  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const json = (await response.json()) as MercuryResponse;
    console.log("Send Money Response:", json);
    return json;
  } catch (err) {
    console.error("Error sending money:", err);
    throw new Error("Error sending money");
  }
}

// Route handler for sending money
export async function POST(request: NextRequest) {
  try {
    console.log("Request received for sending money");

    const requestData = await request.json();
    const { recipientId, amount, paymentMethod, memo } = requestData;

    if (!recipientId || !amount || !paymentMethod) {
      throw new Error("Missing required fields");
    }

    console.log("Request data parsed:", requestData);

    const result = await sendMoneyToRecipient(
      recipientId as string,
      amount as number,
      memo as string | undefined,
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error in POST handler for sending money:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
