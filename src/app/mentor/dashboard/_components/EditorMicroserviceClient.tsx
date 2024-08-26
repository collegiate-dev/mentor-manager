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

interface EditorMicroservice {
  studentName: string | null;
  id: number;
  name: string;
  mentorId: string;
  studentId: number;
  type: string;
  compensation: number;
}

interface EditorMicroserviceClientProps {
  applications: EditorMicroservice[];
}

const EditorMicroserviceClient = ({
  applications,
}: EditorMicroserviceClientProps) => {
  const router = useRouter();

  const handleButtonClick = (essayId: number) => {
    router.push(`/mentor/completeEditorMicroservice/${essayId}`);
  };

  return (
    <div className="flex flex-col items-center">
      {applications.length > 0 && (
        <div className="w-full">
          <h2>Essay Microservices</h2>
          <Table>
            <TableCaption>List of all Essay Microservices</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>applications</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Payout</TableHead>
                <TableHead>Submit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((essay) => (
                <TableRow key={essay.id}>
                  <TableCell className="font-medium">{essay.name}</TableCell>
                  <TableCell>{essay.studentName}</TableCell>
                  <TableCell>{essay.type}</TableCell>
                  <TableCell>{essay.compensation}</TableCell>
                  <TableCell>
                    <button
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
                      onClick={() => handleButtonClick(essay.id)}
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

export default EditorMicroserviceClient;
