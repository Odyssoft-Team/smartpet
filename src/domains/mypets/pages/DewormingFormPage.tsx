import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePetStore } from "@/store/pets.store";
import { useDeworming } from "../services/dewormingService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { es } from "date-fns/locale";

export default function DewormingFormPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { selectedPet } = usePetStore();
  const { addDeworming, loading } = useDeworming();

  const [appliedAt, setAppliedAt] = useState<Date | undefined>(undefined);
  const [nextDoseAt, setNextDoseAt] = useState<Date | undefined>(undefined);
  const [productName, setProductName] = useState("");
  const [notes, setNotes] = useState("");

  const [openAppliedAt, setOpenAppliedAt] = useState(false);
  const [openNextDoseAt, setOpenNextDoseAt] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<FileList | null>(null);

  if (!selectedPet || !petId) {
    navigate("/mypets");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appliedAt) {
      alert("Por favor ingresa la fecha de aplicación");
      return;
    }

    const deworming = {
      pet_id: petId,
      applied_at: appliedAt.toISOString(),
      next_dose_at: nextDoseAt?.toISOString() || undefined,
      product_name: productName || undefined,
      notes: notes || undefined,
    };

    const result = await addDeworming(deworming);
    if (result) {
      navigate(`/pets/${petId}/deworming`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-4 bg-white min-h-screen">
      <div className="w-full flex justify-start mb-4">
        <Link to={`/pets/${petId}/deworming`}>
          <Button
            size="back"
            variant="back"
            className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
          >
            <IoIosArrowBack className="size-8" />
            <span className="-ml-2">Nueva Desparasitación</span>
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Producto utilizado</label>
          <Input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="Nombre del desparasitante"
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <label className="text-sm font-medium">Fecha de aplicación*</label>
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Adjuntar archivos</label>
          <input
            ref={fileInputRef}
            id="deworming-files"
            type="file"
            multiple
            className="hidden"
            onChange={(e) => setAttachedFiles(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full bg-sky-50 text-sky-700 justify-center"
            onClick={() => fileInputRef.current?.click()}
          >
            Adjuntar archivos
          </Button>
          {attachedFiles && attachedFiles.length > 0 && (
            <p className="text-sm text-gray-500">{attachedFiles.length} archivo(s) seleccionado(s)</p>
          )}
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