import { eq } from "drizzle-orm/expressions";
import { db } from "~/server/db";
import { students } from "~/server/db/schema";

export const getStudent = async (studentId: number) => {
  const result = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId))
    .execute();

  return result.length > 0 ? result[0] : null;
};
