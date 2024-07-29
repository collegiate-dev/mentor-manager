/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

// import React, { useEffect } from "react";
// import { retrieveField } from "~/lib/utils";

export interface TallyMercuryProps {
  id: string;
  name: string;
}

export const TallyMercury = ({ id, name }: TallyMercuryProps) => {
  // useEffect(() => {
  //   const handleFormSubmit = (event: MessageEvent) => {
  //     try {
  //       const data = JSON.parse(event.data as string);
  //       if (data.event === "Tally.FormSubmitted") {
  //         const concentration = retrieveField(data, "concentration");
  //       }
  //     } catch (error) {}
  //   };
  //   window.addEventListener("message", handleFormSubmit);
  //   return () => window.removeEventListener("message", handleFormSubmit);
  // }, []);

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
        src={`https://tally.so/r/3XqppL?transparentBackground=1&id=${id}&name=${name}`}
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
