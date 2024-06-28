import { eq } from "drizzle-orm/expressions";
import { db } from "~/server/db";
import { matches } from "~/server/db/schema";

export const getMatchesByMentorId = async (mentorId: string) => {
  const result = await db
    .select()
    .from(matches)
    .where(eq(matches.mentorId, mentorId));

  return result;
};
