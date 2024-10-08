import { NextResponse } from "next/server";
import fetch from "node-fetch";
import { getPlaidAccountDetails } from "~/app/api/plaid/get-account-details-auth/route";
import {
  addMercuryRecipientId,
  type MentorDetails,
  type MercuryResponse,
} from "~/api/queries";

function mapAccountType(plaidType: string): string {
  switch (plaidType) {
    case "checking":
      return "personalChecking"; // or "businessChecking" if applicable
    case "savings":
      return "personalSavings"; // or "businessSavings" if applicable
    default:
      throw new Error(`Unsupported account type: ${plaidType}`);
  }
}

export async function addRecipientToMercury(
  mentorDetails: MentorDetails,
): Promise<MercuryResponse> {
  const url = "https://backend.mercury.com/api/v1/recipients";
  const apiToken = process.env.MERCURY_SECRET_TOKEN;

  // Fetch the account details from Plaid
  if (!mentorDetails.plaidAccessToken) {
    throw new Error("Plaid access token is missing");
  }

  const { routingNumber, accountNumber, accountType } =
    await getPlaidAccountDetails(mentorDetails.plaidAccessToken);

  const payload = {
    emails: [mentorDetails.email],
    name: `${mentorDetails.firstname} ${mentorDetails.lastname}`, // Use the full name
    paymentMethod: "electronic",
    electronicRoutingInfo: {
      address: mentorDetails.address,
      electronicAccountType: mapAccountType(accountType), // Map the account type correctly
      routingNumber: routingNumber?.toString() ?? "", // Ensure it's a string
      accountNumber: accountNumber,
    },
  };

  console.log("Payload:", payload); // Log the payload

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

    if (!response.ok) {
      const errorDetails = await response.json();
      console.error("Error from Mercury API:", errorDetails);
      throw new Error(
        `Mercury API request failed: ${response.status} ${response.statusText}`,
      );
    }

    // Explicitly type the parsed JSON response
    const json = (await response.json()) as MercuryResponse;

    // Use the correct structure for json.id (assuming json.id exists in the response)
    if (!json.id) {
      throw new Error("Mercury response did not include an ID.");
    }

    await addMercuryRecipientId(mentorDetails.id, json.id);

    console.log("Mercury Response:", json); // Log the Mercury response for debugging

    return json;
  } catch (err) {
    console.error("Error adding recipient to Mercury:", err);
    throw new Error("Error adding recipient to Mercury");
  }
}

export async function POST(request: Request) {
  try {
    // Parse the request body to get the mentor details
    const mentorDetails: MentorDetails = await request.json();

    // Call the addRecipientToMercury function to make the Mercury API request
    const mercuryResponse = await addRecipientToMercury(mentorDetails);

    // Return a successful response
    return NextResponse.json(mercuryResponse, { status: 200 });
  } catch (error) {
    console.error("Error in /api/mercury/newRecipient:", error);

    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message; // Safe to access error.message here
    }

    return NextResponse.json(
      { error: "Failed to add recipient to Mercury", details: errorMessage },
      { status: 500 },
    );
  }
}
