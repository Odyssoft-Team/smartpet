import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePetStore } from "@/store/pets.store";
import { useRevisions, type Clinic, type RevisionType, type RevisionStatus } from "../services/revisionsService";
import { Textarea } from "@/components/ui/textarea";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RevisionsFormPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { selectedPet } = usePetStore();
  const { addRevision, getClinics, getRevisionTypes, getRevisionStatuses, loading } = useRevisions();

  const [description, setDescription] = useState("");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [selectedType, setSelectedType] = useState<RevisionType | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<RevisionStatus | null>(null);

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [revisionTypes, setRevisionTypes] = useState<RevisionType[]>([]);
  const [revisionStatuses, setRevisionStatuses] = useState<RevisionStatus[]>([]);

  const [openClinic, setOpenClinic] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<FileList | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [clinicsData, typesData, statusesData] = await Promise.all([
        getClinics(),
        getRevisionTypes(),
        getRevisionStatuses()
      ]);

      if (clinicsData) setClinics(clinicsData);
      if (typesData) setRevisionTypes(typesData);
      if (statusesData) setRevisionStatuses(statusesData);
    };

    fetchData();
  }, [getClinics, getRevisionTypes, getRevisionStatuses]);

  if (!selectedPet || !petId) {
    navigate("/mypets");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const revision = {
      pet_id: petId,
      clinic_id: selectedClinic?.id,
      description: description || undefined,
      revision_type_id: selectedType?.id,
      revision_status_id: selectedStatus?.id,
    };

    const result = await addRevision(revision);
    if (result) {
      navigate(`/pets/${petId}/revisions`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-4 bg-white min-h-screen">
      <div className="w-full flex justify-start mb-4">
        <Link to={`/pets/${petId}/revisions`}>
          <Button
            size="back"
            variant="back"
            className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
          >
            <IoIosArrowBack className="size-8" />
            <span className="-ml-2">Nueva Revisión</span>
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Tipo de revisión</label>
          <Popover open={openType} onOpenChange={setOpenType}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openType}
                className="w-full justify-between"
              >
                {selectedType ? selectedType.name : "Seleccionar tipo..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar tipo..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No se encontraron tipos.</CommandEmpty>
                  <CommandGroup>
                    {revisionTypes.map((type) => (
                      <CommandItem
                        key={type.id}
                        value={type.name}
                        onSelect={() => {
                          setSelectedType(type);
                          setOpenType(false);
                        }}
                      >
                        {type.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedType?.id === type.id ? "opacity-100" : "opacity-0"
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Clínica</label>
          <Popover open={openClinic} onOpenChange={setOpenClinic}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openClinic}
                className="w-full justify-between"
              >
                {selectedClinic ? selectedClinic.name : "Seleccionar clínica..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar clínica..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No se encontraron clínicas.</CommandEmpty>
                  <CommandGroup>
                    {clinics.map((clinic) => (
                      <CommandItem
                        key={clinic.id}
                        value={clinic.name}
                        onSelect={() => {
                          setSelectedClinic(clinic);
                          setOpenClinic(false);
                        }}
                      >
                        {clinic.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedClinic?.id === clinic.id ? "opacity-100" : "opacity-0"
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Estado</label>
          <Popover open={openStatus} onOpenChange={setOpenStatus}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStatus}
                className="w-full justify-between"
              >
                {selectedStatus ? selectedStatus.name : "Seleccionar estado..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar estado..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No se encontraron estados.</CommandEmpty>
                  <CommandGroup>
                    {revisionStatuses.map((status) => (
                      <CommandItem
                        key={status.id}
                        value={status.name}
                        onSelect={() => {
                          setSelectedStatus(status);
                          setOpenStatus(false);
                        }}
                      >
                        {status.name}
                        <Check
                          className={cn(
                            "ml-auto",
                            selectedStatus?.id === status.id ? "opacity-100" : "opacity-0"
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

        <div className="space-y-2">
          <label className="text-sm font-medium">Descripción</label>
          <Textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            placeholder="Detalles de la revisión o consulta"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Adjuntar archivos</label>
          <input
            ref={fileInputRef}
            id="revision-files"
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
          disabled={loading}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </div>
  );
}