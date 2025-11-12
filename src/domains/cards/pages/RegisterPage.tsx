import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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
import { IoIosArrowBack } from "react-icons/io";
import { useCards } from "../services/cardService";
import { toast } from "sonner";

type CardFormValues = {
  label: string;
  card_holder_name: string;
  card_number: string;
  expiry_month: string;
  expiry_year: string;
  is_default: boolean;
};

const EXPIRY_MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: (i + 1).toString().padStart(2, "0"),
  label: (i + 1).toString().padStart(2, "0"),
}));
const EXPIRY_YEARS = Array.from({ length: 27 }, (_, i) => ({
  value: (2024 + i).toString(),
  label: (2024 + i).toString(),
}));

export default function RegisterPage() {
  const { addCard } = useCards();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CardFormValues>({
    defaultValues: {
      label: "",
      card_holder_name: "",
      card_number: "",
      expiry_month: "",
      expiry_year: "",
      is_default: false,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: CardFormValues) => {
    try {
      setIsLoading(true);

      // Validar número de tarjeta
      const cardNumber = data.card_number.replace(/\s/g, "");
      if (!/^\d{13,19}$/.test(cardNumber)) {
        toast.error("Número de tarjeta inválido");
        return;
      }

      // Detectar marca
      let brand = "visa";
      if (cardNumber.startsWith("5")) brand = "mastercard";
      if (cardNumber.startsWith("3")) brand = "amex";

      const result = await addCard({
        label: data.label,
        card_holder_name: data.card_holder_name,
        card_number: cardNumber,
        expiry_month: parseInt(data.expiry_month),
        expiry_year: parseInt(data.expiry_year),
        brand: brand as "visa" | "mastercard" | "amex",
        is_default: data.is_default,
      });

      if (result) {
        toast.success("Tarjeta registrada correctamente ✅");
        navigate("/cards");
      }
    } catch (error) {
      console.error("Error registrando tarjeta:", error);
      toast.error("No se pudo registrar la tarjeta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/cards">
            <Button
              size="back"
              variant="back"
              className="w-auto h-auto py-2 text-icon hover:text-icon"
            >
              <IoIosArrowBack className="size-8" />
              <span>Nueva tarjeta</span>
            </Button>
          </Link>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Etiqueta */}
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <Label>Etiqueta (ej: Principal, Respaldo) *</Label>
                  <FormControl>
                    <Input
                      placeholder="Ej: Mi tarjeta principal"
                      {...field}
                      maxLength={50}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Titular */}
            <FormField
              control={form.control}
              name="card_holder_name"
              render={({ field }) => (
                <FormItem>
                  <Label>Titular de la tarjeta *</Label>
                  <FormControl>
                    <Input
                      placeholder="Ej: Juan Pérez"
                      {...field}
                      maxLength={50}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Número de tarjeta */}
            <FormField
              control={form.control}
              name="card_number"
              render={({ field }) => (
                <FormItem>
                  <Label>Número de tarjeta *</Label>
                  <FormControl>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      {...field}
                      maxLength={19}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, "");
                        if (/^\d*$/.test(value)) {
                          const formatted =
                            value.match(/.{1,4}/g)?.join(" ") || value;
                          field.onChange(formatted);
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Expiración */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiry_month"
                render={({ field }) => (
                  <FormItem>
                    <Label>Mes *</Label>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPIRY_MONTHS.map((month) => (
                            <SelectItem key={month.value} value={month.value}>
                              {month.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiry_year"
                render={({ field }) => (
                  <FormItem>
                    <Label>Año *</Label>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="YYYY" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPIRY_YEARS.map((year) => (
                            <SelectItem key={year.value} value={year.value}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Predeterminada */}
            <FormField
              control={form.control}
              name="is_default"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4"
                    />
                    <Label className="mb-0">
                      Establecer como tarjeta predeterminada
                    </Label>
                  </div>
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Link to="/cards" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Guardando..." : "Agregar tarjeta"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
