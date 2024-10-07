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

  // Function to call the exchange-public-token route
  const exchangePublicToken = async (publicToken: string, userId: string) => {
    try {
      const response = await fetch("/api/plaid/exchange-public-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public_token: publicToken, mentorId: userId }),
      });

      const data: ExchangePublicTokenResponse = await response.json();
      console.log("Access Token:", data.access_token);
      console.log("Item ID:", data.item_id);
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  };

  // Set up PlaidLink configuration
  const { open, ready, error } = usePlaidLink({
    token: linkToken ?? "", // Plaid's link token from the server
    onSuccess: (public_token: string) => {
      console.log("Public Token received:", public_token);
      // Wrap the async function call in a non-async function
      exchangePublicToken(public_token, userId).catch((err) => {
        console.error("Error in exchangePublicToken:", err);
      });
    },
    onExit: (err, metadata) => {
      console.error("Plaid Link flow exited", err, metadata);
    },
  });

  // Safely handle errors from Plaid Link using type checks
  useEffect(() => {
    if (error) {
      if (error instanceof ErrorEvent) {
        console.error("Plaid Link Error:", error.message);
      } else {
        console.error("Unknown error in Plaid Link:", error);
      }
    }
  }, [error]);

  // Handle onClick safely
  const handleOpenLink = () => {
    try {
      if (typeof open === "function") {
        open();
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
