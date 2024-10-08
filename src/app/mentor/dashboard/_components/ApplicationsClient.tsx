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

interface Application {
  studentName: string | null;
  id: number;
  name: string;
  mentorId: string;
  studentId: number;
  type: string;
  compensation: number;
}

//this setup can allow for overdue applications like in StudentClient
interface ApplicationsClientProps {
  applications: Application[];
}

const ApplicationsClient = ({ applications }: ApplicationsClientProps) => {
  const router = useRouter();

  const handleButtonClick = (applicationId: number) => {
    router.push(`/mentor/completeApplication/${applicationId}`);
  };

  return (
    <div className="flex flex-col items-center">
      {applications.length > 0 && (
        <div className="w-full">
          <h2>Applications</h2>
          <Table>
            <TableCaption>List of all applications</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Application</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Submit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">
                    {application.name}
                  </TableCell>
                  <TableCell>{application.studentName}</TableCell>
                  <TableCell>{application.type}</TableCell>
                  <TableCell>{application.compensation}</TableCell>
                  <TableCell>
                    <button
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                      onClick={() => handleButtonClick(application.id)}
                    >
                      Complete
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

export default ApplicationsClient;
