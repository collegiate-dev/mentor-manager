import { eq } from "drizzle-orm/expressions";
import { db } from "~/server/db";
import { applications } from "~/server/db/schema";

export const getApplicationById = async (applicationId: number) => {
  const result = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .execute();

  return result.length > 0 ? result[0] : null;
};
