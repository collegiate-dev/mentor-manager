// CompleteBankingButton.tsx
"use client";

import { useRouter } from "next/navigation";

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
    <button onClick={handleButtonClick}>Complete Banking Information</button>
  );
};

export default CompleteBankingButton;
