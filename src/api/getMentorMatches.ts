import { eq, and, lt } from "drizzle-orm/expressions";
import { db } from "~/server/db";
import { matches } from "~/server/db/schema";

// getMatchesByMentorId(mentorId)
// mentorId is the id of the mentor from clerk and in the mentors table
// returns all the matches that the mentor is currently mentoring
// filters for matches that have completed all meetings
export const getMatchesByMentorId = async (mentorId: string) => {
  const result = await db
    .select()
    .from(matches)
    .where(
      and(
        eq(matches.mentorId, mentorId),
        lt(matches.meetingsCompleted, matches.totalMeetings),
      ),
    );

  return result;
};
