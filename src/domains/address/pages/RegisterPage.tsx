"use client";

// 🗺️ React Leaflet
import "leaflet/dist/leaflet.css";

import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  getPetsByUser,
  type Pet,
} from "@/domains/mypets/services/getPetsByUser";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { IoIosArrowBack } from "react-icons/io";
import { useAddresses } from "../services/addressService";
import { DISTRICTS } from "../utils/districts";
import { toast } from "sonner";
import { FaMapMarkerAlt } from "react-icons/fa";
import { cn } from "@/lib/utils";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { useProfileStore } from "@/store/profile.store";
import Modal from "@/domains/profile/components/Modal";
import AddressEditForm from "@/domains/profile/components/AddressEditForm";
import { useProfiles } from "@/domains/profile/services/servicesProfile";

type AddressFormValues = {
  alias: string;
  address: string;
  reference?: string;
  district_id: string;
  is_default: boolean;
};

function MapEvents({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onMapClick(lat, lng);
    },
  });
  return null;
}

const createCustomIcon = () => {
  const iconMarkup = renderToStaticMarkup(
    <FaMapMarkerAlt className="text-[#D86C00] text-2xl" />
  );

  return divIcon({
    html: iconMarkup,
    iconSize: [32, 32],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
    className: "custom-marker-icon",
  });
};

export default function RegisterPage() {
  const { addAddress } = useAddresses();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const customIcon = createCustomIcon();

  const { updateProfile } = useProfiles();

  const { profile, setProfile } = useProfileStore();

  const [coordinates, setCoordinates] = useState({
    lat: -12.0464, // valor por defecto (Lima, Perú por ejemplo)
    lng: -77.0428,
  });

  const [openAddress, setOpenAddress] = useState<boolean>(false);

  const handleMapClick = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    console.log("Coordenadas guardadas:", { lat, lng });
  };

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

  const [listPets, setListPets] = useState<Pet[]>([]);

  const fetchPets = useCallback(async () => {
    try {
      const data = await getPetsByUser();
      if (data && Array.isArray(data)) {
        setListPets(data);
        console.log(listPets);
      }
    } catch (error) {
      console.error("Error obteniendo las mascotas:", error);
      toast.error("No se pudieron cargar las mascotas");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setListPets]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);
  const onSubmit = async (data: AddressFormValues) => {
    try {
      setIsLoading(true);

      // Verificar que el district_id existe en DISTRICTS
      const selectedDistrict = DISTRICTS.find(
        (d) => d.id.toString() === data.district_id
      );

      if (!selectedDistrict) {
        toast.error("Distrito no válido");
        return;
      }

      const result = await addAddress({
        alias: data.alias,
        address: data.address,
        reference: data.reference,
        district_id: selectedDistrict.id,
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

  const handleSaveAddress = async (updatedAddress: {
    label_address: string;
    address: string;
  }) => {
    try {
      if (
        updatedAddress.label_address === profile.label_address &&
        updatedAddress.address === profile.address
      ) {
        toast.info("No hay cambios en la dirección");
        return;
      }

      const result = await updateProfile({
        label_address: updatedAddress.label_address,
        address: updatedAddress.address,
      });

      if (!result) {
        throw new Error("No se recibió respuesta del servidor");
      }

      // ✅ Actualizar directamente el store global del perfil
      setProfile({
        label_address: result.label_address || "",
        address: result.address || "",
      });

      toast.success("Dirección actualizada correctamente");
      handleCloseAddress();
    } catch (error) {
      console.error("Error al actualizar la dirección:", error);
      toast.error("No se pudo actualizar la dirección");
    }
  };

  const handleCloseAddress = () => {
    setOpenAddress(false);
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
                      <SelectTrigger className="w-full">
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

            {/* Dirección */}
            <div className="w-full space-y-2 mt-3">
              {/* Contenedor del mapa */}
              <div
                className={cn(
                  "w-full overflow-hidden rounded-xl mt-3 relative z-0 transition-all duration-300 ease-in-out h-[200px]"
                )}
              >
                <MapContainer
                  className="w-full h-full relative z-0"
                  center={[coordinates.lat, coordinates.lng]}
                  zoom={18}
                  scrollWheelZoom={true}
                  style={{ position: "relative", zIndex: 0 }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {/* Componente para manejar eventos de clic */}
                  <MapEvents onMapClick={handleMapClick} />

                  {/* Marcador en la ubicación seleccionada */}
                  <Marker
                    position={[coordinates.lat, coordinates.lng]}
                    icon={customIcon}
                  >
                    <Popup>
                      <div className="text-center">
                        <strong>Tu ubicación seleccionada</strong>
                        <br />
                        Lat: {coordinates.lat.toFixed(6)}
                        <br />
                        Lng: {coordinates.lng.toFixed(6)}
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>

                {/* Información de coordenadas */}
                <div className="absolute bottom-2 left-2 right-2 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Coordenadas guardadas:</span>
                    <span className="text-gray-600">
                      {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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
                    <Label className="mb-0">
                      Establecer como dirección predeterminada
                    </Label>
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

      <Modal isOpen={openAddress} onClose={handleCloseAddress}>
        <AddressEditForm
          addressData={{
            label_address: profile.label_address,
            address: profile.address,
          }}
          onSave={handleSaveAddress}
          onClose={handleCloseAddress}
        />
      </Modal>
    </div>
  );
}
