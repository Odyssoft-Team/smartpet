import { RegisterName } from "../components/RegisterName";

export default function RegisterNamePage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 w-full">
      <div className="w-full">
        <RegisterName />
      </div>
    </div>
  );
}
