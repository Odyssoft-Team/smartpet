import { Button } from "@/components/ui/button";
// import fidel_pet from "@/assets/pets/fidel-dog.png";
// import trufa_cat from "@/assets/pets/trufa-cat.png";
// import olivia_dog from "@/assets/pets/olivia-dog.png";
import { TbDog } from "react-icons/tb";

import { Cat } from "lucide-react";
import { Link } from "react-router-dom";
import { usePets } from "../services/servicesPet";
import { useCallback, useEffect } from "react";
import { usePetStore } from "@/store/pets.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MdOutlinePets } from "react-icons/md";
import { RiEditFill } from "react-icons/ri";


export default function AddressPage() {
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

  const { listPets, setListPets, setSelectedPet } = usePetStore();
  const { getPets } = usePets();

  const fetchPets = useCallback(async () => {
    if (listPets.length > 0) {
      console.log("✅ Ya hay datos en el store, omitiendo fetch");
      return;
    }

    try {
      const data = await getPets();
      if (data && Array.isArray(data)) {
        setListPets(data);
      } else {
        toast.error("No se pudieron cargar las mascotas");
      }
    } catch (error) {
      console.error("Error obteniendo las mascotas:", error);
      toast.error("No se pudieron cargar las mascotas");
    }
  }, [getPets, listPets.length, setListPets]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  return (
    <div className="h-full">
      {/* <Button
        size="back"
        variant={"back"}
        className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
      >
        Mis mascotas
      </Button> */}
      <div className="items-center justify-center pt-6 w-full flex">
        <h2 className="text-xl font-semibold">Mis direcciones</h2>
      </div>
      <hr className="mt-6 bg-gray-600" />
      <div className="mt-6 w-full max-w-md mx-auto">
        {/* Botón: Agregar dirección */}
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
          <Link to={"/registermypets"}>
          <div className="flex gap-1 items-center py-2 rounded-lg justify-center cursor-pointer">
            <div className="flex items-center bg-green-600 rounded-full px-5">
              {/* <div className="w-12 h-12 flex items-center justify-center rounded-full object-cover mx-auto bg-gray-200">
                <PiPlusBold className="size-7 text-gray-400" strokeWidth={10} />
              </div> */}
              <div className="p-4 text-white">Agregar dirección</div>
            </div>
          </div>
        </Link>
        </div>
        
        {listPets.map((pet, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-4 items-center py-2",
              index < listPets.length - 1 && "border-b border-gray-200"
            )}
          >
            {pet.photo_url ? (
              <img
                src={pet.photo_url}
                alt="Mascota 1"
                className="w-12 h-12 rounded-full object-cover mx-auto"
              />
            ) : (
              <div className="min-w-12 min-h-12 flex items-center justify-center rounded-full object-cover mx-auto bg-gray-200">
                <MdOutlinePets className="size-7 text-gray-600" />
              </div>
            )}
            <div className="flex flex-col items-start w-full">
              <div className="flex gap-x-1 items-center">
                <span className="text-base text-black">{pet.name}</span>
                {pet.species === "Perro" ? <TbDog /> : <Cat />}
              </div>
              <span className="text-xs text-gray-500">
                Edad: {pet.birth_date ? `${getAge(pet.birth_date)} años` : "—"}
              </span>
            </div>

            <Link to="/editmypets" onClick={() => setSelectedPet(pet)}>
              <Button size="sm" variant="primary" className="px-6 font-light">
                <RiEditFill />
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
