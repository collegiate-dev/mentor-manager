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
  daysSinceLastMeeting: number | null;
}

interface StudentsClientProps {
  overdueMatches: Match[];
  regularMatches: Match[];
}

const StudentsClient = ({
  overdueMatches,
  regularMatches,
}: StudentsClientProps) => {
  const router = useRouter();

  const handleButtonClick = (matchId: number) => {
    router.push(`/mentor/completeMeeting/${matchId}`);
  };

  return (
    <div className="flex flex-col items-center">
      {overdueMatches.length > 0 && (
        <div className="w-full">
          <h2>To-do&apos;s</h2>
          <Table>
            <TableCaption>
              These matches are ready to have a meeting
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Meetings Completed</TableHead>
                <TableHead>Total Meetings</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Days Since Last Meeting</TableHead>
                <TableHead>Mark Complete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdueMatches.map((match) => (
                <TableRow key={match.studentId}>
                  <TableCell className="font-medium">
                    {match.studentName}
                  </TableCell>
                  <TableCell>{match.meetingsCompleted}</TableCell>
                  <TableCell>{match.totalMeetings}</TableCell>
                  <TableCell>{match.frequency}</TableCell>
                  <TableCell>
                    {match.daysSinceLastMeeting ?? "No meetings yet"}
                  </TableCell>
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
      )}
      {regularMatches.length > 0 && (
        <div className="w-full">
          <h2>On-track</h2>
          <Table>
            <TableCaption>
              A list of all current matchings that are on-track
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Meetings Completed</TableHead>
                <TableHead>Total Meetings</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Days Since Last Meeting</TableHead>
                <TableHead>Mark Complete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regularMatches.map((match) => (
                <TableRow key={match.studentId}>
                  <TableCell className="font-medium">
                    {match.studentName}
                  </TableCell>
                  <TableCell>{match.meetingsCompleted}</TableCell>
                  <TableCell>{match.totalMeetings}</TableCell>
                  <TableCell>{match.frequency}</TableCell>
                  <TableCell>{match.daysSinceLastMeeting}</TableCell>
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
      )}
    </div>
  );
};

export default StudentsClient;
