// CompleteBankingButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

interface CompletePhoneNumberButtonProps {
  userId: string;
}

const AddPhoneNumberButton: React.FC<CompletePhoneNumberButtonProps> = ({
  userId,
}) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(`/mentor/addPhoneNumber/${userId}`);
  };

  return (
    <>
      <p>In order to complete payments you must add a phone number</p>
      <Button onClick={handleButtonClick}>Add Phone Number</Button>
    </>
  );
};

export default AddPhoneNumberButton;
