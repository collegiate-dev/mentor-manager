import "server-only";

import { db } from "./db";
// import { userAuth } from "./wrapper";
import { applications, meetings } from "./db/schema";

// export const addMeeting = userAuth(async (_authContext, meeting: Meeting) => {
//   // const { userId } = authContext;

//   return await db.insert(meetings).values(meeting);
// });

export const addMeeting = async (meeting: InsertMeeting) => {
  try {
    return await db.insert(meetings).values(meeting);
  } catch (error) {
    console.error("Error inserting meeting:", error);
    throw new Error("Failed to insert meeting");
  }
};

export type InsertMeeting = typeof meetings.$inferInsert;

export type InsertApplication = typeof applications.$inferInsert;

// export const getMyTask = userAuth(async (authContext, imgId: number) => {
//   const { userId } = authContext;
//   const task = await db.query.tasks.findFirst({
//     where: (model, { eq }) => eq(model.id, imgId),
//   });

//   if (!task) throw new Error("Image not found");
//   // if (task.userId !== userId) throw new Error("Unauthorized");

//   return task;
// });

// export const updateTaskDueDate = userAuth(
//   async (_, taskId: number, newDueDate: Date) => {
//     await db
//       .update(tasks)
//       .set({ dueDate: newDueDate })
//       .where(eq(tasks.id, taskId));
//   },
// );
