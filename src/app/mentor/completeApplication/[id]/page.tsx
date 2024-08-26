import { SignedIn, SignedOut } from "@clerk/nextjs";
import { TallyPM } from "./_components/tally";
import { getStudent } from "~/api/getStudent";
import { SignInPage } from "~/components/signInPage";
import { getApplicationByApplicationId } from "~/api/applicationQueries";
import { getMentor } from "~/api/getMentor";

export default async function editor({ params }: { params: { id: string } }) {
  const applicationId = Number(params.id);

  if (isNaN(applicationId)) {
    return <div>Invalid. Contact Ishaan for support at 9259643840</div>;
  }

  const application = await getApplicationByApplicationId(applicationId);
  if (!application) {
    return <div>No Application Found</div>;
  }

  const student = await getStudent(application.studentId);
  if (!student) {
    return <div>No student found</div>;
  }

  const mentor = await getMentor(application.mentorId);
  if (!mentor) {
    return <div>No mentor found</div>;
  }

  return (
    <main>
      <SignedIn>
        <TallyPM
          id={params.id}
          studentName={student.name!} //shouldnt be null but might have to change schema to make it not null
          mentorName={mentor.firstname!} //shouldnt be null but might have to change schema to make it not null
          applicationName={application.name}
        />
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </main>
  );
}
