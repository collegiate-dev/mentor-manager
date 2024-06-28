import { SignedIn, SignedOut } from "@clerk/nextjs";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";

async function Matches() {
  const matches = await db.query.matches.findMany();
  return (
    <div className="flex flex-wrap gap-4">
      {matches.map((match) => (
        <div key={match.studentId}>{match.studentId}</div>
      ))}
    </div>
  );
}

export default async function HomePage() {
  return (
    <main className="">
      <SignedIn>
        <Matches />
      </SignedIn>
      <SignedOut>
        <div className="text-center">
          <h1 className="text-4xl font-bold">Welcome to Mentor Manager</h1>
          <p className="text-lg">Please sign in to continue</p>
        </div>
      </SignedOut>
    </main>
  );
}
