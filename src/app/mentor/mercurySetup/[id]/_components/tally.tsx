"use client";

import React from "react";

export interface TallyMercuryProps {
  id: string;
  name: string;
  email: string;
}

export const TallyMercury = ({ id, name, email }: TallyMercuryProps) => {
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
        src={`https://tally.so/r/mZJJa5?transparentBackground=1&id=${id}&name=${name}&email=${email}`}
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
        title="Mercury Onboarding Form"
      ></iframe>
    </div>
  );
};
