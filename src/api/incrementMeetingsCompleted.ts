import { db } from "~/server/db";
import { matches } from "~/server/db/schema";
import { type AnyColumn, eq, sql } from "drizzle-orm";

const increment = (column: AnyColumn, value = 1) => {
  return sql`${column} + ${value}`;
};

export const incrementMeetingsCompleted = async (matchId: number) => {
  await db
    .update(matches)
    .set({
      meetingsCompleted: increment(matches.meetingsCompleted),
    })
    .where(eq(matches.id, matchId));
};
