// components/PlaidLinkButton.tsx
"use client";

import React, { useState } from "react";

interface CreateLinkTokenResponse {
  link_token: string;
  error: string;
}

export default function PlaidLinkButton({
  userId,
  phoneNumber,
}: {
  userId: string;
  phoneNumber: string;
}) {
  const [hostedUrl, setHostedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
        setHostedUrl(data.link_token);
      } else {
        console.error("Error creating link token:", data.error);
      }
    } catch (error) {
      console.error("Failed to create link token:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!hostedUrl ? (
        <button onClick={handleCreateLinkToken} disabled={isLoading}>
          {isLoading ? "Loading..." : "Link Your Bank Account"}
        </button>
      ) : (
        <a href={hostedUrl} target="_blank" rel="noopener noreferrer">
          Complete Your Bank Account Linking
        </a>
      )}
    </div>
  );
}
