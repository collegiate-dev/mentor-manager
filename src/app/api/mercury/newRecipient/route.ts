import fetch from "node-fetch";
import { getPlaidAccountDetails } from "~/app/api/plaid/get-account-details-auth/route";
import { type MentorDetails, type MercuryResponse } from "~/api/queries";

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

  const { routingNumber, accountNumber, accountType, address } =
    await getPlaidAccountDetails(mentorDetails.plaidAccessToken);

  const payload = {
    emails: [mentorDetails.email],
    name: `${mentorDetails.firstname} ${mentorDetails.lastname}`, // Use the full name
    paymentMethod: "electronic",
    electronicRoutingInfo: {
      address: address || {}, // Use address from Plaid, if available
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

    const json = await response.json();
    console.log("Mercury Response:", json); // Log the Mercury response for debugging

    return json as MercuryResponse;
  } catch (err) {
    console.error("Error adding recipient to Mercury:", err);
    throw new Error("Error adding recipient to Mercury");
  }
}
