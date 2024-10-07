import { getMatchesByMentorId } from "~/api/getMentorMatches";
import { getStudent } from "~/api/getStudent";
import { getMentorDetails } from "~/api/queries";
import { getDaysSinceMostRecentMeeting } from "~/api/meetingQueries";
import { auth } from "@clerk/nextjs/server";
import StudentsClient from "./_components/StudentsClient";
import { SignInPage } from "~/components/signInPage";
import AddPhoneNumberButton from "./_components/AddPhoneNumberButton";
import {
  getApplicationsByMentorId,
  getEditorMicroservicesByMentorId,
} from "~/api/applicationQueries";
import ApplicationsClient from "./_components/ApplicationsClient";
import EditorMicroserviceClient from "./_components/EditorMicroserviceClient";
import PlaidLinkButton from "./_components/PlaidLinkButton";
import AddMentorDetailsButton from "./_components/AddMentorDetailsButton";

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

    const { phoneNumber, mercuryId, address } = mentorDetails;

    if (!address) {
      return <AddMentorDetailsButton userId={userId} />;
    }
    if (!phoneNumber) {
      return <AddPhoneNumberButton userId={userId} />;
    }

    if (!mercuryId) {
      return (
        <PlaidLinkButton
          userId={userId}
          phoneNumber={phoneNumber.phone_number}
        />
      );
    }

    // fetches matches and applications by userId aka mentorId
    const matches = await getMatchesByMentorId(userId);
    const applications = await getApplicationsByMentorId(userId);
    const editorMicroservices = await getEditorMicroservicesByMentorId(userId);

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

    const editorMicroservicesDataPromises = editorMicroservices.map(
      async (application) => {
        const student = await getStudent(application.studentId);
        return {
          ...application,
          studentName: student ? student.name : "Unknown",
        };
      },
    );

    const matchesWithStudentNames = await Promise.all(studentDataPromises);
    const applicationsWithStudentNames = await Promise.all(
      applicationDataPromises,
    );
    const editorMicroservicesWithStudentNames = await Promise.all(
      editorMicroservicesDataPromises,
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
        <StudentsClient
          overdueMatches={overdueMatches}
          regularMatches={regularMatches}
        />
        <ApplicationsClient applications={applicationsWithStudentNames} />
        <EditorMicroserviceClient
          applications={editorMicroservicesWithStudentNames}
        />
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
