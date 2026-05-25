import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="text-xl items-center justify-center flex min-h-screen">
      <SignUp />
    </div>
  );
}