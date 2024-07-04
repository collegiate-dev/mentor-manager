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

export async function Matches() {
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
    <div className="flex w-1/2 flex-wrap gap-4">
      <p>{userId}</p>
      <Table>
        <TableCaption>A list of all current matchings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Meetings Completed</TableHead>
            <TableHead>Total Meetings</TableHead>
            <TableHead>Mark Complete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matchesWithStudentNames.map((match) => (
            <TableRow key={match.studentId}>
              <TableCell className="font-medium">{match.studentName}</TableCell>
              <TableCell>{match.meetingsCompleted}</TableCell>
              <TableCell>{match.totalMeetings}</TableCell>
              <TableCell>
                <button
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                  // onClick={handleButtonClick}
                >
                  Select
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
