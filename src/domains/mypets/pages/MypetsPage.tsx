import { Button } from "@/components/ui/button";
import { PiPlusBold } from "react-icons/pi";
import { Eye, Pencil } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { usePetStore } from "@/store/pets.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MdOutlinePets } from "react-icons/md";
import { getPetsByUser, type Pet } from "../services/getPetsByUser";
import { getAllSpecies, type Species } from "../services/getAllSpecies";
import { getAllBreeds, type Breed } from "../services/getAllBreeds";
import { Skeleton } from "@/components/ui/skeleton";

export default function MypetsPage() {
  const navigate = useNavigate();

  const [listPets, setListPets] = useState<Pet[]>([]);
  const [listSpecies, setListSpecies] = useState<Species[]>([]);
  const [listBreeds, setListBreeds] = useState<Breed[]>([]);
  const [loadingPets, setLoadingPets] = useState(false);

  useEffect(() => {
    const fetchSpecies = async () => {
      const data = await getAllSpecies();
      if (data) {
        setListSpecies(data);
      }
    };

    fetchSpecies();
  }, []);

  useEffect(() => {
    const fetchBreeds = async () => {
      const data = await getAllBreeds();
      if (data) {
        setListBreeds(data);
      }
    };

    fetchBreeds();
  }, []);

  function getAge(birthDateString: string): number {
    const birthDate = new Date(birthDateString);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    // Si aún no cumplió años este año, restamos 1
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  }

  const { setSelectedPet } = usePetStore();

  const fetchPets = useCallback(async () => {
    setLoadingPets(true);
    try {
      const data = await getPetsByUser();

      if (data && Array.isArray(data)) {
        setListPets(data);
      }
    } catch (error) {
      console.error("Error obteniendo las mascotas:", error);
      toast.error("No se pudieron cargar las mascotas");
    }
    setLoadingPets(false);
  }, [setListPets]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  useEffect(() => {
    if (listPets.length === 1) {
      setSelectedPet(listPets[0]);
      navigate("/pet-profile");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPets]);

  return (
    <div className="h-full">
      <div className="w-full flex items-center justify-between">
        <Button
          size="back"
          variant={"back"}
          className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
        >
          Mis mascotas
        </Button>

        <Link to="/register-pet/step1">
          <div className="flex gap-1 items-center py-2 rounded-lg border border-green-600 p-2">
            <div className="flex items-center gap-2">
              <PiPlusBold className="size-4 text-green-600" strokeWidth={10} />
              <div className="text-green-600 font-medium text-sm">
                Nueva Mascota
              </div>
            </div>
          </div>
        </Link>
      </div>
      <div className="mt-6 w-full max-w-md mx-auto">
        <div className="w-full flex flex-col gap-3">
          {loadingPets
            ? Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-4 items-center py-2 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-4"
                >
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="flex flex-col items-start w-full gap-1">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-16 h-3" />
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="w-20 h-3" />
                  </div>
                  <div className="flex flex-col gap-2 w-32">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              ))
            : listPets.map((pet, index) => {
                const specie = listSpecies.find((s) => s.id === pet.species_id);
                const breed = listBreeds.find((b) => b.id === pet.breed_id);
                return (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-4 items-center py-2 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] px-4"
                    )}
                  >
                    {pet.photo_url ? (
                      <img
                        src={pet.photo_url}
                        alt="Mascota 1"
                        className="w-16 h-16 rounded-full object-cover mx-auto"
                      />
                    ) : (
                      <div className="min-w-16 min-h-16 flex items-center justify-center rounded-full object-cover mx-auto bg-gray-200">
                        <MdOutlinePets className="size-8 text-gray-600" />
                      </div>
                    )}
                    <div className="flex flex-col items-start w-full">
                      <div className="flex gap-x-1 items-center">
                        <span className="text-base text-black capitalize">
                          {pet.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        Edad:{" "}
                        <span className="font-medium">
                          {pet.birth_date
                            ? `${getAge(pet.birth_date)} años`
                            : "—"}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        Especie:
                        <span className="font-medium">
                          {specie?.name || "—"}
                        </span>
                      </span>
                      <span className="text-xs text-gray-500">
                        Raza:{" "}
                        <span className="font-medium">
                          {breed?.name || "—"}
                        </span>
                      </span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Link
                        to="/pet-profile"
                        onClick={() => setSelectedPet(pet)}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-6 font-light text-xs bg-[#0085D8] hover:bg-[#0085D8] hover:text-white text-white w-full"
                        >
                          <Eye /> Ver perfil
                        </Button>
                      </Link>
                      <Link
                        to="/editmypets"
                        onClick={() => setSelectedPet(pet)}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="px-6 font-light text-xs w-full"
                        >
                          <Pencil /> Editar
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}
