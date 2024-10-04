// /app/api/plaid/exchange-public-token/route.ts
import { NextResponse } from "next/server";
import plaidClient from "~/lib/plaidClient";
import { type ItemPublicTokenExchangeRequest } from "plaid";

export async function POST(request: Request) {
  try {
    // Extract the public_token from the request body
    const { public_token } = await request.json();

    if (!public_token) {
      return NextResponse.json(
        { error: "Missing public_token" },
        { status: 400 },
      );
    }

    // Create the Plaid request for token exchange
    const plaidRequest: ItemPublicTokenExchangeRequest = {
      public_token: public_token,
    };

    // Make the request to Plaid to exchange the public token
    const response = await plaidClient.itemPublicTokenExchange(plaidRequest);

    // Extract the access_token and item_id from Plaid's response
    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;

    // Return the accessToken and itemId in the response
    return NextResponse.json({ access_token: accessToken, item_id: itemId });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    return NextResponse.json(
      { error: "Failed to exchange public token" },
      { status: 500 },
    );
  }
}
