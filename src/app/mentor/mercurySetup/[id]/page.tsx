"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import { TallyMercury } from "./_components/tally";
import { SignInPage } from "~/components/signInPage";
import { getMentorDetails, type MentorDetails } from "~/api/queries";

export default function MercurySetup() {
  const { user } = useUser();
  const userId = user?.id;

  const [mentorDetails, setMentorDetails] = useState<MentorDetails | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userId) {
      getMentorDetails(userId)
        .then((details) => {
          setMentorDetails(details);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching mentor details:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userId || !mentorDetails) {
    return (
      <main>
        <SignedOut>
          <SignInPage />
        </SignedOut>
        <SignedIn>
          <p>User details not found</p>
        </SignedIn>
      </main>
    );
  }

  const { email, fullname } = mentorDetails;

  return (
    <main>
      <SignedIn>
        <TallyMercury id={userId} name={fullname} email={email} />
      </SignedIn>
      <SignedOut>
        <SignInPage />
      </SignedOut>
    </main>
  );
}
