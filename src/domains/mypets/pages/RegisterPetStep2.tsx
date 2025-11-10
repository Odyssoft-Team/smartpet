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
import { getAllSpecies } from "../services/getAllSpecies";
import { getBreedsBySpecies } from "../services/getBreedsBySpecies";

interface Species {
  id: number;
  name: string;
}

interface Breed {
  id: number;
  name: string;
  species_id: number;
}

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
      if (selectedSpecies) {
        const data = await getBreedsBySpecies(selectedSpecies.id);
        if (data) {
          setBreeds(data);
        }
      }
    };
    fetchBreeds();
  }, [selectedSpecies]);

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
  };

  const handleSelectBreed = (breedId: number) => {
    setField("breed_id", breedId);
  };

  return (
    <PetFormLayout
      currentStep={2}
      totalSteps={5}
      onNext={handleNext}
      onBack={handleBack}
      nextDisabled={!species_id || !breed_id}
    >
      <div className="w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">¿Qué tipo de mascota tienes?</h1>
          <p className="text-gray-500">Selecciona la especie de tu mascota</p>
        </div>

        <div className="flex justify-center gap-x-8">
          {species.map((sp) => (
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
              </span>
              <span className="font-medium">{sp.name}</span>
            </button>
          ))}
        </div>

        {selectedSpecies && breeds.length > 0 && (
          <div className="space-y-2">
            <p className="text-center font-medium">Selecciona la raza</p>
            <Select
              value={breed_id?.toString() || ""}
              onValueChange={(value) => handleSelectBreed(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una raza" />
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
