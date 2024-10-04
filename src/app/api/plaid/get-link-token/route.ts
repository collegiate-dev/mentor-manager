// /app/api/plaid/get-link-token-details/route.ts
import plaidClient from "~/lib/plaidClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { link_token } = await request.json(); // extract link_token from the request body
    if (!link_token) {
      return NextResponse.json(
        { error: "Missing link_token" },
        { status: 400 },
      );
    }

    const plaidRequest = { link_token }; // pass link_token into the request object
    const response = await plaidClient.linkTokenGet(plaidRequest);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching link token details:", error);
    return NextResponse.json(
      { error: "Failed to fetch link token details" },
      { status: 500 },
    );
  }
}

export const getLinkToken = async (linkToken: string) => {
  const plaidRequest = { link_token: linkToken };
  try {
    const response = await plaidClient.linkTokenGet(plaidRequest);
    return response.data;
  } catch (error) {
    console.error("Error fetching link token details:", error);
    throw error;
  }
};
