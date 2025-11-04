import { z } from "zod";

export const usePetSchema = () => {
  const baseSchema = z.object({
    photo_url: z.string().optional(),
    name: z
      .string()
      .min(1, "El nombre es obligatorio")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .regex(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, "Solo se permiten letras"),

    weight: z
      .string()
      .min(1, "El peso es obligatorio")
      .refine((val) => {
        const weight = parseFloat(val);
        return !isNaN(weight) && weight > 0 && weight < 100;
      }, "Ingrese un peso válido (0-100 kg)"),

    species: z
      .enum(["Perro", "Gato", "Otro"])
      .refine((val) => !!val, { message: "Por favor seleccione una especie" }),

    breed: z
      .string()
      .min(1, "La raza es obligatoria")
      .min(2, "La raza debe tener al menos 2 caracteres")
      .regex(/^[A-Za-zÁáÉéÍíÓóÚúÑñ\s]+$/, "Solo se permiten letras"),

    birth_date: z.date().optional(),
  });

  return baseSchema;
};

export type PetFormData = z.infer<ReturnType<typeof usePetSchema>>;
