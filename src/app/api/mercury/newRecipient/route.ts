// import fetch from "node-fetch";
// import { type MentorDetails, type MercuryResponse } from "~/api/queries";

// export async function addRecipientToMercury(
//   mentorDetails: MentorDetails,
// ): Promise<MercuryResponse> {
//   const url = "https://backend.mercury.com/api/v1/recipients";
//   const apiToken = process.env.MERCURY_SECRET_TOKEN;

//   const payload = {
//     emails: [mentorDetails.email],
//     name: mentorDetails.fullname,
//     paymentMethod: mentorDetails.paymentMethod,
//     electronicRoutingInfo: {
//       address: mentorDetails.electronicRoutingInfo,
//       electronicAccountType: mentorDetails.electronicAccountType,
//       routingNumber: mentorDetails.routingNumber?.toString() ?? "", // Ensure it's a string
//       accountNumber: mentorDetails.accountNumber,
//     },
//   };

//   console.log("Payload:", payload); // Log the payload

//   const options = {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${apiToken}`,
//     },
//     body: JSON.stringify(payload),
//   };

//   try {
//     const response = await fetch(url, options);
//     const json = await response.json();
//     // console.log("Mercury Response:", json);
//     return json as MercuryResponse;
//   } catch (err) {
//     console.error("Error adding recipient to Mercury:", err);
//     throw new Error("Error adding recipient to Mercury");
//   }
// }
