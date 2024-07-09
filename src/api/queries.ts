import { db } from "~/server/db";
import { mentors } from "~/server/db/schema";
import { sql } from "drizzle-orm";
import { eq } from "drizzle-orm/expressions";

export const addMentor = async (mentor: {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}) => {
  await db.insert(mentors).values(mentor);
};

export const getMentorDetails = async (
  mentorId: string,
): Promise<MentorDetails | null> => {
  const result = await db
    .select({
      id: mentors.id,
      email: mentors.email,
      firstname: mentors.firstname,
      lastname: mentors.lastname,
      fullname:
        sql<string>`CONCAT(${mentors.firstname}, ' ', ${mentors.lastname})`.as(
          "fullname",
        ),
      paymentMethod: mentors.paymentMethod,
      electronicRoutingInfo: mentors.electronicRoutingInfo,
      electronicAccountType: mentors.electronicAccountType,
      routingNumber: mentors.routingNumber,
      accountNumber: mentors.accountNumber,
    })
    .from(mentors)
    .where(eq(mentors.id, mentorId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0] as MentorDetails;
};

export const updateMentor = async (
  mentorId: string,
  updateData: {
    email?: string;
    firstname?: string;
    lastname?: string;
    paymentMethod?: string;
    electronicRoutingInfo?: ElectronicRoutingInfo;
    electronicAccountType?: string;
    routingNumber?: string;
    accountNumber?: string;
  },
) => {
  if (!mentorId) {
    throw new Error("mentorId is required");
  }
  await db.update(mentors).set(updateData).where(eq(mentors.id, mentorId));
};

//Types
export type MentorDetails = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  fullname: string;
  paymentMethod: string | null;
  electronicRoutingInfo: ElectronicRoutingInfo | null;
  electronicAccountType: string | null;
  routingNumber: string | null;
  accountNumber: string | null;
};

type Address = {
  country: string;
  postalCode: string;
  region: string;
  city: string;
  address1: string;
};

type ElectronicRoutingInfo = {
  address: Address;
};
