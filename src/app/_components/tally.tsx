"use client";

export interface TallyPMProps {
  id: string;
  mentorName: string;
  studentName: string;
}

export const TallyPM = ({ id, mentorName, studentName }: TallyPMProps) => {
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
        src={`https://tally.so/r/mB1vEe?transparentBackground=1&id=${id}&mentorName=${mentorName}&studentName=${studentName}`}
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
