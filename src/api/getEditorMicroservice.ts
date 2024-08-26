import { eq } from "drizzle-orm/expressions";
import { db } from "~/server/db";
import { editorMicroservices } from "~/server/db/schema";

export const getEditorMicroservice = async (applicationId: number) => {
  const result = await db
    .select()
    .from(editorMicroservices)
    .where(eq(editorMicroservices.id, applicationId))
    .execute();

  return result.length > 0 ? result[0] : null;
};
