import { getMatchesByMentorId } from "~/api/getMentorMatches";
import { getStudent } from "~/api/getStudent";
import { auth } from "@clerk/nextjs/server";
import StudentsClient from "./_components/StudentsClient";

export default async function StudentsPage() {
  const { userId } = auth() as { userId: string };
  if (!userId) {
    return <div>Please log in to view matches</div>;
  }

  try {
    const matches = await getMatchesByMentorId(userId);

    const studentDataPromises = matches.map(async (match) => {
      const student = await getStudent(match.studentId);
      return {
        ...match,
        studentName: student ? student.name : "Unknown",
      };
    });

    const matchesWithStudentNames = await Promise.all(studentDataPromises);
    return <StudentsClient matches={matchesWithStudentNames} />;
  } catch (error) {
    console.error("Error fetching matches:", error);
    return <div>Error fetching matches. Please try again later.</div>;
  }
}
