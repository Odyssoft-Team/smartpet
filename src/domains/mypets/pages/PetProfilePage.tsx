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
import { getOrderServices } from "@/domains/home/services/getOrderServices";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PetProfilePage() {
  const { selectedPet, setSelectedPet } = usePetStore();

  const navigate = useNavigate();

  //const [listSpecies, setListSpecies] = useState<Species[]>([]);
  const [listBreeds, setListBreeds] = useState<Breed[]>([]);
  const [listOrderServices, setListOrderServices] = useState<any[]>([]);

  /*   useEffect(() => {
      const fetchSpecies = async () => {
        const data = await getAllSpecies();
        if (data) {
          setListSpecies(data);
        }
      };
  
      fetchSpecies();
    }, []); */

  // Obtener orders del usuario y filtrar por pet_id. Evitamos bucles con bandera mounted
  useEffect(() => {
    if (!selectedPet) {
      setListOrderServices([]);
      return;
    }

    let mounted = true;
    const fetchOrders = async () => {
      try {
        const data = await getOrderServices();
        if (mounted && Array.isArray(data)) {
          const petOrders = data.filter(
            (o: any) => Number(o.pet_id) === Number(selectedPet.id)
          );
          setListOrderServices(petOrders);
        }
      } catch (error) {
        console.error("Error cargando ordenes de servicio:", error);
        toast.error("No se pudo cargar el historial de servicios");
      }
    };

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, [selectedPet?.id]);

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

  function getAge(birthDateString?: string | null) {
    if (!birthDateString) return "—";
    const birthDate = new Date(birthDateString);
    if (Number.isNaN(birthDate.getTime())) return "—";
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return `${age} ${age === 1 ? "año" : "años"}`;
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

      <div className="w-full max-w-md rounded-xl items-center">
        {/* Imagen centrada con círculo de peso */}
        <div className="flex justify-center mb-6">
          <div className="relative h-40 w-40">
            {/* Círculo de fondo con peso */}
            <div className="absolute inset-0 rounded-full border-4 border-cyan-200">
              {/* Peso en la parte superior del círculo */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                {selectedPet.weight ? `${selectedPet.weight} kg` : "— kg"}
              </div>
            </div>
            
            {/* Imagen de la mascota - más pequeña y posicionada abajo */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-36 h-36 rounded-2xl overflow-hidden">
              {selectedPet.photo_url ? (
                <img
                  src={selectedPet.photo_url}
                  alt={selectedPet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <MdOutlinePets className="size-8 text-gray-600" />
                </div>
              )}
            </div>
            
            {/* Botón de editar */}
            <Link
              to="/editmypets"
              className="absolute bottom-0 right-0 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
              onClick={() => setSelectedPet(selectedPet)}
            >
              <HiPencil className="size-4" />
            </Link>
          </div>
        </div>

        {/* Información de la mascota */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold">{selectedPet.name}</h1>
          <p className="text-gray-500 text-lg">{breed?.name || "—"}</p>
          
          <div className="text-sm text-gray-500">
            <span className="font-medium">Edad:</span> {getAge(selectedPet.birth_date)}
          </div>
          
          <div className="text-sm text-gray-500">
            <span className="font-medium">Fecha de nacimiento:</span>{" "}
            {selectedPet.birth_date
              ? new Date(selectedPet.birth_date).toLocaleDateString()
              : "—"}
          </div>

          {/* Barra de comportamiento social */}
          <div className="space-y-3 px-4">
            <span className="text-sm font-medium text-gray-700">Conducta social</span>
            <div className="relative">

              <div className="relative h-3 bg-gray-200 rounded-full">
                <div 
                  className="absolute h-full bg-cyan-500 rounded-full transition-all duration-300"
                  style={{ width: `${((selectedPet.social_behavior || 3) - 1) * 25}%` }}
                />
                <div 
                  className="absolute w-6 h-6 bg-cyan-600 rounded-full -top-1 transform -translate-x-1/2 transition-all duration-300"
                  style={{ left: `${((selectedPet.social_behavior || 3) - 1) * 25}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1 hidden">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span key={num} className={selectedPet.social_behavior === num ? "text-cyan-600 font-medium" : ""}>
                    {num}
                  </span>
                ))}
              </div>
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Tranquilo</span>
                <span>Enérgico</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="w-full space-y-4 mb-8 px-4">
          <Link to="/pet-medical-profile" className="w-full">
            <Button
              size="lg"
              variant="outline"
              className="w-full bg-transparent hover:bg-cyan-50 border-cyan-500 text-cyan-600 hover:text-cyan-700 rounded-xl py-3"
              onClick={() => setSelectedPet(selectedPet)}
            >
              <FaSyringe className="mr-2" />
              Ver Perfil Médico
            </Button>
          </Link>
          
          <Button
            variant="destructive"
            className="w-full rounded-xl py-3"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2" />
            Borrar mascota
          </Button>
          
          <Link to="/register-pet/step1" className="w-full">
            <Button
              size="lg"
              variant="outline"
              className="w-full bg-transparent hover:bg-green-50 border-green-500 text-green-600 hover:text-green-700 rounded-xl py-3"
            >
              <Plus className="mr-2" />
              Registrar nueva mascota
            </Button>
          </Link>
        </div>

        <Separator />

        {/* Historial de Servicios de esta mascota */}
        <div className="w-full flex flex-col gap-2 mt-4">
          <h2 className="font-bold flex items-center gap-3 text-base">Historial de servicios</h2>

          <div className="flex flex-col gap-3">
            {listOrderServices.length > 0 ? (
              listOrderServices.slice(0, 5).map((item) => (
                <Card className="p-0 rounded-md overflow-hidden shadow border-none bg-[#F5F5F5]" key={item.id}>
                  <CardContent className="flex items-center justify-between pl-2 pr-4 w-full py-3">
                    <div className="flex items-center gap-3">
                      <figure className="relative flex">
                        <img
                          className="size-15 rounded-full overflow-hidden object-cover"
                          src={selectedPet.photo_url || undefined}
                          alt={selectedPet.name}
                        />
                      </figure>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{item.status || "—"}</span>
                        <span className="text-xs text-muted-foreground">{item.scheduled_date}</span>
                      </div>
                    </div>

                    <Link to={`/activities/${item.id}`} className="bg-primary text-white px-3 rounded-md py-1">Ver</Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <div className="w-full h-[5rem] text-[#0085D8] text-[15px] font-medium flex justify-center items-center p-0 rounded-md overflow-hidden shadow border-none bg-[#F5F5F5]">
                  No hay historial de servicios para esta mascota
                </div>
                <span className="text-sm text-neutral-400 -mt-1 font-light">Aquí podrá visualizar el status de los servicios asociados a esta mascota</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
