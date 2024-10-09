import { eq, and, or, isNull } from "drizzle-orm/expressions";
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

// getApplicationByMentorId(mentorId)
// mentorId is the id of the mentor from clerk and in the mentors table
// returns all the applications that are not completed for the given mentor
export const getApplicationsByMentorId = async (mentorId: string) => {
  const result = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.mentorId, mentorId),
        or(eq(applications.completed, false), isNull(applications.completed)),
      ),
    );

  return result;
};

// getEditorMicroservicesByMentorId(mentorId)
// mentorId is the id of the mentor from clerk and in the mentors table
// returns all the editor microservices that are not completed for the given mentor
export const getEditorMicroservicesByMentorId = async (mentorId: string) => {
  const result = await db
    .select()
    .from(editorMicroservices)
    .where(
      and(
        eq(editorMicroservices.mentorId, mentorId),
        or(
          eq(editorMicroservices.completed, false),
          isNull(editorMicroservices.completed),
        ),
      ),
    );
  return result;
};

// mark application as completed
// can later add more functionality to add to a completed application table
export const completeApplication = async (applicationId: number) => {
  await db
    .update(applications)
    .set({ completed: true })
    .where(eq(applications.id, applicationId))
    .execute();
};
