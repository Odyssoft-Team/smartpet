import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePetStore } from "@/store/pets.store";
import { Textarea } from "@/components/ui/textarea";
import { addVaccine } from "../services/addVaccine";
import { getVaccines, type Vaccine } from "../services/getVaccines";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDownIcon, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { es } from "date-fns/locale";

export default function VaccineFormPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { selectedPet } = usePetStore();

  const [appliedAt, setAppliedAt] = useState<Date | undefined>(undefined);
  const [nextDoseAt, setNextDoseAt] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [listVaccines, setListVaccines] = useState<Vaccine[]>([]);
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);

  const [open, setOpen] = useState(false);
  const [openAppliedAt, setOpenAppliedAt] = useState(false);
  const [openNextDoseAt, setOpenNextDoseAt] = useState(false);

  useEffect(() => {
    const fetchVaccines = async () => {
      const data = await getVaccines();
      if (data) {
        setListVaccines(data);
      }
    };

    fetchVaccines();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!appliedAt) {
      alert("Por favor ingresa la fecha de aplicación");
      return;
    }

    const vaccine = {
      pet_id: petId as string,
      applied_at: appliedAt,
      next_dose_at: nextDoseAt || undefined,
      notes: notes || undefined,
    };
    setLoading(true);
    const result = await addVaccine(vaccine);
    if (result) {
      navigate(`/pets/${petId}/vaccines`);
    }
    setLoading(false);
  };

  if (!selectedPet || !petId) {
    navigate("/mypets");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-start pt-4 bg-white min-h-screen">
      <div className="w-full flex justify-start mb-4">
        <Link to={`/pets/${petId}/vaccines`}>
          <Button
            size="back"
            variant="back"
            className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
          >
            <IoIosArrowBack className="size-8" />
            <span className="-ml-2">Nueva Vacuna</span>
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Vacunas*</label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
              >
                {selectedVaccine
                  ? listVaccines.find(
                      (vaccine) => vaccine.id === selectedVaccine?.id
                    )?.name
                  : "Seleccionar vacuna..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar vacunas..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No se encontraron vacunas.</CommandEmpty>
                  <CommandGroup>
                    {listVaccines.map((vaccine) => (
                      <CommandItem
                        key={vaccine.id}
                        value={vaccine.name}
                        onSelect={() => {
                          setSelectedVaccine(vaccine);
                          setOpen(false);
                        }}
                      >
                        {vaccine.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedVaccine?.id === vaccine.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">Fecha de aplicación*</label>
          {/* <Input
            type="date"
            value={appliedAt}
            onChange={(e) => setAppliedAt(e.target.value)}
            required
          /> */}
          <Popover open={openAppliedAt} onOpenChange={setOpenAppliedAt}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
              >
                {appliedAt
                  ? appliedAt.toLocaleDateString()
                  : "Seleccionar fecha"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                fromDate={new Date(2000, 0, 1)}
                toDate={new Date(2035, 11, 31)}
                selected={appliedAt}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setAppliedAt(date);
                  setOpenAppliedAt(false);
                }}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">Próxima dosis</label>
          <Popover open={openNextDoseAt} onOpenChange={setOpenNextDoseAt}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date"
                className="w-full justify-between font-normal"
              >
                {nextDoseAt
                  ? nextDoseAt.toLocaleDateString()
                  : "Seleccionar fecha"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={nextDoseAt}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setNextDoseAt(date);
                  setOpenNextDoseAt(false);
                }}
                locale={es}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notas</label>
          <Textarea
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNotes(e.target.value)
            }
            placeholder="Observaciones o detalles adicionales"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !appliedAt}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </div>
  );
}
