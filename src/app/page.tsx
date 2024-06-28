import { SignedIn, SignedOut } from "@clerk/nextjs";
import { getMatchesByMentorId } from "~/api/getMentorMatches";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { getStudent } from "~/api/getStudent";
import { auth } from "@clerk/nextjs/server";
export const dynamic = "force-dynamic";

async function Matches() {
  const { userId } = auth() as { userId: string };
  if (!userId) {
    return <div>Please log in to view matches</div>;
  }
  const matches = await getMatchesByMentorId(userId);

  const studentDataPromises = matches.map(async (match) => {
    const student = await getStudent(match.studentId);
    return {
      ...match,
      studentName: student ? student.name : "Unknown",
    };
  });

  const matchesWithStudentNames = await Promise.all(studentDataPromises);

  return (
    <div className="flex flex-wrap gap-4">
      <p>{userId}</p>
      <Table>
        <TableCaption>A list of all current matchings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Meetings Completed</TableHead>
            <TableHead>Total Meetings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matchesWithStudentNames.map((match) => (
            <TableRow key={match.studentId}>
              <TableCell className="font-medium">{match.studentName}</TableCell>
              <TableCell>{match.meetingsCompleted}</TableCell>
              <TableCell>{match.totalMeetings}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// async function Matches() {
//   const matches = await getMatchesByMentorId("100");
//   return (
//     <div className="flex flex-wrap gap-4">
//       <Table>
//         <TableCaption>A list of all current matchings</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead>Student Name</TableHead>
//             <TableHead>Meetings Completed</TableHead>
//             <TableHead>Total Meetings</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {matches.map((match) => (
//             <TableRow key={match.studentId}>
//               <TableCell className="font-medium">{match.studentId}</TableCell>
//               <TableCell>{match.meetingsCompleted}</TableCell>
//               <TableCell>{match.totalMeetings}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }

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
