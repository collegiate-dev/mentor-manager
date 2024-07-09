import { type NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";

export async function POST(request: NextRequest) {
  const url = "https://backend.mercury.com/api/v1/recipients";
  const apiToken = process.env.MERCURY_SECRET_TOKEN;

  const requestData = await request.json();

  const payload = {
    emails: ["test@example.com"],
    name: "Test Recipe Recipient",
    paymentMethod: "electronic",
    electronicRoutingInfo: {
      address: {
        country: "US",
        postalCode: "94103",
        region: "CA",
        city: "San Francisco",
        address1: "1335 Folsom",
      },
      electronicAccountType: "businessChecking",
      routingNumber: "021000021",
      accountNumber: "3111152261278",
    },
  };

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(url, options);
    const json = await response.json();
    return NextResponse.json(json);
  } catch (err) {
    console.error("error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
