import { NextResponse } from "next/server";
import { tallyHookHandler } from "../_utils/handler";
import { addMeeting, type InsertMeeting } from "~/server/queries";
import { incrementMeetingsCompleted } from "~/api/incrementMeetingsCompleted";

import { getCompensationByMatchId, getMentorIdByMatchId } from "~/api/queries";
import { sendPayout } from "../dots/sendPayout/route";

export const POST = tallyHookHandler<TallyMeetingEvent>(async (body) => {
  const meeting = mapFieldsToMeeting(body.data.fields);

  // Add the meeting to the meetings table
  await addMeeting(meeting);

  // Increment the meetingsCompleted count in the matches table
  await incrementMeetingsCompleted(meeting.matchId);

  const mentorId = await getMentorIdByMatchId(meeting.matchId);
  if (mentorId === null) {
    return NextResponse.json(
      { message: "mentorId not found", data: null },
      { status: 400 },
    );
  }

  const compensation = await getCompensationByMatchId(meeting.matchId);
  if (compensation == null) {
    return NextResponse.json(
      { message: "compensation amount not found", data: null },
      { status: 400 },
    );
  }

  // need to add phone number
  await sendPayout(mentorId, compensation);

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
