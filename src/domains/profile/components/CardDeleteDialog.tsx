import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
  selectedCard: {
    id: string;
    label: string;
  };
  onClose: () => void;
  onDelete: (cardId: string) => Promise<void>;
};

const CardDeleteDialog = ({ selectedCard, onClose, onDelete }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;

    setLoading(true);
    try {
      await onDelete(selectedCard.id);
      onClose();
    } catch (err) {
      console.error("Error al eliminar la tarjeta:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl max-w-md mx-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        ¿Eliminar tarjeta?
      </h3>
      <p className="text-sm text-gray-600 mb-6">
        ¿Estás seguro de que deseas eliminar la tarjeta{" "}
        <strong>{selectedCard.label}</strong>? Esta acción no se puede deshacer.
      </p>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={onClose}
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Eliminando...
            </>
          ) : (
            "Eliminar"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CardDeleteDialog;
