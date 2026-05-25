import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
  <div className="text-xl items-center justify-center flex min-h-screen">
    <SignIn
      path="/sign-in"
      routing="path"
      signUpUrl="/sign-up"
    />
  </div>
  );
}