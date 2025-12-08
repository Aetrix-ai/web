import { SignupForm } from "@/components/signup-form"
import { Toaster } from "@/components/ui/sonner"

export default function SignupPage() {
  return (
    <div className="bg-muted flex h-screen flex-col items-center justify-center p-6 md:p-10 overflow-hidden">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
      <Toaster position="top-center" />
    </div>
  )
}
