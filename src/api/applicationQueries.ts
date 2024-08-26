import { eq } from "drizzle-orm/expressions";
import { db } from "~/server/db";
import { applications, editorMicroservices } from "~/server/db/schema";

export const getApplicationByApplicationId = async (applicationId: number) => {
  const result = await db
    .select()
    .from(applications)
    .where(eq(applications.id, applicationId))
    .execute();

  return result.length > 0 ? result[0] : null;
};

export const getApplicationsByMentorId = async (mentorId: string) => {
  const result = await db
    .select()
    .from(applications)
    .where(eq(applications.mentorId, mentorId));

  return result;
};

export const getEditorMicroservicesByMentorId = async (mentorId: string) => {
  const result = await db
    .select()
    .from(editorMicroservices)
    .where(eq(editorMicroservices.mentorId, mentorId));

  return result;
};
