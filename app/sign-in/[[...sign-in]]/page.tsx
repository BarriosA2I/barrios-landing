import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-[#141414] border border-[#27272a] shadow-2xl',
          },
        }}
        redirectUrl="/dashboard"
        signUpUrl="/sign-up"
      />
    </main>
  );
}
