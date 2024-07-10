import { type NextRequest, NextResponse } from "next/server";
import fetch from "node-fetch";
import { type MentorDetails, type MercuryResponse } from "~/api/queries";

export async function addRecipientToMercury(
  mentorDetails: MentorDetails,
): Promise<MercuryResponse> {
  const url = "https://backend.mercury.com/api/v1/recipients";
  const apiToken = process.env.MERCURY_SECRET_TOKEN;

  const payload = {
    emails: [mentorDetails.email],
    name: mentorDetails.fullname,
    paymentMethod: mentorDetails.paymentMethod,
    electronicRoutingInfo: {
      address: mentorDetails.electronicRoutingInfo,
      electronicAccountType: mentorDetails.electronicAccountType,
      routingNumber: mentorDetails.routingNumber?.toString() ?? "", // Ensure it's a string
      accountNumber: mentorDetails.accountNumber,
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
    const json = await response.json();
    console.log("Mercury Response:", json);
    return json as MercuryResponse;
  } catch (err) {
    console.error("Error adding recipient to Mercury:", err);
    throw new Error("Error adding recipient to Mercury");
  }
}

// Route handler that uses the reusable function
export async function POST(request: NextRequest) {
  try {
    console.log("Request received");
    const requestData = (await request.json()) as MentorDetails;
    console.log("Request data parsed:", requestData);

    const recipientData: MentorDetails = {
      id: requestData.id,
      email: requestData.email,
      fullname: requestData.fullname,
      paymentMethod: requestData.paymentMethod ?? "electronic",
      electronicRoutingInfo: {
        country: requestData.electronicRoutingInfo!.country ?? "US",
        postalCode: requestData.electronicRoutingInfo!.postalCode,
        region: requestData.electronicRoutingInfo!.region,
        city: requestData.electronicRoutingInfo!.city,
        address1: requestData.electronicRoutingInfo!.address1,
      },
      electronicAccountType: requestData.electronicAccountType ?? "",
      routingNumber: requestData.routingNumber?.toString() ?? "", // Ensure it's a string
      accountNumber: requestData.accountNumber ?? "",
    };

    // Log the type of routingNumber
    console.log("Type of routingNumber:", typeof recipientData.routingNumber);
    console.log("Recipient Data:", recipientData);

    const result = await addRecipientToMercury(recipientData);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error in POST handler:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
