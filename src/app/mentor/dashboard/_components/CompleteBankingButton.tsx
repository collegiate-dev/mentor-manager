// CompleteBankingButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

interface CompleteBankingButtonProps {
  userId: string;
}

const CompleteBankingButton: React.FC<CompleteBankingButtonProps> = ({
  userId,
}) => {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push(`/mentor/mercurySetup/${userId}`);
  };

  return (
    <Button onClick={handleButtonClick}>Complete Banking Information</Button>
  );
};

export default CompleteBankingButton;
