"use client";

import { useEffect, useState } from "react";
import { getMatchById } from "~/api/getMatch";
import { getStudent } from "~/api/getStudent";

export interface TallyPMProps {
  id: string;
}

export const TallyPM = ({ id }: TallyPMProps) => {
  const [studentName, setStudentName] = useState<string>("");

  useEffect(() => {
    const fetchStudentName = async () => {
      try {
        const matchId = Number(id);
        if (isNaN(matchId)) {
          setStudentName("Invalid ID");
          return;
        }

        const match = await getMatchById(matchId);
        if (match) {
          const student = await getStudent(match.studentId);
          setStudentName(student?.name ?? "Unknown");
        } else {
          setStudentName("Match not found");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        setStudentName("Error fetching student");
      }
    };

    fetchStudentName().catch((error) => {
      console.error("Unexpected error:", error);
      setStudentName("Error fetching student");
    });
  }, [id]);

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <iframe
        src={`https://tally.so/r/mB1vEe?transparentBackground=1&id=${id}&studentName=${studentName}`}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          border: "none",
        }}
        title="Parent Insight Form"
      ></iframe>
    </div>
  );
};
