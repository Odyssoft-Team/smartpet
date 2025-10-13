import { Button } from "@/components/ui/button";
import { FaChevronLeft } from "react-icons/fa";
import { es } from "react-day-picker/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function GroomingCalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [period, setPeriod] = useState<"AM" | "PM" | null>(null);

  return (
    <div className="w-full flex flex-col gap-8 items-center justify-center overflow-hidden">
      <div className="w-full flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
          <FaChevronLeft />
          Horarios disponibles
        </h2>

        <Button className="flex w-fit" disabled>
          Continuar
        </Button>
      </div>

      <div className="w-full flex flex-col items-center justify-center gap-4">
        <Card className="w-full">
          <CardHeader className="border-b">
            <CardTitle>Reserva una cita</CardTitle>
            <CardDescription>Selecciona la fecha para tu cita</CardDescription>
          </CardHeader>
          <CardContent className="w-full flex flex-col gap-4 items-center justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              defaultMonth={date}
              numberOfMonths={1}
              locale={es}
              className="p-4 rounded-md !bg-[#f5f5f5]"
              buttonVariant="outline"
            />

            <div className="w-full flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPeriod("AM")}
                  className={cn(
                    "border",
                    period === "AM"
                      ? "bg-[#2EA937] text-white border-[#2EA937]"
                      : "bg-white text-black border-gray-300"
                  )}
                >
                  AM
                </Button>
                <Button
                  onClick={() => setPeriod("PM")}
                  className={cn(
                    "border",
                    period === "PM"
                      ? "bg-[#2EA937] text-white border-[#2EA937]"
                      : "bg-white text-black border-gray-300"
                  )}
                >
                  PM
                </Button>
              </div>
              <div className="rounded-md flex items-center justify-center flex-col text-center gap-2 p-4 bg-[#f5f5f5]">
                <h3 className="text-[#0085D8] text-sm font-semibold">
                  Horarios disponibles
                </h3>
                {period ? (
                  <span className="text-4xl font-bold text-[#D86C00]">6</span>
                ) : (
                  <p className="text-black/50 text-xs max-w-[20ch]">
                    Seleccione AM o PM para revisar los horarios
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
