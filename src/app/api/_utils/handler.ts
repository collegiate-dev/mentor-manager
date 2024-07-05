import { type NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

export type ApiResponse<T> = {
  message: string;
  data: T | null;
};

type WebhookHandlerFunction<T> = (
  body: T,
) => Promise<NextResponse<ApiResponse<void>> | void>;

export const tallyHookHandler = <T>(handler: WebhookHandlerFunction<T>) => {
  return async (
    request: NextRequest,
  ): Promise<NextResponse<ApiResponse<void>>> => {
    try {
      // Read the raw body from the request
      const rawBody = await request.text();
      const receivedSignature = request.headers.get("tally-signature");

      if (!receivedSignature) {
        return NextResponse.json(
          { message: "Signature missing", data: null },
          { status: 400 },
        );
      }

      const calculatedSignature = createHmac(
        "sha256",
        process.env.SIGNING_SECRET!,
      )
        .update(rawBody)
        .digest("base64");

      console.log("calculated signature", calculatedSignature);
      console.log("received signature", receivedSignature);

      if (receivedSignature === calculatedSignature) {
        // Signature is valid, process the webhook payload
        const body = JSON.parse(rawBody) as T;

        const handlerResponse = await handler(body);

        if (handlerResponse) {
          return handlerResponse;
        }

        return NextResponse.json(
          { message: "Success", data: null },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          { message: "Invalid signature", data: null },
          { status: 401 },
        );
      }
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { message: "Error processing request", data: null },
        { status: 500 },
      );
    }
  };
};
