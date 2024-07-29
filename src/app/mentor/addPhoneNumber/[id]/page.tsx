import { SignedIn, SignedOut } from "@clerk/nextjs";
import { TallyMercury } from "./_components/tally";
import { SignInPage } from "~/components/signInPage";
import { getMentorDetails } from "~/api/queries";
import { auth } from "@clerk/nextjs/server";

export default async function MercurySetup() {
  const { userId } = auth();

  if (!userId) {
    return (
      <main>
        <SignedOut>
          <SignInPage />
        </SignedOut>
        <SignedIn>
          <p>User details not found</p>
        </SignedIn>
      </main>
    );
  }

  const mentorDetails = await getMentorDetails(userId);

  if (!mentorDetails) {
    return (
      <main>
        <SignedOut>
          <SignInPage />
        </SignedOut>
        <SignedIn>
          <p>User details not found</p>
        </SignedIn>
      </main>
    );
  }

  const { fullname } = mentorDetails;

  return (
    <main>
      <SignedIn>
        <TallyMercury id={userId} name={fullname} />
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </main>
  );
}
