import { NextResponse } from "next/server";
import { tallyHookHandler } from "../../_utils/handler";
import {
  type MentorDetails,
  type Address,
  updateMentorPhoneNumber,
} from "~/api/queries";

export const POST = tallyHookHandler<TallyEvent>(async (body) => {
  try {
    console.log("Tally Webhook Payload:", body);

    // Map the form data to MentorDetails structure
    const mentorDetails = mapFieldsToDetails(body.data.fields);
    console.log("Mentor Details:", mentorDetails);

    // Call updateMercuryInfo with the mapped data
    if (mentorDetails) {
      await updateMentorPhoneNumber(mentorDetails);
    } else {
      throw new Error("mentorDetails is missing");
    }

    return NextResponse.json(
      {
        message: "Payload received: mentor updated",
        data: null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing Tally webhook:", error);
    return NextResponse.json(
      { message: "Error processing webhook", data: null },
      { status: 400 },
    );
  }
});

// Function to map the body.data.fields array to a MentorDetails object
const mapFieldsToDetails = (fields: EventField[]): MentorDetails => {
  const form: Partial<MentorDetails> = {
    electronicRoutingInfo: {} as Address,
  };

  fields.forEach((field) => {
    switch (field.label) {
      case "id":
        form.id = field.value as string;
        break;
      case "phoneNumber":
        const phoneNumber = field.value as string;
        const phoneParts = phoneNumber.match(/^\+(\d{1,3})(\d{10})$/);

        if (phoneParts) {
          form.phoneNumber = {
            country_code: phoneParts[1]!,
            phone_number: phoneParts[2]!,
          };
        } else {
          console.error("Invalid phone number format");
        }
        break;
    }
  });

  // Check if required fields are present
  checkRequiredFields(form);

  return form as MentorDetails;
};

// Function to check if required fields are present
const checkRequiredFields = (form: Partial<MentorDetails>) => {
  if (form.id === undefined) {
    throw new Error("Missing required field: id");
  }
  if (form.phoneNumber === undefined) {
    throw new Error("Missing required field: phoneNumber");
  }
};

// Type Definitions
type TallyEvent = {
  eventId: string;
  eventType: "FORM_RESPONSE";
  createdAt: string;
  data: EventData;
};

type EventField = {
  key: string;
  label: string;
  type: "HIDDEN_FIELDS" | "INPUT_NUMBER" | "TEXTAREA";
  value: string | number | string[];
  options?: { id: string; text: string }[];
};

type EventData = {
  responseId: string;
  submissionId: string;
  respondentId: string;
  formId: string;
  formName: string;
  createdAt: string;
  fields: EventField[];
};
