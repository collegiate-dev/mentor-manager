import { db } from "~/server/db";
import { meetings } from "~/server/db/schema";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm/expressions";

export const getDaysSinceMostRecentMeeting = async (
  matchId: number,
): Promise<number | null> => {
  const result = await db
    .select({
      lastMeetingDate: sql<Date>`MAX(${meetings.meetingDate})`.as(
        "lastMeetingDate",
      ),
    })
    .from(meetings)
    .where(eq(meetings.matchId, matchId))
    .execute();

  const lastMeetingDate = result[0]?.lastMeetingDate;

  if (!lastMeetingDate) {
    return null;
  }

  const currentDate = new Date();

  // Calculate the difference in time
  const timeDifference =
    currentDate.getTime() - new Date(lastMeetingDate).getTime();

  // Convert time difference to days
  const daysSinceLastMeeting = Math.floor(timeDifference / (1000 * 3600 * 24));

  return daysSinceLastMeeting;
};
