import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PetFormLayout from "../components/PetFormLayout";
import { useRegisterPetStore } from "../store/registerPet.store";
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
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllSpecies, type Species } from "../services/getAllSpecies";
import { getBreedsBySpecies } from "../services/getBreedsBySpecies";

interface Breed {
  id: number;
  name: string;
  species_id: number;
}

// Especies hardcodeadas
const SPECIES = [
  { id: 1, name: "Perro" },
  { id: 2, name: "Gato" },
];

// Razas hardcodeadas como fallback
const DEFAULT_BREEDS = {
  1: [
    // Perros
    { id: 1, name: "Pastor Alemán", species_id: 1 },
    { id: 2, name: "Bulldog Inglés", species_id: 1 },
    { id: 3, name: "Beagle", species_id: 1 },
    { id: 4, name: "Husky Siberiano", species_id: 1 },
    { id: 5, name: "Shih Tzu", species_id: 1 },
    { id: 6, name: "Golden Retriever", species_id: 1 },
    { id: 7, name: "Poodle", species_id: 1 },
    { id: 8, name: "Labrador Retriever", species_id: 1 },
    { id: 9, name: "Mestizo", species_id: 1 },
  ],
  2: [
    // Gatos
    { id: 10, name: "Persa", species_id: 2 },
    { id: 11, name: "Siamés", species_id: 2 },
    { id: 12, name: "Maine Coon", species_id: 2 },
    { id: 13, name: "Bengalí", species_id: 2 },
    { id: 14, name: "Mestizo", species_id: 2 },
  ],
};

export default function RegisterPetStep2() {
  const { species_id, breed_id, setField, nextStep } = useRegisterPetStore();
  const navigate = useNavigate();

  const [species, setSpecies] = useState<Species[]>([]);
  const [breeds, setBreeds] = useState<Breed[]>([]);
  const [selectedSpecies, setSelectedSpecies] = useState<Species | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchSpecies = async () => {
      const data = await getAllSpecies();
      if (data) {
        setSpecies(data);
        console.log(selectedSpecies);

        // Si ya hay una especie seleccionada, encontrarla
        if (species_id) {
          const found = data.find((s) => s.id === species_id);
          if (found) setSelectedSpecies(found);
        }
      }
    };

    fetchSpecies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchBreeds = async () => {
      if (species_id) {
        // Mostrar razas hardcodeadas inmediatamente
        setBreeds(
          DEFAULT_BREEDS[species_id as keyof typeof DEFAULT_BREEDS] || []
        );

        // Intentar cargar desde Supabase
        const data = await getBreedsBySpecies(species_id);
        if (data && data.length > 0) {
          // Si carga exitosamente, reemplazar con datos de Supabase
          setBreeds(data);
          
          // Si ya hay un breed_id seleccionado, encontrar la raza
          if (breed_id) {
            const found = data.find((b) => b.id === breed_id);
            if (found) setSelectedBreed(found);
          }
        } else {
          // Si hay breed_id pero no cargó desde Supabase, usar datos hardcodeados
          if (breed_id) {
            const fallbackBreeds = DEFAULT_BREEDS[species_id as keyof typeof DEFAULT_BREEDS] || [];
            const found = fallbackBreeds.find((b) => b.id === breed_id);
            if (found) setSelectedBreed(found);
          }
        }
      }
    };
    fetchBreeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [species_id, breed_id, getBreedsBySpecies]);

  const handleNext = () => {
    if (!species_id || !breed_id) return;
    nextStep();
    navigate("/register-pet/step3");
  };

  const handleBack = () => {
    navigate("/register-pet/step1");
  };

  const handleSelectSpecies = (speciesId: number) => {
    const selected = species.find((s) => s.id === speciesId);
    if (selected) {
      setSelectedSpecies(selected);
      setField("species_id", speciesId);
      setField("breed_id", undefined);
      setBreeds([]);
    }
    setField("species_id", speciesId);
    setField("breed_id", undefined);
    setBreeds([]);
  };

  const handleSelectBreed = (breedId: number) => {
    const selected = breeds.find((b) => b.id === breedId);
    if (selected) {
      setSelectedBreed(selected);
    }
    setField("breed_id", breedId);
  };

  return (
    <PetFormLayout
      currentStep={2}
      totalSteps={7}
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!species_id || !breed_id}
    >
      <div className="w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">¿Qué tipo de mascota tienes?</h1>
          <p className="text-gray-500">Selecciona la especie de tu mascota</p>
        </div>

        {/* Especies - Hardcodeadas */}
        <div className="flex justify-center gap-x-8">
          {SPECIES.map((sp) => (
            <button
              key={sp.id}
              type="button"
              onClick={() => handleSelectSpecies(sp.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                species_id === sp.id
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              <span className="text-5xl">
                {/* {sp.id === 1 ? "🐕" : sp.id === 2 ? "🐈" : "🐾"} */}
                {sp.id === 1 ? "🐕" : "🐈"}
              </span>
              <span className="font-medium">{sp.name}</span>
            </button>
          ))}
        </div>

        {/* Razas - Dinámicas desde Supabase */}
        {species_id && (
          <div className="space-y-2">
            <p className="text-center font-medium">Selecciona la raza</p>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                  disabled={breeds.length === 0}
                >
                  {selectedBreed
                    ? selectedBreed.name
                    : breeds.length === 0
                    ? "Cargando razas..."
                    : "Selecciona una raza"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Buscar raza..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontraron razas.</CommandEmpty>
                    <CommandGroup>
                      {breeds.map((breed) => (
                        <CommandItem
                          key={breed.id}
                          value={breed.name}
                          onSelect={() => {
                            handleSelectBreed(breed.id);
                            setOpen(false);
                          }}
                        >
                          {breed.name}
                          <Check
                            className={cn(
                              "ml-auto",
                              selectedBreed?.id === breed.id
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
        )}
      </div>
    </PetFormLayout>
  );
}
