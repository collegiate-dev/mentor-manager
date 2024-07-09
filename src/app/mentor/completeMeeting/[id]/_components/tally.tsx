"use client";

import React from "react";

export interface TallyPMProps {
  id: string;
  studentName: string;
  mentorName: string;
}

export const TallyPM = ({ id, studentName, mentorName }: TallyPMProps) => {
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
        src={`https://tally.so/r/mB1vEe?transparentBackground=1&matchId=${id}&studentName=${studentName}&mentorName=${mentorName}`}
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
        title="Mentor Meeting Form"
      ></iframe>
    </div>
  );
};
