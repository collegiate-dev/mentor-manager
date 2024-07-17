import { SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { SignInPage } from "~/components/signInPage";
import { Button } from "~/components/ui/button";
export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="flex flex-col items-center">
      <SignedIn>
        <p>Welcome to Mentor Manger Please navigate to your dashboard</p>
        <Link href="/mentor/dashboard">
          <Button>Dashboard</Button>
        </Link>
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </main>
  );
}
