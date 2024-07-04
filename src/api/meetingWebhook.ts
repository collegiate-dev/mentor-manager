import type { NextApiRequest, NextApiResponse } from "next";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import crypto from "crypto";
import { meetings } from "~/server/db/schema"; // Import the meetings schema
import { WebhookPayload, WebhookField } from "~/server/db/types"; // Import the types

// Initialize the Drizzle ORM
const db = drizzle(sql);

interface ParsedFields {
  matchId?: number;
  estimatedTime?: number;
  meetingNotes?: string;
}

// Utility function to verify Tally signature
function verifyTallySignature(
  payload: WebhookPayload,
  receivedSignature: string,
): boolean {
  const calculatedSignature = crypto
    .createHmac("sha256", process.env.SIGNING_SECRET!)
    .update(JSON.stringify(payload))
    .digest("base64");
  return receivedSignature === calculatedSignature;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const webhookPayload = req.body as WebhookPayload;
  const receivedSignature = req.headers["tally-signature"] as string;

  // Verify the signature
  if (!verifyTallySignature(webhookPayload, receivedSignature)) {
    return res.status(401).json({ message: "Invalid signature" });
  }

  try {
    // Extract matchId, estimatedTime, and meetingNotes from the payload
    const { matchId, estimatedTime, meetingNotes } =
      webhookPayload.data.fields.reduce(
        (acc: ParsedFields, field: WebhookField) => {
          switch (field.label) {
            case "matchId":
              if (typeof field.value === "number") {
                acc.matchId = field.value;
              }
              break;
            case "estimatedTime":
              if (typeof field.value === "number") {
                acc.estimatedTime = field.value;
              }
              break;
            case "meetingNotes":
              if (typeof field.value === "string") {
                acc.meetingNotes = field.value;
              }
              break;
          }
          return acc;
        },
        {},
      );

    if (
      matchId === undefined ||
      estimatedTime === undefined ||
      meetingNotes === undefined
    ) {
      return res.status(400).json({ message: "Invalid data received" });
    }

    // Insert the data into the meetings table
    await db.insert(meetings).values({
      matchId,
      estimatedTime,
      meetingNotes,
    });

    res
      .status(200)
      .json({ message: "Webhook received and processed successfully" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
