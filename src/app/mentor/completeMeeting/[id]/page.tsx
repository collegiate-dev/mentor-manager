import { SignedIn, SignedOut } from "@clerk/nextjs";
import { TallyPM } from "./_components/tally";
import { getMatchById } from "~/api/getMatch";
import { getStudent } from "~/api/getStudent";
import { SignInPage } from "~/components/signInPage";
import { getUserFirstName } from "~/api/getUserFirstName";

export default async function PM({ params }: { params: { id: string } }) {
  const matchId = Number(params.id);

  if (isNaN(matchId)) {
    return (
      <div>Invalid. Contact Ishaan for support at ishaan@collegiate.dev</div>
    );
  }

  const match = await getMatchById(matchId);
  let studentName = "Unknown";

  const type = match?.type ?? "Unknown";

  if (match) {
    const student = await getStudent(match.studentId);
    studentName = student?.name ?? "Unknown";
  } else {
    studentName = "Match not found";
  }
  const mentorName = await getUserFirstName();
  if (!mentorName) {
    return <div>Name not found</div>;
  }

  return (
    <main>
      <SignedIn>
        <TallyPM
          id={params.id}
          studentName={studentName}
          mentorName={mentorName}
          type={type}
        />
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </main>
  );
}
