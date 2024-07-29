import { getMatchesByMentorId } from "~/api/getMentorMatches";
import { getStudent } from "~/api/getStudent";
import { getMentorDetails } from "~/api/queries";
import { getDaysSinceMostRecentMeeting } from "~/api/meetingQueries";
import { auth } from "@clerk/nextjs/server";
import StudentsClient from "./_components/StudentsClient";
import { SignInPage } from "~/components/signInPage";
import AddPhoneNumberButton from "./_components/AddPhoneNumberButton";

export default async function StudentsPage() {
  const { userId } = auth() as { userId: string };

  if (!userId) {
    return <SignInPage />;
  }

  try {
    console.log(`Fetching mentor details for userId: ${userId}`);
    const mentorDetails = await getMentorDetails(userId);
    console.log(`Mentor details fetched: ${JSON.stringify(mentorDetails)}`);

    if (!mentorDetails) {
      return <div>Error fetching mentor details. Please try again later.</div>;
    }

    const { phoneNumber } = mentorDetails;

    console.log(`Fetching matches for userId: ${userId}`);
    const matches = await getMatchesByMentorId(userId);
    console.log(`Matches fetched: ${JSON.stringify(matches)}`);

    const studentDataPromises = matches.map(async (match) => {
      const student = await getStudent(match.studentId);
      const daysSinceLastMeeting = await getDaysSinceMostRecentMeeting(
        match.id,
      );
      return {
        ...match,
        studentName: student ? student.name : "Unknown",
        daysSinceLastMeeting: daysSinceLastMeeting ?? null,
      };
    });

    const matchesWithStudentNames = await Promise.all(studentDataPromises);
    console.log(
      `Matches with student names: ${JSON.stringify(matchesWithStudentNames)}`,
    );

    const overdueMatches = matchesWithStudentNames.filter(
      (match) =>
        match.daysSinceLastMeeting === null ||
        (match.frequency !== null &&
          match.daysSinceLastMeeting > match.frequency),
    );

    const regularMatches = matchesWithStudentNames.filter(
      (match) =>
        match.daysSinceLastMeeting !== null &&
        (match.frequency === null ||
          match.daysSinceLastMeeting <= match.frequency),
    );

    return (
      <div className="flex flex-col items-center">
        {!phoneNumber ? (
          <AddPhoneNumberButton userId={userId} />
        ) : (
          <StudentsClient
            overdueMatches={overdueMatches}
            regularMatches={regularMatches}
          />
        )}
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
