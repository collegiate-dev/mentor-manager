"use client";

import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

interface Match {
  studentName: string | null;
  id: number;
  mentorId: string | null;
  studentId: number;
  totalMeetings: number | null;
  meetingsCompleted: number | null;
  frequency: number | null;
}

interface StudentsClientProps {
  matches: Match[];
}

const StudentsClient = ({ matches }: StudentsClientProps) => {
  const router = useRouter();

  if (matches.length === 0) {
    return <div>No matches found</div>;
  }

  const handleButtonClick = (matchId: number) => {
    router.push(`/mentor/completeMeeting/${matchId}`);
  };

  return (
    <div className="flex w-1/2 flex-wrap gap-4">
      <Table>
        <TableCaption>A list of all current matchings</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Meetings Completed</TableHead>
            <TableHead>Total Meetings</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Mark Complete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {matches.map((match) => (
            <TableRow key={match.studentId}>
              <TableCell className="font-medium">{match.studentName}</TableCell>
              <TableCell>{match.meetingsCompleted}</TableCell>
              <TableCell>{match.totalMeetings}</TableCell>
              <TableCell>{match.frequency}</TableCell>
              <TableCell>
                <button
                  className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                  onClick={() => handleButtonClick(match.id)}
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
};

export default StudentsClient;
