import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function TopNav() {
  return (
    <nav className="flex w-full items-center justify-between border-b bg-gray-800 p-4 text-xl font-semibold text-white">
      <div> Mentor Manager</div>
      <div className="text-lg font-normal">
        <Link href="/mentor/dashboard">Mentor Dashboard</Link>
      </div>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
