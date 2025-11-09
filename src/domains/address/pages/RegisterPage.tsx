"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Cat } from "lucide-react";
import { TbDog } from "react-icons/tb";
import { Link } from "react-router-dom";
// import fidel_pet from "@/assets/pets/fidel-cuadrado.png";
import pet_default from "@/assets/pets/pet-default.jpg";
import { TbCalendarEvent } from "react-icons/tb";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { usePetSchema } from "../validation/usePetSchema";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BREEDS from "../utils/breeds";
import { Label } from "@/components/ui/label";
import { AvatarUploader } from "@/domains/profile/components/AvatarUploader";
import { usePets } from "../services/servicesPet";
import { toast } from "sonner";
import type { Pet } from "../utils/Pet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePetStore } from "@/store/pets.store";

type PetFormValues = z.infer<ReturnType<typeof usePetSchema>>;

export default function RegistermypetsPage() {
  const [open, setOpen] = useState(false);
  const schema = usePetSchema();
  const form = useForm<PetFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      photo_url: "",
      name: "",
      weight: "",
      species: undefined,
      breed: "",
      birth_date: undefined,
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const { listPets, setListPets } = usePetStore();

  const { addPet, uploadPetPhoto } = usePets();

  const [openDialog, setOpenDialog] = useState(false);

  async function handleUploadAvatar(file: File) {
    const petName = watch("name");
    const url = await uploadPetPhoto(file, petName);
    return url;
  }

  const onSubmit = async (data: PetFormValues) => {
    const formattedData: Omit<Pet, "id" | "user_id"> = {
      ...data,
      species: data.species as "Perro" | "Gato" | "Otro",
      birth_date: data.birth_date ? data.birth_date.toISOString() : undefined,
    };

    const newPet = await addPet(formattedData);

    if (newPet) {
      setListPets([...listPets, newPet]); // 👈 actualiza el store global
      toast.success("Mascota registrada con éxito 🐾");
      form.reset();
      setOpenDialog(true);
    }
  };

  const selectedSpecies = watch("species");
  const selectedDate = watch("birth_date");

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setValue("birth_date", selectedDate);
    setOpen(false);
  };

  const formatDateForInput = (date: Date | undefined) =>
    date ? format(date, "yyyy-MM-dd") : "";

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
                <span className="-ml-2">Registro</span>
              </Button>
            </Link>
          </div>

          <div className="w-full max-w-md rounded-xl p-4 flex flex-col items-center gap-y-3">
            {/* 🐾 Peso y nombre */}
            <div className="relative flex flex-col justify-end w-full h-[300px] mb-2">
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 -top-4 size-14 flex justify-center items-center bg-gray-100 text-black rounded-full text-sm font-bold z-[15] transition-all duration-300",
                  watch("weight") ? "bg-[#409BFD]" : "bg-gray-100"
                )}
              >
                <div className="w-fit flex items-center gap-2 relative top-0 transition-all duration-300 text-center">
                  <Input
                    type="text"
                    placeholder="kg ?"
                    {...register("weight")}
                    className={cn(
                      "border-none shadow-none",
                      watch("weight") ? "w-[63px] pr-5" : "w-[56px]"
                    )}
                    onChange={(e) => {
                      const cleanValue = onlyNumbers(e.target.value).slice(
                        0,
                        2
                      );
                      setValue("weight", cleanValue);
                    }}
                  />
                  {watch("weight") && (
                    <span className="absolute top-[8px] right-2">Kg</span>
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "size-64 rounded-full border-[25px] border-gray-200 flex items-center justify-center mb-2 mt-4 absolute -top-3 left-1/2 -translate-x-1/2 z-10 transition-all duration-300",
                  watch("name") && watch("species")
                    ? "border-blue-200"
                    : "border-gray-200"
                )}
              />

              <div className="flex flex-col items-center z-20">
                <Input
                  placeholder="Ingrese un nombre"
                  maxLength={15}
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                  className="max-w-[170px] text-blue-600 text-lg font-bold text-center border-none shadow-none placeholder:text-gray-400 placeholder:text-sm"
                />

                {watch("name") ? "" : <div className="w-10 h-1 bg-gray-200" />}

                {/* botones especie */}
                <div className="rounded-full flex gap-x-6 border border-neutral-200 bg-gray-100 py-1 px-2 mb-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setValue("species", "Gato")}
                    className={`${
                      selectedSpecies === "Gato"
                        ? "text-black"
                        : "text-gray-500"
                    }`}
                  >
                    <Cat className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("species", "Perro")}
                    className={`${
                      selectedSpecies === "Perro"
                        ? "text-black"
                        : "text-gray-500"
                    }`}
                  >
                    <TbDog className="size-5" />
                  </button>
                </div>
                <AvatarUploader
                  defaultImage={pet_default}
                  avatarUrl={watch("photo_url")}
                  onAvatarChange={(url) => setValue("photo_url", url)}
                  uploadFn={handleUploadAvatar}
                />
                {errors.name && (
                  <span className="text-xs text-red-500 absolute bottom-[-20px]">
                    {errors.name.message}
                  </span>
                )}
                {errors.species && (
                  <span className="text-xs text-red-500 absolute bottom-[-20px]">
                    {errors.species.message}
                  </span>
                )}
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
              {errors.breed && (
                <span className="text-xs text-red-500 absolute bottom-[-20px]">
                  {errors.breed.message}
                </span>
              )}
              {errors.birth_date && (
                <span className="text-xs text-red-500 absolute bottom-[-20px]">
                  {errors.birth_date.message}
                </span>
              )}
            </div>

            {/* 📅 Fecha de nacimiento */}
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
                    <PopoverContent
                      align="center"
                      side="bottom"
                      className="w-auto p-0 -translate-x-14"
                    >
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

            {/* 🧡 Botón Guardar */}
            <Button
              type="submit"
              className="bg-black text-white rounded-lg font-light px-6"
            >
              Guardar
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="text-center py-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-green-600">
              ¡Mascota registrada! 🎉
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Tu mascota ha sido añadida correctamente.
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
