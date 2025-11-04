"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { Cat } from "lucide-react";
import { TbDog, TbCalendarEvent } from "react-icons/tb";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import pet_default from "@/assets/pets/pet-default.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Pet } from "../utils/Pet";
import { usePets } from "../services/servicesPet";
import { AvatarUploader } from "@/domains/profile/components/AvatarUploader";
import BREEDS from "../utils/breeds";
import { usePetSchema } from "../validation/usePetSchema";
import { usePetStore } from "@/store/pets.store";

type PetFormValues = z.infer<ReturnType<typeof usePetSchema>>;

export default function EditPetForm() {
  const { updatePet, uploadPetPhoto } = usePets();
  const { selectedPet } = usePetStore(); // ✅ Solo usamos el store
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);

  const schema = usePetSchema();
  const form = useForm<PetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      weight: "",
      species: "Perro",
      breed: "",
      birth_date: undefined,
      photo_url: "",
    },
  });

  const { register, handleSubmit, setValue, control, watch } = form;

  // 🐾 Prellenar el formulario cuando haya mascota seleccionada
  useEffect(() => {
    console.log("Selected Pet:", selectedPet);
    if (selectedPet) {
      setValue("name", selectedPet.name);
      setValue("weight", selectedPet.weight);
      setValue("species", selectedPet.species);
      setValue("breed", selectedPet.breed); // 👈 ya está, pero...
      setValue("photo_url", selectedPet.photo_url ?? undefined);
      const birth = selectedPet.birth_date
        ? new Date(selectedPet.birth_date)
        : undefined;
      setValue("birth_date", birth);
      setSelectedSpecies(selectedPet.species);
      setSelectedDate(birth);
      console.log("Pet breed:", selectedPet.breed);
    }
  }, [selectedPet, setValue]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setValue("birth_date", date);
  };

  const handleUploadAvatar = async (file: File) => {
    const url = await uploadPetPhoto(file, watch("name"));
    setValue("photo_url", url);
    return url;
  };

  const onSubmit = async (data: PetFormValues) => {
    if (!selectedPet) {
      console.warn("No hay mascota seleccionada para editar");
      return;
    }

    const payload: Partial<Pet> = {
      ...data,
      birth_date: data.birth_date
        ? data.birth_date.toISOString().split("T")[0]
        : null,
    };

    await updatePet(selectedPet.id, payload);
    setOpenDialog(true);
  };

  const formatDateForInput = (date: Date | undefined) =>
    date ? date.toISOString().split("T")[0] : "";

  const onlyNumbers = (value: string) => value.replace(/\D/g, "");

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-start pt-4 bg-white h-fit"
        >
          <div className="w-full flex justify-start">
            <Link to="/mypets" className="!text-black">
              <Button
                size="back"
                variant="back"
                className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
              >
                <IoIosArrowBack className="size-8" />
                <span className="-ml-2">Editar</span>
              </Button>
            </Link>
          </div>

          <div className="w-full max-w-md rounded-xl p-4 flex flex-col items-center gap-y-3">
            {/* 🐾 Peso y nombre */}
            <div className="relative flex flex-col justify-end w-full h-[300px] mb-2">
              {/* Peso */}
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 -top-4 size-14 flex justify-center items-center bg-gray-100 text-black rounded-full text-sm font-bold z-[15]",
                  watch("weight") ? "bg-[#409BFD]" : "bg-gray-100"
                )}
              >
                <div className="w-fit flex items-center gap-2 relative top-0">
                  <Input
                    type="text"
                    placeholder="kg ?"
                    {...register("weight")}
                    className={cn(
                      "border-none shadow-none",
                      watch("weight") ? "w-[63px] pr-5" : "w-[56px]"
                    )}
                    onChange={(e) => {
                      const clean = onlyNumbers(e.target.value).slice(0, 2);
                      setValue("weight", clean);
                    }}
                  />
                  {watch("weight") && (
                    <span className="absolute top-[8px] right-2">Kg</span>
                  )}
                </div>
              </div>

              {/* Círculo decorativo */}
              <div
                className={cn(
                  "size-64 rounded-full border-[25px] border-gray-200 flex items-center justify-center absolute -top-3 left-1/2 -translate-x-1/2 z-10",
                  watch("name") && watch("species")
                    ? "border-blue-200"
                    : "border-gray-200"
                )}
              />

              {/* Nombre + Especie + Avatar */}
              <div className="flex flex-col items-center z-20">
                <Input
                  placeholder="Ingrese un nombre"
                  maxLength={15}
                  {...register("name")}
                  className="max-w-[170px] text-blue-600 text-lg font-bold text-center border-none shadow-none placeholder:text-gray-400 placeholder:text-sm"
                />

                {!watch("name") && <div className="w-10 h-1 bg-gray-200" />}

                <div className="rounded-full flex gap-x-6 border border-neutral-200 bg-gray-100 py-1 px-2 mb-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setValue("species", "Gato");
                      setSelectedSpecies("Gato");
                    }}
                    className={
                      selectedSpecies === "Gato"
                        ? "text-black"
                        : "text-gray-500"
                    }
                  >
                    <Cat className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setValue("species", "Perro");
                      setSelectedSpecies("Perro");
                    }}
                    className={
                      selectedSpecies === "Perro"
                        ? "text-black"
                        : "text-gray-500"
                    }
                  >
                    <TbDog className="size-5" />
                  </button>
                </div>

                <AvatarUploader
                  defaultImage={pet_default}
                  avatarUrl={watch("photo_url")}
                  uploadFn={handleUploadAvatar}
                  onAvatarChange={(url) => setValue("photo_url", url)}
                />
              </div>
            </div>

            {/* 🐶 Raza */}
            <div className="w-full mb-4 relative">
              <Label className="block text-base font-semibold mb-1">Raza</Label>
              <FormField
                control={control}
                name="breed"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Select
                      key={field.value || "empty"} // 👈 fuerza re-render al cambiar breed
                      onValueChange={field.onChange}
                      value={field.value || ""} // 👈 asegura que no sea undefined
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecciona una raza" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full">
                        {BREEDS.map((breed, index) => (
                          <SelectItem key={index} value={breed}>
                            {breed}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* 📅 Fecha */}
            <div className="w-full rounded-lg mb-4 bg-[#F3F3F3]">
              <div className="flex flex-col gap-y-1 text-sm font-semibold mb-1 px-4 py-2">
                <span className="text-neutral-500 text-[11px]">
                  Seleccione una fecha (dd/mm/yyyy)
                </span>
                <div className="flex justify-between items-center">
                  <span>Fecha de nacimiento</span>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <button type="button">
                        <TbCalendarEvent size={18} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 -translate-x-14">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <hr className="mt-4" />
              <div className="h-16 flex items-start px-4 py-3">
                <Controller
                  name="birth_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      value={formatDateForInput(field.value)}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? new Date(e.target.value) : undefined
                        )
                      }
                      className="w-full border rounded px-1 text-sky-500 font-semibold text-sm"
                    />
                  )}
                />
              </div>
            </div>

            {/* 💾 Guardar */}
            <Button
              type="submit"
              className="bg-black text-white rounded-lg font-light px-6"
            >
              Guardar cambios
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="text-center py-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-green-600">
              ¡Mascota actualizada! 🎉
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Los cambios han sido guardados correctamente.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex justify-center mt-4">
            <Link to="/mypets">
              <Button
                onClick={() => setOpenDialog(false)}
                className="bg-black text-white rounded-lg"
              >
                Volver a mis mascotas
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
