import plaidClient from "~/lib/plaidClient";

export async function getPlaidAccountDetails(accessToken: string) {
  try {
    const response = await plaidClient.authGet({
      access_token: accessToken,
    });

    const { accounts, numbers } = response.data;

    // Check if accounts exist and are not empty
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found for this user");
    }

    // Check if ACH details exist in the numbers field
    if (!numbers?.ach || numbers.ach.length === 0) {
      throw new Error("No ACH details found for this user");
    }

    // Get the first ACH entry (typically one account)
    const achDetails = numbers.ach[0];

    // Ensure achDetails is defined
    if (!achDetails?.account || !achDetails.routing) {
      throw new Error("ACH details are incomplete or missing");
    }

    // Get account information from the accounts list (optional use)
    const account = accounts.find(
      (acc) => acc.account_id === achDetails.account_id,
    );

    // Account type (with fallback if not available)
    const accountType = account?.subtype ?? "unknown"; // fallback to "unknown"

    // Return data, omitting the address since it doesn't exist on AccountBase
    return {
      routingNumber: achDetails.routing,
      accountNumber: achDetails.account,
      accountType,
      address: {}, // Placeholder, as the address property is not available in AccountBase
    };
  } catch (error) {
    console.error("Error fetching account details from Plaid:", error);
    throw error;
  }
}
