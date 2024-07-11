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

export const addMercuryRecipientId = async (
  mentorId: string,
  mercuryRecipientId: string,
) => {
  if (!mentorId) {
    throw new Error("mentorId is required");
  }
  if (!mercuryRecipientId) {
    throw new Error("mercuryRecipientId is required");
  }
  await db
    .update(mentors)
    .set({ mercuryId: mercuryRecipientId })
    .where(eq(mentors.id, mentorId));
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

// Updated function to update mercury info
export const updateMercuryInfo = async (mentorDetails: MentorDetails) => {
  if (!mentorDetails.id) {
    throw new Error("mentorId is required");
  }

  const {
    paymentMethod,
    electronicRoutingInfo,
    electronicAccountType,
    routingNumber,
    accountNumber,
  } = mentorDetails;

  await db
    .update(mentors)
    .set({
      paymentMethod,
      electronicRoutingInfo,
      electronicAccountType,
      routingNumber,
      accountNumber,
    })
    .where(eq(mentors.id, mentorDetails.id));
};

// Types
export type MentorDetails = {
  id: string;
  email: string;
  fullname: string;
  paymentMethod: string | null;
  electronicRoutingInfo: Address | null;
  electronicAccountType: string | null;
  routingNumber: string | null;
  accountNumber: string | null;
};

export type MentorMercury = {
  emails: string[];
  name: string;
  paymentMethod: string;
  electronicRoutingInfo: Address;
  electronicAccountType: string;
  routingNumber: string;
  accountNumber: string;
};

export type Address = {
  country: string;
  postalCode: string;
  region: string;
  city: string;
  address1: string;
  address2?: string | null;
};

export type ElectronicRoutingInfo = {
  accountNumber: string;
  routingNumber: string;
  bankName?: string | null;
  electronicAccountType:
    | "businessChecking"
    | "businessSavings"
    | "personalChecking"
    | "personalSavings";
  address: Address;
};

export type MercuryResponse = {
  id: string;
  name: string;
  nickname?: string | null;
  status: "active" | "deleted";
  emails: string[];
  dateLastPaid?: string | null;
  defaultPaymentMethod: "ACH" | "Check" | "DomesticWire" | "InternationalWire";
  electronicRoutingInfo?: ElectronicRoutingInfo | null;
  domesticWireRoutingInfo?: any | null; // Add specific types if needed
  internationalWireRoutingInfo?: any | null; // Add specific types if needed
  checkInfo?: any | null; // Add specific types if needed
  address?: any | null; // Deprecated, add specific types if needed
};
