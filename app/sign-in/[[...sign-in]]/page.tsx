import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-[#0a0a0a] relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,206,209,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,206,209,0.03)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00CED1]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#8B5CF6]/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />

      {/* Glass card container */}
      <div className="relative z-10">
        {/* Glow ring behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#00CED1]/20 via-[#8B5CF6]/20 to-[#00CED1]/20 rounded-2xl blur-xl opacity-60" />

        <SignIn
          appearance={{
            variables: {
              colorPrimary: '#00CED1',
              colorText: '#fafafa',
              colorTextSecondary: '#a1a1aa',
              colorBackground: '#141414',
              colorInputBackground: '#0a0a0a',
              colorInputText: '#fafafa',
              borderRadius: '0.75rem',
            },
            elements: {
              rootBox: 'mx-auto',
              card: 'bg-[#141414]/80 backdrop-blur-xl border border-white/10 shadow-[0_0_60px_rgba(0,206,209,0.15)] rounded-2xl',
              headerTitle: 'text-[#fafafa] font-semibold tracking-tight',
              headerSubtitle: 'text-[#a1a1aa]',
              socialButtonsBlockButton: 'bg-[#1a1a1a] border border-white/10 hover:border-[#00CED1]/50 hover:bg-[#1a1a1a] hover:shadow-[0_0_20px_rgba(0,206,209,0.2)] transition-all duration-300',
              socialButtonsBlockButtonText: 'text-[#fafafa] font-medium',
              dividerLine: 'bg-white/10',
              dividerText: 'text-[#a1a1aa]',
              formFieldLabel: 'text-[#a1a1aa] text-sm',
              formFieldInput: 'bg-[#0a0a0a] border border-white/10 text-[#fafafa] focus:border-[#00CED1]/50 focus:ring-1 focus:ring-[#00CED1]/30 transition-all duration-300',
              formButtonPrimary: 'bg-gradient-to-r from-[#00CED1] to-[#00CED1]/80 hover:from-[#00CED1] hover:to-[#00CED1] hover:shadow-[0_0_30px_rgba(0,206,209,0.4)] text-[#0a0a0a] font-semibold transition-all duration-300 active:scale-[0.98]',
              footerActionLink: 'text-[#00CED1] hover:text-[#00CED1]/80 transition-colors',
              identityPreviewEditButton: 'text-[#00CED1]',
              formFieldInputShowPasswordButton: 'text-[#a1a1aa] hover:text-[#00CED1]',
              otpCodeFieldInput: 'bg-[#0a0a0a] border border-white/10 text-[#fafafa]',
              alert: 'bg-red-500/10 border border-red-500/20 text-red-400',
              alertText: 'text-red-400',
              logoBox: 'h-24',
              logoImage: 'h-24 w-auto',
            },
          }}
          signUpUrl="/sign-up"
        />
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00CED1]/50 to-transparent" />
    </main>
  );
}
