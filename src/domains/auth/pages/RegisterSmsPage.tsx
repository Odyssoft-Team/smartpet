import { RegisterSms } from "../components/RegisterSms";

export default function RegisterSmsPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 w-full">
      <div className="w-full">
        <RegisterSms />
      </div>
    </div>
  );
}
