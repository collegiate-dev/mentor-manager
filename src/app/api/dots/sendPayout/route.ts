import { type NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";
import { type PhoneNumber } from "~/api/queries";

export async function sendPayout(
  mentorId: string,
  amount: number,
  phoneNumber: PhoneNumber,
): Promise<DotsPayoutResponse> {
  const apiUrl = "https://api.dots.dev/api/v2/payouts/send-payout";
  const authToken = process.env.DOTS_API_TOKEN; // Set your API token in .env
  if (!authToken) {
    throw new Error("API token is required in .env");
  }
  const idempotencyKey = uuidv4();
  const payload = {
    amount,
    user_id: mentorId,
    payee: {
      country_code: phoneNumber.country_code,
      phone_number: phoneNumber.phone_number,
    },
    // can add a memo to send with the payout link
    // delivery: {
    //   message: memo,
    // },
    force_collect_compliance_information: true,
    // can add some some other thigs later
    //additional_steps: ["compliance"], // can add onto this with stuff like background check later
    tax_exempt: true, //change to false in prod
    idempotency_key: idempotencyKey,
    payout_fee_party: "platform",
  };

  const options = {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(apiUrl, options);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    return (await response.json()) as DotsPayoutResponse;
  } catch (err) {
    console.error("Error sending payout:", err);
    throw new Error("Error sending payout");
  }
}

// Route handler for sending payout
export async function POST(request: NextRequest) {
  try {
    console.log("Request received for sending payout");

    const requestData = await request.json();
    const { recipientId, amount, phoneNumber } = requestData;

    if (!recipientId || !amount) {
      throw new Error("Missing required fields");
    }

    console.log("Request data parsed:", requestData);

    const result = await sendPayout(
      recipientId as string,
      amount as number,
      phoneNumber as PhoneNumber,
    );
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error in POST handler for sending payout:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// Define the type for the response
type DotsPayoutResponse = {
  id: string;
  created: string;
  link: string;
  amount: number;
  status: string;
  payee: {
    first_name: string;
    last_name: string;
    email: string;
    country_code: string;
    phone_number: string;
  };
  delivery: {
    method: string;
    email: string;
    country_code: string;
    phone_number: string;
  };
  tax_exempt: boolean;
  claimed_user_id: string;
  flow_id: string;
  metadata: string;
};
