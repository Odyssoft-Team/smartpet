import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { usePetStore } from "@/store/pets.store";
import { toast } from "sonner";
import type { Pet } from "../services/getPetsByUser";
import { updatePet } from "../services/updatePet";
import { getAllBreeds, type Breed } from "../services/getAllBreeds";

type EditPetFormValues = {
  name: string;
  weight: string;
  breed: string;
  breed_id: number;
  birth_date?: string;
  allergies?: string;
  special_condition?: string;
  social_behavior?: number;
};

export default function EditPage() {
  const { selectedPet } = usePetStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [listBreeds, setListBreeds] = useState<Breed[]>([]);

  const form = useForm<EditPetFormValues>({
    defaultValues: {
      name: "",
      weight: "",
      breed: "",
      birth_date: "",
      allergies: "",
      special_condition: "",
      social_behavior: undefined,
    },
  });

  const { handleSubmit, setValue } = form;

  useEffect(() => {
    const fetchBreeds = async () => {
      const data = await getAllBreeds();
      if (data) {
        setListBreeds(data);
      }
    };

    fetchBreeds();
  }, []);

  const breed = listBreeds.find((b) => b.id === selectedPet?.breed_id);

  useEffect(() => {
    if (selectedPet) {
      setValue("name", selectedPet.name);
      setValue("weight", selectedPet.weight?.toString() || "");
      setValue("breed", breed?.name || "");
      setValue("birth_date", selectedPet.birth_date || "");
      setValue("allergies", selectedPet.allergies || "");
      setValue("special_condition", selectedPet.special_condition || "");
      setValue("social_behavior", selectedPet.social_behavior || undefined);
    } else {
      navigate("/mypets");
    }
  }, [selectedPet, setValue, navigate, breed?.name]);

  const onSubmit = async (data: EditPetFormValues) => {
    if (!selectedPet) {
      toast.error("No hay mascota seleccionada");
      return;
    }

    try {
      setIsLoading(true);

      const payload: Partial<Pet> = {
        name: data.name,
        weight: data.weight ? parseFloat(data.weight) : null,
        // breed: data.breed || undefined,
        breed_id: data.breed_id,
        birth_date: data.birth_date || null,
        allergies: data.allergies || null,
        special_condition: data.special_condition || null,
        social_behavior: data.social_behavior || null,
      };

      const updated = await updatePet(selectedPet.id, payload);
      if (updated) {
        toast.success("Mascota actualizada correctamente ✅");
        navigate("/mypets");
      }
    } catch (error) {
      console.error("Error actualizando mascota:", error);
      toast.error("No se pudo actualizar la mascota");
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPet) return null;

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="bg-cyan-500 fixed top-0 left-0 right-0 px-4 py-3 z-50 justify-between flex items-center">
        <Link to="/pet-profile">
          <Button
            size="back"
            variant="back"
            className="w-auto h-auto text-icon hover:text-icon cursor-pointer gap-3"
          >
            <IoIosArrowBack className="size-6 text-white" />
            <span className="-ml-2 text-white">Editar mascota</span>
          </Button>
        </Link>
      </div>
      <div className="w-full max-w-md mx-auto mt-18">
        {/* Form */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nombre */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <Label>Nombre *</Label>
                  <FormControl>
                    <Input placeholder="Nombre de la mascota" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Peso */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <Label>Peso (kg)</Label>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Ej: 5.5"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Raza */}
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <Label>Raza</Label>
                  <FormControl>
                    <Input placeholder="Ej: Golden Retriever" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Fecha de nacimiento */}
            <FormField
              control={form.control}
              name="birth_date"
              render={({ field }) => (
                <FormItem>
                  <Label>Fecha de nacimiento</Label>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Alergias */}
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <Label>Alergias</Label>
                  <FormControl>
                    <Input placeholder="Ej: Pollo, Maíz" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Condición especial */}
            <FormField
              control={form.control}
              name="special_condition"
              render={({ field }) => (
                <FormItem>
                  <Label>Condición especial</Label>
                  <FormControl>
                    <Input placeholder="Ej: Diabetes" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Comportamiento social */}
            <FormField
              control={form.control}
              name="social_behavior"
              render={({ field }) => (
                <FormItem>
                  <Label>Comportamiento social (1-5)</Label>
                  <FormControl>
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(val) => field.onChange(parseInt(val))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Muy reservado</SelectItem>
                        <SelectItem value="2">2 - Reservado</SelectItem>
                        <SelectItem value="3">3 - Neutral</SelectItem>
                        <SelectItem value="4">4 - Social</SelectItem>
                        <SelectItem value="5">5 - Muy social</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Link to="/pet-profile" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
