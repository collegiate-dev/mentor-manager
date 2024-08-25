import { NextResponse } from "next/server";
import { tallyHookHandler } from "../_utils/handler";
import { addMeeting, type InsertMeeting } from "~/server/queries";
import { incrementMeetingsCompleted } from "~/api/incrementMeetingsCompleted";
import { sendMoneyToRecipient } from "../mercury/sendMoney/route";
import { getMatchById } from "~/api/getMatch";
import { getStudent } from "~/api/getStudent";
import { getMentor } from "~/api/getMentor";

export const POST = tallyHookHandler<TallyMeetingEvent>(async (body) => {
  const meeting = mapFieldsToMeeting(body.data.fields);

  // [TODO] Combine the two below into one meetingCompleted call
  // Add the meeting to the meetings table
  await addMeeting(meeting);
  // Increment the meetingsCompleted count in the matches table
  await incrementMeetingsCompleted(meeting.matchId);

  const match = await getMatchById(meeting.matchId);
  if (match === null) {
    return NextResponse.json(
      { message: "match not found", data: null },
      { status: 400 },
    );
  }

  const student = await getStudent(match.studentId);
  const mentor = await getMentor(match.mentorId);

  const mercuryId = mentor?.mercuryId;
  if (mercuryId === undefined) {
    return NextResponse.json(
      { message: "mentor not found", data: null },
      { status: 400 },
    );
  }

  const memo = `Payout for ${student?.name}'s ${match.meetingsCompleted}/${match.totalMeetings} ${match.type} meeting with ${mentor?.firstname} ${mentor?.lastname}`;

  await sendMoneyToRecipient(mercuryId!, match.compensation, memo);

  return NextResponse.json(
    { message: "awesome sauce", data: null },
    { status: 200 },
  );
});

// Function to map the body.data.fields array to a Meeting object
const mapFieldsToMeeting = (fields: EventField[]): InsertMeeting => {
  const meeting: Partial<InsertMeeting> = {};

  fields.forEach((field) => {
    if (field.label === "matchId") {
      meeting.matchId = parseInt(field.value as string, 10);
    } else if (field.label === "estimatedTime") {
      meeting.estimatedTime = field.value as number;
    } else if (field.label === "meetingNotes") {
      meeting.meetingNotes = field.value as string;
    }
  });

  // Add the current date and time as the meeting date
  meeting.meetingDate = new Date().toISOString().split("T")[0]; // Format as YYYY-MM-DD

  // Check if required fields are present
  if (
    meeting.matchId === undefined ||
    meeting.estimatedTime === undefined ||
    meeting.meetingNotes === undefined
  ) {
    throw new Error("Missing required fields: matchId and/or estimatedTime");
  }

  return meeting as InsertMeeting;
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
