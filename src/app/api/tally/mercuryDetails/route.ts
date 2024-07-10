import { NextResponse } from "next/server";
import { tallyHookHandler } from "../../_utils/handler";
import {
  updateMentor,
  type MentorDetails,
  type ElectronicRoutingInfo,
} from "~/api/queries";

export const POST = tallyHookHandler<TallyBankDetailsEvent>(async (body) => {
  try {
    console.log("Tally Webhook Payload:", body);

    // Map the form data to MentorDetails structure
    const mentorDetails = mapFieldsToDetails(body.data.fields);
    console.log("Mentor Details:", mentorDetails);

    // Transform mentorDetails to match the type expected by updateMentor
    const updateData = transformToUpdateData(mentorDetails);

    // Call updateMentor with the mapped data
    if (mentorDetails.id) {
      await updateMentor(mentorDetails.id, updateData);
    } else {
      throw new Error("Mentor ID is missing");
    }

    return NextResponse.json(
      { message: "Payload received and mentor updated", data: null },
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
    electronicRoutingInfo: {} as ElectronicRoutingInfo,
  };

  fields.forEach((field) => {
    // change this to a switch statement for field.label

    if (field.label === "id") {
      form.id = field.value as string;
      form.electronicRoutingInfo!.country = "US"; //adding in the country code directly right now
      form.paymentMethod = "electronic";
    } else if (
      field.label === "electronicAccountType" &&
      Array.isArray(field.value)
    ) {
      const selectedOption = field.options?.find(
        (option) => option.id === (field.value as string[])[0],
      );
      if (selectedOption) {
        form.electronicAccountType = selectedOption.text;
      }
    } else if (field.label === "routingNumber") {
      form.routingNumber = field.value as string;
    } else if (field.label === "accountNumber") {
      form.accountNumber = field.value as string;
    } else if (field.label === "address1") {
      form.electronicRoutingInfo!.address1 = field.value as string;
    } else if (field.label === "city") {
      form.electronicRoutingInfo!.city = field.value as string;
    } else if (field.label === "region") {
      form.electronicRoutingInfo!.region = field.value as string;
    } else if (field.label === "postalCode") {
      form.electronicRoutingInfo!.postalCode = field.value as string;
    }
  });

  // Check if required fields are present
  // clean this into a wrapper function
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

  return form as MentorDetails;
};

// Utility function to transform MentorDetails to the type expected by updateMentor
const transformToUpdateData = (mentorDetails: MentorDetails) => {
  const {
    email,
    firstname,
    lastname,
    paymentMethod,
    electronicRoutingInfo,
    electronicAccountType,
    routingNumber,
    accountNumber,
  } = mentorDetails;

  return {
    email: email ?? undefined,
    firstname: firstname ?? undefined,
    lastname: lastname ?? undefined,
    paymentMethod: paymentMethod ?? undefined,
    electronicRoutingInfo: electronicRoutingInfo ?? undefined,
    electronicAccountType: electronicAccountType ?? undefined,
    routingNumber: routingNumber ?? undefined,
    accountNumber: accountNumber ?? undefined,
  };
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
