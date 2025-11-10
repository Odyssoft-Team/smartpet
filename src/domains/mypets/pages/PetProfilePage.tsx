import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { usePetStore } from "@/store/pets.store";
import { TbDog } from "react-icons/tb";
import { Cat } from "lucide-react";
import { MdOutlinePets } from "react-icons/md";
import { HiPencil } from "react-icons/hi";

export default function PetProfilePage() {
  const { selectedPet, setSelectedPet } = usePetStore();
  const navigate = useNavigate();

  if (!selectedPet) {
    navigate("/mypets");
    return null;
  }

  function getAge(birthDateString: string): number {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  return (
    <div className="flex flex-col items-center justify-start pt-4 bg-white min-h-screen">
      <div className="w-full flex justify-start mb-4">
        <Link to="/mypets">
          <Button
            size="back"
            variant="back"
            className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
          >
            <IoIosArrowBack className="size-8" />
            <span className="-ml-2">Perfil</span>
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md rounded-xl p-4 flex flex-col items-center">
        <div className="relative w-40 h-40 mb-4">
          {selectedPet.photo_url ? (
            <img
              src={selectedPet.photo_url}
              alt={selectedPet.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center rounded-full bg-gray-200">
              <MdOutlinePets className="size-16 text-gray-600" />
            </div>
          )}
          <Link 
            to="/editmypets" 
            className="absolute bottom-2 right-2 p-2 rounded-full bg-white shadow-md"
            onClick={() => setSelectedPet(selectedPet)}
          >
            <HiPencil className="size-5" />
          </Link>
        </div>

        <div className="w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold">{selectedPet.name}</h1>
              {selectedPet.species === "Perro" ? 
                <TbDog className="size-6" /> : 
                <Cat className="size-6" />
              }
            </div>
            <p className="text-gray-500">{selectedPet.breed}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-sm text-gray-500">Edad</p>
              <p className="text-lg font-semibold">
                {selectedPet.birth_date ? `${getAge(selectedPet.birth_date)} años` : "—"}
              </p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg text-center">
              <p className="text-sm text-gray-500">Peso</p>
              <p className="text-lg font-semibold">{selectedPet.weight} kg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}