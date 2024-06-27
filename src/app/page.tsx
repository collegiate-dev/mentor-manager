import { db } from "~/server/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const matches = await db.query.matches.findMany();

  console.log("matches", matches);
  return (
    <main className="">
      <div className="flex flex-wrap gap-4">
        {matches.map((match) => (
          <div key={match.studentId}>{match.studentId}</div>
        ))}
      </div>
    </main>
  );
}
