"use client";

import React, { useEffect, useState } from "react";

import { TallyPM } from "./_components/tally";
import { useSearchParams } from "next/navigation";

export default function PM() {
  const params = useSearchParams();
  const id = params.get("id");
  const mentorName = params.get("mn");
  const studentName = params.get("sn");

  if (!id || !mentorName || !studentName)
    return (
      <div>
        Invalid Please Use Full URL Provided. Contact Ishaan for support
        ishaan@collegiate.dev
      </div>
    );

  return (
    <main>
      <TallyPM id={id} mentorName={mentorName} studentName={studentName} />
    </main>
  );
}
