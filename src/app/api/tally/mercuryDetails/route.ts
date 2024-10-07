import { NextResponse } from "next/server";
import { tallyHookHandler } from "../../_utils/handler";
import {
  type MentorDetails,
  updateMentorDetails,
  type Address,
} from "~/api/queries";

export const POST = tallyHookHandler<TallyBankDetailsEvent>(async (body) => {
  try {
    console.log("Tally Webhook Payload:", body);

    // Map the form data to MentorDetails structure
    const mentorDetails = mapFieldsToDetails(body.data.fields);
    console.log("Mentor Details:", mentorDetails);

    // Call updateMentorDetails to save phoneNumber and address to the DB
    await updateMentorDetails(mentorDetails);

    return NextResponse.json(
      {
        message: "Payload received and mentor updated",
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
const mapFieldsToDetails = (fields: EventField[]): Partial<MentorDetails> => {
  const form: Partial<MentorDetails> = {
    address: {} as Address, // Initialize empty Address object
  };

  fields.forEach((field) => {
    switch (field.label) {
      case "id":
        form.id = field.value as string;
        form.paymentMethod = "electronic"; // Example of setting a value
        form.address!.country = "US";
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
      case "address1":
        form.address!.address1 = field.value as string;
        break;
      case "city":
        form.address!.city = field.value as string;
        break;
      case "region":
        form.address!.region = field.value as string;
        break;
      case "postalCode":
        form.address!.postalCode = field.value as string;
        break;
    }
  });

  // Check if required fields are present
  checkRequiredFields(form);

  return form;
};

// Function to check if required fields are present
const checkRequiredFields = (form: Partial<MentorDetails>) => {
  if (form.id === undefined) {
    throw new Error("Missing required field: id");
  }
  if (form.phoneNumber === undefined) {
    throw new Error("Missing required field: phoneNumber");
  }
  if (form.address?.address1 === undefined) {
    throw new Error("Missing required field: address1");
  }
  if (form.address?.city === undefined) {
    throw new Error("Missing required field: city");
  }
  if (form.address?.region === undefined) {
    throw new Error("Missing required field: region");
  }
  if (form.address?.postalCode === undefined) {
    throw new Error("Missing required field: postalCode");
  }
};

// Type Definitions
type TallyBankDetailsEvent = {
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
