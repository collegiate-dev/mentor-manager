// /app/api/plaid/get-link-token-details/route.ts
import plaidClient from "~/lib/plaidClient";
import { NextResponse } from "next/server";

// Helper function to fetch link token details
export const getLinkToken = async (linkToken: string) => {
  const plaidRequest = { link_token: linkToken };
  try {
    const response = await plaidClient.linkTokenGet(plaidRequest);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching link token details:", error.message);
      throw new Error(`Plaid API error: ${error.message}`);
    } else {
      console.error("Unknown error fetching link token details:", error);
      throw new Error("An unknown error occurred");
    }
  }
};

// Route handler to POST link token details
export async function POST(request: Request) {
  try {
    const { link_token }: { link_token: string } = await request.json(); // Ensure link_token is a string
    if (!link_token) {
      return NextResponse.json(
        { error: "Missing link_token" },
        { status: 400 },
      );
    }

    // Use the helper function to fetch the link token details
    const data = await getLinkToken(link_token);

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching link token details:", error.message);
      return NextResponse.json(
        { error: "Failed to fetch link token details", details: error.message },
        { status: 500 },
      );
    } else {
      console.error("Unknown error fetching link token details:", error);
      return NextResponse.json(
        {
          error: "Failed to fetch link token details",
          details: "Unknown error",
        },
        { status: 500 },
      );
    }
  }
}
