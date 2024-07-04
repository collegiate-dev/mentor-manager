import { SignInButton } from "@clerk/nextjs";

export const SignInPage = () => (
  <div className="text-center">
    <h1 className="text-4xl font-bold">Welcome to Mentor Manager</h1>
    <p className="text-lg">Please sign in to continue</p>
    <SignInButton />
  </div>
);
