import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePetStore } from "@/store/pets.store";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FaPlus } from "react-icons/fa";
import {
  getVaccinesByPet,
  type VaccineByPet,
} from "../services/getVaccinesByPet";

export default function VaccineListPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { selectedPet } = usePetStore();
  const [vaccines, setVaccines] = useState<VaccineByPet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedPet || !petId) {
      navigate("/mypets");
      return;
    }
    const fetchVaccinesByPet = async () => {
      setLoading(true);
      const data = await getVaccinesByPet(petId);
      if (data) {
        setVaccines(data);
      }
      setLoading(false);
    };

    fetchVaccinesByPet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  if (!selectedPet) return null;

  return (
    <div className="flex flex-col items-center justify-start pt-4 bg-white min-h-screen">
      <div className="w-full flex justify-start mb-4">
        <Link to={`/pet-profile`}>
          <Button
            size="back"
            variant="back"
            className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
          >
            <IoIosArrowBack className="size-8" />
            <span className="-ml-2">Vacunas de {selectedPet.name}</span>
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md p-4">
        {loading ? (
          <div>Cargando...</div>
        ) : vaccines.length > 0 ? (
          <div className="space-y-4">
            {vaccines.map((vaccine) => (
              <div
                key={vaccine.id}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      Aplicada:{" "}
                      {format(new Date(vaccine.applied_at), "PPP", {
                        locale: es,
                      })}
                    </p>
                    {vaccine.next_dose_at && (
                      <p className="text-sm text-gray-500">
                        Próxima dosis:{" "}
                        {format(new Date(vaccine.next_dose_at), "PPP", {
                          locale: es,
                        })}
                      </p>
                    )}
                    {vaccine.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        {vaccine.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No hay vacunas registradas
          </div>
        )}

        <Link
          to={`/pets/${petId}/vaccines/new`}
          className="fixed bottom-20 right-6"
        >
          <Button size="icon" className="rounded-full h-14 w-14">
            <FaPlus className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
