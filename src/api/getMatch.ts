import { eq } from "drizzle-orm/expressions";
import { db } from "~/server/db";
import { matches } from "~/server/db/schema";

export const getMatchById = async (matchId: number) => {
  const result = await db
    .select()
    .from(matches)
    .where(eq(matches.id, matchId))
    .execute();

  return result.length > 0 ? result[0] : null;
};
