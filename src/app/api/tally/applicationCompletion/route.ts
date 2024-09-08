import { NextResponse } from "next/server";
import { tallyHookHandler } from "../../_utils/handler";
import { type InsertApplication } from "~/server/queries";
import { sendMoneyToRecipient } from "../../mercury/sendMoney/route";
import { getStudent } from "~/api/getStudent";
import { getMentor } from "~/api/getMentor";
import {
  completeApplication,
  getApplicationByApplicationId,
} from "~/api/applicationQueries";

export const POST = tallyHookHandler<TallyMeetingEvent>(async (body) => {
  const application = mapFieldsToMeeting(body.data.fields);
  if (application.id === undefined) {
    return NextResponse.json(
      { message: "applicationId not found", data: null },
      { status: 400 },
    );
  }

  await completeApplication(application.id);

  const match = await getApplicationByApplicationId(application.id);
  if (match === null) {
    return NextResponse.json(
      { message: "match not found", data: null },
      { status: 400 },
    );
  }

  const student = await getStudent(application.studentId);
  const mentor = await getMentor(application.mentorId);

  const mercuryId = mentor?.mercuryId;
  if (mercuryId === undefined) {
    return NextResponse.json(
      { message: "mentor not found", data: null },
      { status: 400 },
    );
  }

  const memo = `Payout for ${student?.name}'s ${application.name} of type: ${application.type} with ${mentor?.firstname} ${mentor?.lastname}`;

  await sendMoneyToRecipient(mercuryId!, application.compensation, memo);
  return NextResponse.json(
    { message: "awesome sauce", data: null },
    { status: 200 },
  );
});

// Function to map the body.data.fields array to an Application Object
const mapFieldsToMeeting = (fields: EventField[]): InsertApplication => {
  const application: Partial<InsertApplication> = {};

  fields.forEach((field) => {
    if (field.label === "applicationId") {
      application.id = parseInt(field.value as string, 10);
    } else if (field.label === "applicationName") {
      application.name = field.value as string;
    }
  });

  // Check if required fields are present
  if (application.id === undefined || application.name === undefined) {
    throw new Error("Missing required fields: matchId and/or name");
  }

  return application as InsertApplication;
};

type TallyMeetingEvent = {
  eventId: string;
  eventType: "FORM_RESPONSE";
  createdAt: string;
  data: EventData;
};
type EventField = {
  key: string;
  label: string;
  type: "HIDDEN_FIELDS" | "INPUT_NUMBER" | "TEXTAREA";
  value: string | number;
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
