import { getMatchesByMentorId } from "~/api/getMentorMatches";
import { getStudent } from "~/api/getStudent";
import { getMentorDetails } from "~/api/queries";
import { auth } from "@clerk/nextjs/server";
import StudentsClient from "./_components/StudentsClient";
import CompleteBankingButton from "./_components/CompleteBankingButton";

export default async function StudentsPage() {
  const { userId } = auth() as { userId: string };

  if (!userId) {
    return <div>Please log in to view matches</div>;
  }

  try {
    console.log(`Fetching mentor details for userId: ${userId}`);
    const mentorDetails = await getMentorDetails(userId);
    console.log(`Mentor details fetched: ${JSON.stringify(mentorDetails)}`);

    if (!mentorDetails) {
      return <div>Error fetching mentor details. Please try again later.</div>;
    }

    const {
      paymentMethod,
      electronicRoutingInfo,
      electronicAccountType,
      routingNumber,
      accountNumber,
    } = mentorDetails;

    console.log(`Fetching matches for userId: ${userId}`);
    const matches = await getMatchesByMentorId(userId);
    console.log(`Matches fetched: ${JSON.stringify(matches)}`);

    const studentDataPromises = matches.map(async (match) => {
      const student = await getStudent(match.studentId);
      return {
        ...match,
        studentName: student ? student.name : "Unknown",
      };
    });

    const matchesWithStudentNames = await Promise.all(studentDataPromises);
    console.log(
      `Matches with student names: ${JSON.stringify(matchesWithStudentNames)}`,
    );

    return (
      <div>
        {(!paymentMethod ||
          !electronicRoutingInfo ||
          !electronicAccountType ||
          !routingNumber ||
          !accountNumber) && <CompleteBankingButton userId={userId} />}
        <StudentsClient matches={matchesWithStudentNames} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching matches or mentor details:", error);
    return (
      <div>
        Error fetching matches or mentor details. Please try again later.
      </div>
    );
  }
}
