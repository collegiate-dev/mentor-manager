import { db } from "~/server/db";
import { mentors } from "~/server/db/schema";

export const addMentor = async (mentor: {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}) => {
  await db.insert(mentors).values(mentor);
};
