import { RegisterEmailVerification } from "../components/RegisterEmailVerification";

export default function RegisterEmailVerificationPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 w-full">
      <div className="w-full">
        <RegisterEmailVerification />
      </div>
    </div>
  );
}
