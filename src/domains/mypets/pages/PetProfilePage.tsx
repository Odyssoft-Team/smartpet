import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { usePetStore } from "@/store/pets.store";
import { MdOutlinePets } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import { deletePet } from "../services/deletePet";
//import { getAllSpecies, type Species } from "../services/getAllSpecies";
import { getAllBreeds, type Breed } from "../services/getAllBreeds";
import { Plus, Trash2 } from "lucide-react";
import { FaSyringe } from "react-icons/fa";
import { FaWorm } from "react-icons/fa6";
export default function PetProfilePage() {
  const { selectedPet, setSelectedPet } = usePetStore();

  const navigate = useNavigate();

  //const [listSpecies, setListSpecies] = useState<Species[]>([]);
  const [listBreeds, setListBreeds] = useState<Breed[]>([]);

/*   useEffect(() => {
    const fetchSpecies = async () => {
      const data = await getAllSpecies();
      if (data) {
        setListSpecies(data);
      }
    };

    fetchSpecies();
  }, []); */

  useEffect(() => {
    const fetchBreeds = async () => {
      const data = await getAllBreeds();
      if (data) {
        setListBreeds(data);
      }
    };

    fetchBreeds();
  }, []);

  //const specie = listSpecies.find((s) => s.id === selectedPet?.species_id);
  const breed = listBreeds.find((b) => b.id === selectedPet?.breed_id);

  const handleDelete = async () => {
    if (
      !selectedPet ||
      !window.confirm("¿Estás seguro de eliminar esta mascota?")
    ) {
      return;
    }

    const success = await deletePet(selectedPet.id);
    if (success) {
      toast.success("Mascota eliminada con éxito");
      navigate("/mypets");
    }
  };

  useEffect(() => {
    if (!selectedPet) {
      navigate("/mypets");
    }
  }, [selectedPet, navigate]);

  if (!selectedPet) return null;

/*   function getAge(birthDateString: string): number {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  } */

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

      <div className="w-full max-w-md rounded-xl p-4 items-center">
        <div className="items-center mb-6 flex gap-4">
          <div className="relative h-40 mb-4 w-2/5">
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
          <div className="text-left space-y-0 w-3/5">
            <div className="flex items-center  gap-2">
              <h1 className="text-2xl font-bold">{selectedPet.name}</h1>
            </div>
            <p className="text-gray-500">{breed?.name || "—"}</p>
            {/* <p className="text-gray-500 text-sm capitalize">
              Especie: {specie?.name || "—"}
            </p> */}
            {/* <p className="text-gray-500 text-sm">
              Fecha de nacimiento:{" "}
              {selectedPet.birth_date
                ? new Date(selectedPet.birth_date).toLocaleDateString()
                : "—"}
            </p> */}
            <div className="border-t border-gray-200 my-4" />
            <h3 className="mt-4">Alergias</h3>
            <p className="text-gray-500 text-sm">
              Alergias: {selectedPet.allergies || "Sin alergias"}
            </p>
            <p className="text-gray-500 text-sm">
              Condición especial: {selectedPet.special_condition || "—"}
            </p>
            {/* <p className="text-gray-500 text-sm">
              Comportamiento social: {selectedPet.social_behavior || "—"}
            </p> */}
          </div>
        </div>


        <div className="w-full space-y-6">


          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-3 gap-3">
              <Link to={`/pets/${selectedPet.id}/vaccines`} className="">
                <Button variant="outline" className="w-full flex flex-col items-center justify-center h-28 py-2">
                  <FaSyringe style={{ width: 56, height: 56, fontSize: 56 }} aria-hidden />
                  <span className="mt-2">Vacunas</span>
                </Button>
              </Link>
              <Link to={`/pets/${selectedPet.id}/deworming`}>
                <Button variant="outline" className="w-full flex flex-col items-center justify-center h-28 py-2">
                  <FaWorm style={{ width: 56, height: 56, fontSize: 56 }} aria-hidden />
                  <span className="mt-2">Revisiones</span>
                </Button>
              </Link>
              <Link to={`/pets/${selectedPet.id}/deworming`}>
                <Button variant="outline" className="w-full flex flex-col items-center justify-center h-28 py-2">
                  <FaWorm style={{ width: 56, height: 56, fontSize: 56 }} aria-hidden />
                  <span className="mt-2">Desparasitación</span>
                </Button>
              </Link>
            </div>

            <p>Información Médica</p>

            <Link to="/register-pet/step1" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="w-full bg-transparent hover:bg-transparent border-green-600 text-green-600 hover:text-green-600"
              >
                <Plus />
                Registrar nueva mascota
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleDelete}
            >
              <Trash2 />
              Eliminar mascota
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
