// app/api/plaid/create-link-token/route.ts
import { NextResponse } from "next/server";
import plaidClient from "~/lib/plaidClient";
import { type LinkTokenCreateRequest, CountryCode, Products } from "plaid";

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const { client_user_id, phone_number } = await request.json();

    if (!client_user_id || !phone_number) {
      return NextResponse.json(
        { error: "Missing client_user_id or phone_number" },
        { status: 400 },
      );
    }

    // Create the request object
    const plaidRequest: LinkTokenCreateRequest = {
      user: {
        client_user_id,
        phone_number,
      },
      client_name: "Collegiate Mentor Manager", // Less than 30 characters
      products: [Products.Auth], // Ensure you're using 'auth' to get routing/account numbers
      country_codes: [CountryCode.Us],
      language: "en",
      hosted_link: {
        // delivery_method: HostedLinkDeliveryMethod.Sms, // Send via SMS
        completion_redirect_uri: "https://mentor-manager.vercel.app/", // Redirect URI after completion
        is_mobile_app: false,
        url_lifetime_seconds: 900, // Link lifetime in seconds (15 minutes)
      },
      webhook: "https://wonderwallet.com/webhook_receiver", // Optional webhook for notifications
    };

    // Call the Plaid API to create the link token
    const response = await plaidClient.linkTokenCreate(plaidRequest);
    const linkToken = response.data.link_token;

    // Return the link_token to the client
    return NextResponse.json({ link_token: linkToken });
  } catch (error) {
    console.error("Error creating link token:", error);

    // Return an error response
    return NextResponse.json(
      { error: "Failed to create link token" },
      { status: 500 },
    );
  }
}
