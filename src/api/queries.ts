import { db } from "~/server/db";
import { matches, mentors } from "~/server/db/schema";
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

export const getMercuryIdByMentorId = async (
  mentorId: string,
): Promise<string | null> => {
  const result = await db
    .select({ mercuryId: mentors.mercuryId })
    .from(mentors)
    .where(eq(mentors.id, mentorId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0]?.mercuryId ?? null;
};

export const getCompensationByMatchId = async (
  matchId: number,
): Promise<number | null> => {
  const result = await db
    .select({ compensation: matches.compensation })
    .from(matches)
    .where(eq(matches.id, matchId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0]?.compensation ?? null;
};

// Function to get mentorId by matchId
export const getMentorIdByMatchId = async (
  matchId: number,
): Promise<string | null> => {
  const result = await db
    .select({ mentorId: matches.mentorId })
    .from(matches)
    .where(eq(matches.id, matchId))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  return result[0]?.mentorId ?? null;
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
      paymentMethod: mentors.paymentMethod,
      mercuryId: mentors.mercuryId,
      phoneNumber: mentors.phoneNumber,
      plaidAccessToken: mentors.plaidAccessToken, // Ensure you select plaidAccessToken
    })
    .from(mentors)
    .where(eq(mentors.id, mentorId))
    .limit(1);

  if (!result || result.length === 0 || !result[0]) {
    return null;
  }

  const mentor = result[0]; // Safely access result[0]

  // Build the full name here
  const fullname = `${mentor.firstname ?? ""} ${mentor.lastname ?? ""}`.trim(); // Handle null values

  // Return the mentor details including the computed fullname
  return {
    ...mentor,
    fullname, // Add the computed full name
  } as MentorDetails;
};

// this is to update the mentor phone number -- however this is inefficent
// replce this with updateMentorDetails which will be more maintainbale
export const updateMentorPhoneNumber = async (mentorDetails: MentorDetails) => {
  if (!mentorDetails.id) {
    throw new Error("mentorId is required");
  }
  const { phoneNumber } = mentorDetails;
  await db
    .update(mentors)
    .set({
      phoneNumber,
    })
    .where(eq(mentors.id, mentorDetails.id));
};

export const updateMentorDetails = async (
  mentorDetails: Partial<MentorDetails>,
) => {
  if (!mentorDetails.id) {
    throw new Error("mentorId is required");
  }

  // Create an empty object to hold the update values
  const updateData: Partial<{
    email: string;
    firstname: string;
    lastname: string;
    phoneNumber: PhoneNumber | null;
    plaidAccessToken: string | null;
    paymentMethod: string | null;
    mercuryId: string | null;
  }> = {};

  // Conditionally add each field if it's provided
  if (mentorDetails.email !== undefined) {
    updateData.email = mentorDetails.email;
  }
  if (mentorDetails.firstname !== undefined) {
    updateData.firstname = mentorDetails.firstname;
  }
  if (mentorDetails.lastname !== undefined) {
    updateData.lastname = mentorDetails.lastname;
  }
  if (mentorDetails.phoneNumber !== undefined) {
    updateData.phoneNumber = mentorDetails.phoneNumber;
  }
  if (mentorDetails.plaidAccessToken !== undefined) {
    updateData.plaidAccessToken = mentorDetails.plaidAccessToken;
  }
  if (mentorDetails.paymentMethod !== undefined) {
    updateData.paymentMethod = mentorDetails.paymentMethod;
  }
  if (mentorDetails.mercuryId !== undefined) {
    updateData.mercuryId = mentorDetails.mercuryId;
  }

  // If no fields are provided, there's nothing to update
  if (Object.keys(updateData).length === 0) {
    throw new Error("No fields to update");
  }

  // Execute the update query with the dynamically built updateData
  await db
    .update(mentors)
    .set(updateData)
    .where(eq(mentors.id, mentorDetails.id));
};

// Updated function to update mercury info
// export const updateMercuryInfo = async (mentorDetails: MentorDetails) => {
//   if (!mentorDetails.id) {
//     throw new Error("mentorId is required");
//   }

//   const {
//     paymentMethod,
//     electronicRoutingInfo,
//     electronicAccountType,
//     routingNumber,
//     accountNumber,
//   } = mentorDetails;

//   await db
//     .update(mentors)
//     .set({
//       paymentMethod,
//       electronicRoutingInfo,
//       electronicAccountType,
//       routingNumber,
//       accountNumber,
//     })
//     .where(eq(mentors.id, mentorDetails.id));
// };

// Types
export type PhoneNumber = {
  country_code: string;
  phone_number: string;
};
export type MentorDetails = {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  paymentMethod: string | null; // Optional field
  mercuryId: string | null; // Optional field
  phoneNumber: PhoneNumber | null; // JSON field for phone number
  plaidAccessToken: string | null; // Plaid access token
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
