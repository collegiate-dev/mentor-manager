import { SignedIn, SignedOut } from "@clerk/nextjs";
import { SignInPage } from "~/components/signInPage";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="">
      <SignedIn>
        <div>
          <p>Whats up</p>
        </div>
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </main>
  );
}
