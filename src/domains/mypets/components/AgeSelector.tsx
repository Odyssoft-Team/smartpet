import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, subYears } from "date-fns";
import { TbCalendarEvent } from "react-icons/tb";

interface AgeSelectorProps {
  onSelectDate: (date?: Date) => void;
  onSelectAge: (years: number) => void;
  onSelectUnknown: () => void;
  selectedDate?: Date;
}

export default function AgeSelector({
  onSelectDate,
  onSelectAge,
  onSelectUnknown,
  selectedDate,
}: AgeSelectorProps) {
  const [years, setYears] = useState<string>("");
  const [method, setMethod] = useState<"date" | "age" | "unknown">("date");
  const [isOpen, setIsOpen] = useState(false);

  const handleAgeChange = (value: string) => {
    const numValue = parseInt(value);
    setYears(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 30) {
      const calculatedDate = subYears(new Date(), numValue);
      onSelectAge(numValue);
      onSelectDate(calculatedDate);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2 justify-center">
        <Button
          type="button"
          variant={method === "date" ? "default" : "outline"}
          onClick={() => setMethod("date")}
        >
          Fecha exacta
        </Button>
        <Button
          type="button"
          variant={method === "age" ? "default" : "outline"}
          onClick={() => setMethod("age")}
        >
          Edad aproximada
        </Button>
        <Button
          type="button"
          variant={method === "unknown" ? "default" : "outline"}
          onClick={() => {
            setMethod("unknown");
            onSelectUnknown();
          }}
        >
          No sé
        </Button>
      </div>

      {method === "date" && (
        <div className="flex flex-col items-center gap-2">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full max-w-[280px]">
                <TbCalendarEvent className="mr-2" />
                {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  onSelectDate(date);
                  setIsOpen(false);
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date(1990, 0, 1)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {method === "age" && (
        <div className="flex items-center justify-center gap-2">
          <Input
            type="number"
            value={years}
            onChange={(e) => handleAgeChange(e.target.value)}
            min="0"
            max="30"
            className="w-20 text-center"
            placeholder="0"
          />
          <span>años</span>
        </div>
      )}
    </div>
  );
}