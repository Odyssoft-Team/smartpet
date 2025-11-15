import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePetStore } from "@/store/pets.store";
import { useRevisions, type Revision } from "../services/revisionsService";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FaPlus } from "react-icons/fa";

export default function RevisionsListPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { selectedPet } = usePetStore();
  const { getRevisionsByPet, loading } = useRevisions();
  const [revisions, setRevisions] = useState<Revision[]>([]);

  useEffect(() => {
    if (!selectedPet || !petId) {
      navigate("/mypets");
      return;
    }
    const fetchRevisions = async () => {
      const data = await getRevisionsByPet(petId);
      if (data) {
        setRevisions(data);
      }
    };

    fetchRevisions();
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
            <span className="-ml-2">Revisiones de {selectedPet.name}</span>
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md p-4">
        {loading ? (
          <div>Cargando...</div>
        ) : revisions.length > 0 ? (
          <div className="space-y-4">
            {revisions.map((revision) => (
              <div
                key={revision.id}
                className="p-4 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="w-full">
                    <p className="font-semibold text-base">
                      {revision.revision_type?.name || "Revisión"}
                    </p>
                    <p className="font-medium">
                      Fecha: {format(new Date(revision.created_at), "PPP", {
                        locale: es,
                      })}
                    </p>
                    {revision.clinic && (
                      <p className="text-sm text-gray-500">
                        Clínica: {revision.clinic.name}
                      </p>
                    )}
                    {revision.revision_status && (
                      <p className="text-sm text-blue-600 font-medium">
                        Estado: {revision.revision_status.name}
                      </p>
                    )}
                    {revision.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {revision.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No hay revisiones registradas
          </div>
        )}

        <Link
          to={`/pets/${petId}/revisions/new`}
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