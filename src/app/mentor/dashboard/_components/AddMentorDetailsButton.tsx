// CompleteBankingButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

interface ButtonProps {
  userId: string;
}

const AddMentorDetailsButton: React.FC<ButtonProps> = ({ userId }) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(`/mentor/addMentorDetails/${userId}`);
  };

  return (
    <>
      <p>
        In order to complete payments you must add a phone number and address to
        your account
      </p>
      <Button onClick={handleButtonClick}>Add Details</Button>
    </>
  );
};

export default AddMentorDetailsButton;
