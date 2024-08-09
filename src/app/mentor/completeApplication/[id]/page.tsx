import { SignedIn, SignedOut } from "@clerk/nextjs";
import { TallyPM } from "./_components/tally";
import { getStudent } from "~/api/getStudent";
import { SignInPage } from "~/components/signInPage";
import { getUserFirstName } from "~/api/getUserFirstName";
import { getApplicationByApplicationId } from "~/api/applicationQueries";

export default async function editor({ params }: { params: { id: string } }) {
  const applicationId = Number(params.id);

  if (isNaN(applicationId)) {
    return <div>Invalid. Contact Ishaan for support at 9259643840</div>;
  }

  const application = await getApplicationByApplicationId(applicationId);
  if (!application) {
    return <div>No Application Found</div>;
  }

  const applicationName = application.name;
  const student = await getStudent(application.studentId);
  const studentName = student?.name;
  if (!studentName) {
    return <div>No student name found</div>;
  }

  const mentorName = await getUserFirstName();
  if (!mentorName) {
    return <div>Mentor name not found</div>;
  }

  return (
    <main>
      <SignedIn>
        <TallyPM
          id={params.id}
          studentName={studentName}
          mentorName={mentorName}
          applicationName={applicationName}
        />
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </main>
  );
}
