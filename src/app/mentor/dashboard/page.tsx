import { getMatchesByMentorId } from "~/api/getMentorMatches";
import { getStudent } from "~/api/getStudent";
import { getMentorDetails } from "~/api/queries";
import { getDaysSinceMostRecentMeeting } from "~/api/meetingQueries";
import { auth } from "@clerk/nextjs/server";
import StudentsClient from "./_components/StudentsClient";
import { SignInPage } from "~/components/signInPage";
import AddPhoneNumberButton from "./_components/AddPhoneNumberButton";
import { getApplicationsByMentorId } from "~/api/applicationQueries";
import ApplicationsClient from "./_components/ApplicationsClient";

export default async function StudentsPage() {
  const { userId } = auth() as { userId: string };

  if (!userId) {
    return <SignInPage />;
  }

  try {
    // fetch mentorDetails
    const mentorDetails = await getMentorDetails(userId);
    if (!mentorDetails) {
      return <div>Error fetching mentor details. Please try again later.</div>;
    }

    const { phoneNumber } = mentorDetails;

    // fetches matches and applications by userId aka mentorId
    const matches = await getMatchesByMentorId(userId);
    const applications = await getApplicationsByMentorId(userId);

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

    const applicationDataPromises = applications.map(async (application) => {
      const student = await getStudent(application.studentId);
      return {
        ...application,
        studentName: student ? student.name : "Unknown",
      };
    });

    const matchesWithStudentNames = await Promise.all(studentDataPromises);
    const applicationsWithStudentNames = await Promise.all(
      applicationDataPromises,
    );

    console.log(
      `Matches with student names: ${JSON.stringify(matchesWithStudentNames)}`,
    );
    console.log(
      `Applications with student names: ${JSON.stringify(applicationsWithStudentNames)}`,
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
          <>
            <StudentsClient
              overdueMatches={overdueMatches}
              regularMatches={regularMatches}
            />
            <ApplicationsClient applications={applicationsWithStudentNames} />
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error(
      "Error fetching matches, applications, or mentor details:",
      error,
    );
    return (
      <div>
        Error fetching matches, applications, or mentor details. Please try
        again later.
      </div>
    );
  }
}
