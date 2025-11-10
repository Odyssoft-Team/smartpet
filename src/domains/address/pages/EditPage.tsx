import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
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

interface Address {
  id: string;
  alias: string;
  address: string;
  reference?: string;
  district_id: number;
  is_default: boolean;
}

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const { updateAddress, addresses } = useAddresses();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState<Address | null>(null);

  const form = useForm<AddressFormValues>({
    defaultValues: {
      alias: "",
      address: "",
      reference: "",
      district_id: "",
      is_default: false,
    },
  });

  const { handleSubmit, setValue } = form;

  useEffect(() => {
    if (id) {
      // Buscar la dirección en el estado de direcciones
      const found = addresses.find((addr) => addr.id === id);
      if (found) {
        setAddress(found as Address);
        setValue("alias", found.alias);
        setValue("address", found.address);
        setValue("reference", found.reference || "");
        setValue("district_id", found.district_id.toString());
        setValue("is_default", found.is_default);
      } else {
        toast.error("Dirección no encontrada");
        navigate("/address");
      }
    }
  }, [id, addresses, setValue, navigate]);

  const onSubmit = async (data: AddressFormValues) => {
    if (!id) return;

    try {
      setIsLoading(true);

      const result = await updateAddress(id, {
        alias: data.alias,
        address: data.address,
        reference: data.reference,
        district_id: parseInt(data.district_id),
        is_default: data.is_default,
      });

      if (result) {
        toast.success("Dirección actualizada correctamente ✅");
        navigate("/address");
      }
    } catch (error) {
      console.error("Error actualizando dirección:", error);
      toast.error("No se pudo actualizar la dirección");
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-white p-4 flex items-center justify-center">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

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
              <span>Editar dirección</span>
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
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
