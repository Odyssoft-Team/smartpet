import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PetFormLayout from "../components/PetFormLayout";
import { useRegisterPetStore } from "../store/registerPet.store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        }
      }
    };
    fetchBreeds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [species_id, getBreedsBySpecies]);

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
              <span className="text-3xl">
                {sp.id === 1 ? "🐕" : sp.id === 2 ? "🐈" : "🐾"}
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
            <Select
              value={breed_id?.toString() || ""}
              onValueChange={(value) => handleSelectBreed(parseInt(value))}
              disabled={breeds.length === 0}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    breeds.length === 0
                      ? "Cargando razas..."
                      : "Selecciona una raza"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {breeds.map((breed) => (
                  <SelectItem key={breed.id} value={breed.id.toString()}>
                    {breed.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </PetFormLayout>
  );
}
