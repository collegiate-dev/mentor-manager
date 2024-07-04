import { SignedIn, SignedOut } from "@clerk/nextjs";
import { SignInPage } from "~/components/signInPage";
import { Matches } from "./_components/matches";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="">
      <SignedIn>
        <Matches />
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </main>
  );
}
