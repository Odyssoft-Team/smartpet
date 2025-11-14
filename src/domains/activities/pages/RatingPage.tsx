import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaStar } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDetailStore } from "@/store/detail";
import { toast } from "sonner";

export default function RatingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { selectedPet } = useDetailStore();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    setIsSubmitting(true);
    
    // Simular envío de calificación
    setTimeout(() => {
      toast.success("¡Gracias por tu calificación!");
      navigate("/");
    }, 1500);
  };

  if (!orderId) {
    navigate("/");
    return null;
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "Muy malo";
      case 2: return "Malo";
      case 3: return "Regular";
      case 4: return "Bueno";
      case 5: return "Excelente";
      default: return "";
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="w-full flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <FaChevronLeft 
            onClick={() => navigate(`/video/${orderId}`)} 
            className="cursor-pointer text-lg"
          />
          <h1 className="text-xl font-bold">Calificar Servicio</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 space-y-6">
          
          {/* Pet info */}
          <div className="text-center space-y-3">
            <Avatar className="size-20 mx-auto">
              <AvatarImage
                src={selectedPet?.photo_url || ""}
                alt={selectedPet?.name || "Mascota"}
              />
              <AvatarFallback className="text-2xl">
                {selectedPet?.name?.charAt(0).toUpperCase() || "M"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{selectedPet?.name || "Mascota"}</h2>
              <p className="text-gray-500">Servicio completado</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating stars */}
            <div className="text-center space-y-3">
              <h3 className="text-lg font-medium">¿Cómo calificarías el servicio?</h3>
              
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <FaStar
                      className={`text-3xl ${
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {(hoveredRating || rating) > 0 && (
                <p className="text-sm font-medium text-blue-600">
                  {getRatingText(hoveredRating || rating)}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Comentarios (opcional)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Cuéntanos sobre tu experiencia..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Submit button */}
            <div className="space-y-3">
              <Button 
                type="submit"
                className="w-full"
                disabled={rating === 0 || isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Calificación"}
              </Button>
              
              <Button 
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => navigate("/")}
              >
                Omitir calificación
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}