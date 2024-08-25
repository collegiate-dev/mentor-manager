import { eq } from "drizzle-orm/expressions";
import { db } from "~/server/db";
import { mentors } from "~/server/db/schema";

export const getMentor = async (mentorId: string) => {
  const result = await db
    .select()
    .from(mentors)
    .where(eq(mentors.id, mentorId))
    .execute();

  return result.length > 0 ? result[0] : null;
};
