// app/api/plaid/create-link-token/route.ts
import { NextResponse } from "next/server";
import plaidClient from "~/lib/plaidClient";
import { type LinkTokenCreateRequest, CountryCode, Products } from "plaid";

export async function POST() {
  const request: LinkTokenCreateRequest = {
    user: {
      client_user_id: "user-id", // Replace with dynamic user ID from clerk
    },
    client_name: "Collegiate Mentor Manager", // has to be less than 30 characters
    products: [Products.Auth],
    country_codes: [CountryCode.Us],
    language: "en",
    required_if_supported_products: [Products.Identity],
    // webhook: "https://sample-web-hook.com",
    // redirect_uri: "https://domainname.com/oauth-page.html",
    auth: {
      automated_microdeposits_enabled: true,
    },
  };

  try {
    const response = await plaidClient.linkTokenCreate(request);
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
