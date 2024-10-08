import { NextResponse } from "next/server";
import plaidClient from "~/lib/plaidClient";
import { type ItemPublicTokenExchangeRequest } from "plaid";
import { updateMentorDetails, getMentorDetails } from "~/api/queries";
import { addRecipientToMercury } from "../../mercury/newRecipient/route";

export async function POST(request: Request) {
  try {
    // Extract the public_token and mentorId from the request body
    const {
      public_token,
      mentorId,
    }: { public_token: string; mentorId: string } = await request.json();

    if (!public_token || !mentorId) {
      return NextResponse.json(
        { error: "Missing public_token or mentorId" },
        { status: 400 },
      );
    }

    // Step 1: Exchange the public_token for access_token using Plaid API
    const plaidRequest: ItemPublicTokenExchangeRequest = { public_token };
    const plaidResponse =
      await plaidClient.itemPublicTokenExchange(plaidRequest);

    // Extract the access_token and item_id from Plaid's response
    const accessToken = plaidResponse.data.access_token;
    const itemId = plaidResponse.data.item_id;

    // Step 2: Update the mentor's details with the access token
    await updateMentorDetails({
      id: mentorId,
      plaidAccessToken: accessToken,
    });

    // Step 3: Retrieve full mentor details
    const mentorDetails = await getMentorDetails(mentorId);

    if (!mentorDetails) {
      return NextResponse.json(
        { error: "Mentor details not found" },
        { status: 404 },
      );
    }

    // Step 4: add to mercury
    // Ensure `id` is not undefined and pass all mentor details
    await fetch("/api/mercury/newRecipient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...mentorDetails,
        plaidAccessToken: accessToken,
        id: mentorDetails.id,
      }),
    });

    // Step 5: Return success response
    return NextResponse.json({
      success: true,
      access_token: accessToken,
      item_id: itemId,
    });
  } catch (error) {
    // Error handling
    if (error instanceof Error) {
      console.error("Error exchanging public token:", error.message);
      return NextResponse.json(
        { error: "Failed to exchange public token", details: error.message },
        { status: 500 },
      );
    } else {
      console.error("Unknown error exchanging public token:", error);
      return NextResponse.json(
        { error: "Failed to exchange public token", details: "Unknown error" },
        { status: 500 },
      );
    }
  }
}
