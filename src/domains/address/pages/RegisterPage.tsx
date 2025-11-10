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
import { useAddresses } from "../services/addressService";
import { DISTRICTS } from "../utils/districts";
import { toast } from "sonner";

type AddressFormValues = {
  alias: string;
  address: string;
  reference?: string;
  district_id: string;
  is_default: boolean;
};

export default function RegisterPage() {
  const { addAddress } = useAddresses();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddressFormValues>({
    defaultValues: {
      alias: "",
      address: "",
      reference: "",
      district_id: "",
      is_default: false,
    },
  });

  const { handleSubmit } = form;

  const onSubmit = async (data: AddressFormValues) => {
    try {
      setIsLoading(true);

      const result = await addAddress({
        alias: data.alias,
        address: data.address,
        reference: data.reference,
        district_id: parseInt(data.district_id),
        is_default: data.is_default,
      });

      if (result) {
        toast.success("Dirección registrada correctamente ✅");
        navigate("/address");
      }
    } catch (error) {
      console.error("Error registrando dirección:", error);
      toast.error("No se pudo registrar la dirección");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/address">
            <Button
              size="back"
              variant="back"
              className="w-auto h-auto py-2 text-icon hover:text-icon"
            >
              <IoIosArrowBack className="size-8" />
              <span>Nueva dirección</span>
            </Button>
          </Link>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Alias */}
            <FormField
              control={form.control}
              name="alias"
              render={({ field }) => (
                <FormItem>
                  <Label>Alias (etiqueta) *</Label>
                  <FormControl>
                    <Input
                      placeholder="Ej: Casa, Oficina, Departamento"
                      {...field}
                      maxLength={50}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Dirección */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <Label>Dirección *</Label>
                  <FormControl>
                    <Input
                      placeholder="Ej: Av. Principal 123, Piso 4"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Referencia */}
            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <Label>Referencia</Label>
                  <FormControl>
                    <Input
                      placeholder="Ej: Cerca a la farmacia"
                      {...field}
                      maxLength={100}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Distrito */}
            <FormField
              control={form.control}
              name="district_id"
              render={({ field }) => (
                <FormItem>
                  <Label>Distrito *</Label>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        {DISTRICTS.map((district) => (
                          <SelectItem
                            key={district.id}
                            value={district.id.toString()}
                          >
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Es predeterminada */}
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
                    <Label className="mb-0">Establecer como dirección predeterminada</Label>
                  </div>
                </FormItem>
              )}
            />

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Link to="/address" className="flex-1">
                <Button type="button" variant="outline" className="w-full">
                  Cancelar
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Guardando..." : "Guardar dirección"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
