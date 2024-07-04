import { currentUser } from "@clerk/nextjs/server";

export async function getUserFirstName() {
  const user = await currentUser();

  if (user) {
    return user.firstName;
  }

  return null;
}
