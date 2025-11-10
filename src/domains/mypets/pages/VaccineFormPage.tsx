import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePetStore } from "@/store/pets.store";
import { useVaccines } from "../services/vaccineService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function VaccineFormPage() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { selectedPet } = usePetStore();
  const { addVaccine, loading } = useVaccines();

  const [appliedAt, setAppliedAt] = useState("");
  const [nextDoseAt, setNextDoseAt] = useState("");
  const [notes, setNotes] = useState("");

  if (!selectedPet || !petId) {
    navigate("/mypets");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appliedAt) {
      alert("Por favor ingresa la fecha de aplicación");
      return;
    }

    const vaccine = {
      pet_id: petId,
      applied_at: appliedAt,
      next_dose_at: nextDoseAt || undefined,
      notes: notes || undefined,
    };

    const result = await addVaccine(vaccine);
    if (result) {
      navigate(`/pets/${petId}/vaccines`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-4 bg-white min-h-screen">
      <div className="w-full flex justify-start mb-4">
        <Link to={`/pets/${petId}/vaccines`}>
          <Button
            size="back"
            variant="back"
            className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
          >
            <IoIosArrowBack className="size-8" />
            <span className="-ml-2">Nueva Vacuna</span>
          </Button>
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-md p-4 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Fecha de aplicación*</label>
          <Input
            type="date"
            value={appliedAt}
            onChange={(e) => setAppliedAt(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Próxima dosis</label>
          <Input
            type="date"
            value={nextDoseAt}
            onChange={(e) => setNextDoseAt(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Notas</label>
          <Textarea
            value={notes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
            placeholder="Observaciones o detalles adicionales"
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !appliedAt}
        >
          {loading ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </div>
  );
}