import { NextResponse } from "next/server";
import { tallyHookHandler } from "../../_utils/handler";
import {
  updateMercuryInfo,
  type MentorDetails,
  type Address,
  addMercuryRecipientId,
} from "~/api/queries";
import { addRecipientToMercury } from "~/app/api/mercury/newRecipient/route";

export const POST = tallyHookHandler<TallyBankDetailsEvent>(async (body) => {
  try {
    console.log("Tally Webhook Payload:", body);

    // Map the form data to MentorDetails structure
    const mentorDetails = mapFieldsToDetails(body.data.fields);
    console.log("Mentor Details:", mentorDetails);

    // Call updateMercuryInfo with the mapped data
    if (mentorDetails) {
      await updateMercuryInfo(mentorDetails);
    } else {
      throw new Error("mentorDetails is missing");
    }

    // Send data to Mercury API to add a recipient
    const mercuryResponse = await addRecipientToMercury(mentorDetails);
    // Update the mentor database with the mercuryId
    if (mercuryResponse.id) {
      await addMercuryRecipientId(mentorDetails.id, mercuryResponse.id);
    } else {
      throw new Error("Mercury response ID is missing");
    }

    console.log("Mercury Response:", mercuryResponse);

    return NextResponse.json(
      {
        message:
          "Payload received, mentor updated, and Mercury recipient added",
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
        form.electronicRoutingInfo!.country = "US"; // Adding in the country code directly right now
        form.paymentMethod = "electronic";
        break;
      case "electronicAccountType":
        if (Array.isArray(field.value)) {
          const selectedOption = field.options?.find(
            (option) => option.id === (field.value as string[])[0],
          );
          if (selectedOption) {
            form.electronicAccountType = selectedOption.text;
          }
        }
        break;
      case "email":
        form.email = field.value as string;
        break;
      case "name":
        form.fullname = field.value as string;
        break;
      case "routingNumber":
        form.routingNumber = field.value as string;
        break;
      case "accountNumber":
        form.accountNumber = field.value as string;
        break;
      case "address1":
        form.electronicRoutingInfo!.address1 = field.value as string;
        break;
      case "city":
        form.electronicRoutingInfo!.city = field.value as string;
        break;
      case "region":
        form.electronicRoutingInfo!.region = field.value as string;
        break;
      case "postalCode":
        form.electronicRoutingInfo!.postalCode = field.value as string;
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
  if (form.electronicAccountType === undefined) {
    throw new Error("Missing required field: electronicAccountType");
  }
  if (form.routingNumber === undefined) {
    throw new Error("Missing required field: routingNumber");
  }
  if (form.accountNumber === undefined) {
    throw new Error("Missing required field: accountNumber");
  }
  if (form.electronicRoutingInfo?.address1 === undefined) {
    throw new Error("Missing required field: address1");
  }
  if (form.electronicRoutingInfo?.city === undefined) {
    throw new Error("Missing required field: city");
  }
  if (form.electronicRoutingInfo?.region === undefined) {
    throw new Error("Missing required field: region");
  }
  if (form.electronicRoutingInfo?.postalCode === undefined) {
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
