"use client";

import React from "react";

export interface TallyPMProps {
  id: string;
  studentName: string;
  mentorName: string;
  applicationName: string;
}

export const TallyPM = ({
  id,
  studentName,
  mentorName,
  applicationName,
}: TallyPMProps) => {
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
        src={`https://tally.so/r/w2LKBA?transparentBackground=1&applicationId=${id}&studentName=${studentName}&mentorName=${mentorName}&applicationName=${applicationName}`}
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
        title="Editor Completition Form"
      ></iframe>
    </div>
  );
};
