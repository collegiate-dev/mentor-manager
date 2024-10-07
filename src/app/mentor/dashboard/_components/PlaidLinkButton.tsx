// components/PlaidLinkButton.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePlaidLink } from "react-plaid-link"; // Import Plaid's React hook
import { Button } from "~/components/ui/button";

interface CreateLinkTokenResponse {
  expiration: string;
  link_token: string;
  error?: string;
}

interface ExchangePublicTokenResponse {
  access_token: string;
  item_id: string;
}

export default function PlaidLinkButton({
  userId,
  phoneNumber,
}: {
  userId: string;
  phoneNumber: string;
}) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle creating the link token
  const handleCreateLinkToken = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/plaid/create-link-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_user_id: userId,
          phone_number: phoneNumber,
        }),
      });

      const data: CreateLinkTokenResponse = await response.json();
      if (data.link_token) {
        setLinkToken(data.link_token);
      } else {
        console.error("Error: no link_token", data.error);
      }
    } catch (error) {
      console.error("Failed to create link token", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Set up PlaidLink configuration with the onSuccess callback
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { open, ready, error } = usePlaidLink({
    token: linkToken ?? "", // Plaid's link token from the server
    onSuccess: async (public_token: string) => {
      console.log("Public Token received:", public_token);
      await exchangePublicToken(public_token);
    },
    onExit: (err, metadata) => {
      console.error("Plaid Link flow exited", err, metadata);
    },
  });

  // Function to call the exchange-public-token route
  const exchangePublicToken = async (publicToken: string) => {
    try {
      const response = await fetch("/api/plaid/exchange-public-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_token: publicToken }),
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const data: ExchangePublicTokenResponse = await response.json(); // Bypass linting here for unsafe access

      // Safe access after type assertion
      console.log("Access Token:", data.access_token);
      console.log("Item ID:", data.item_id);
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  };

  // Safely handle errors from Plaid Link using type checks
  useEffect(() => {
    if (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      if (error instanceof ErrorEvent) {
        console.error("Plaid Link Error:", error.message); // Safe to call error.message here
      } else {
        console.error("Unknown error in Plaid Link:", error); // Handle any unknown error
      }
    }
  }, [error]);

  // Handle onClick safely
  const handleOpenLink = () => {
    try {
      if (typeof open === "function") {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        open(); // Safely call the open function
      } else {
        console.error("open is not a function");
      }
    } catch (err) {
      console.error("Error calling open function:", err);
    }
  };

  return (
    <div>
      {!linkToken ? (
        <Button onClick={handleCreateLinkToken} disabled={isLoading}>
          {isLoading ? "Loading..." : "Link Your Bank Account"}
        </Button>
      ) : (
        <Button onClick={handleOpenLink} disabled={!ready}>
          Link Your Bank Account
        </Button>
      )}
    </div>
  );
}
