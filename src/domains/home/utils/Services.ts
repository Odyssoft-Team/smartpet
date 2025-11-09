import opcion_1 from "@/assets/home/serv-bano.png";
import opcion_2 from "@/assets/home/serv-paseo.png";
import opcion_3 from "@/assets/home/serv-comida.png";

type Services = {
  img: string;
  service_name: string;
  sub?: string;
  time?: string;
};

export const SERVICES: Services[] = [
  {
    img: opcion_1,
    service_name: "Ducha y corte de pelo",
    sub: "Grooming",
    time: "30-45 min",
  },
  { img: opcion_2, service_name: "Paseo de mascota", sub: "Caring" },
  { img: opcion_3, service_name: "Estadia", sub: "Caring" },
];

type TypeService = {
  type_service: "Baño clásico" | "Baño medicado" | "Baño premium" | "Baño seco";
  description: string;
  price: string;
};

export const TYPE_SERVICE_GROMMING: TypeService[] = [
  {
    type_service: "Baño clásico",
    description:
      "🛁🐾 Baño clásico: shampoo/acond. hipoalergénico 🧴, recorte ✂️, uñas 🐾, orejas 👂, dental 🪥, humectante 💧 y perfume 🌸",
    price: "90.00",
  },
  {
    type_service: "Baño medicado",
    description:
      "🧼🐕 Baño medicado: shampoo hipocloroso 💊, recorte ✂️, uñas ✋, orejas 👂, dental 🦷, humectante 💧 y perfume 🌿",
    price: "95.00",
  },
  {
    type_service: "Baño premium",
    description:
      "🌟🐾 Baño premium: shampoo intensivo 🧴, recorte ✂️, uñas 🐾, orejas 👂, dental 🪥, mascarilla hidratante 💧, brillo de pelaje ✨ y perfume 🌸",
    price: "99.00",
  },
  {
    type_service: "Baño seco",
    description:
      "🌬️🐕 Baño seco: shampoo en seco 🧴, recorte ✂️, uñas 🐾, orejas 👂, dental 🪥, brillo de pelaje ✨ y perfume 🌸",
    price: "-",
  },
];

type TypeAdditional = {
  name:
    | "Deslanado"
    | "Desmontado"
    | "Pipetas antipulgas"
    | "Cortes"
    | "Cepillo";
  description: string;
  price: string;
};

export const ADDITIONAL_SERVICE_GROMMING: TypeAdditional[] = [
  {
    name: "Deslanado",
    description:
      "🪮🐾 Deslanado: cepillado intensivo para retirar exceso de pelo",
    price: "-",
  },
  {
    name: "Desmontado",
    description: "🧶🐾 Desmotado: retiro de motas y nudos del pelaje ✂️🪮",
    price: "-",
  },
  {
    name: "Pipetas antipulgas",
    description:
      "💊🐾 Pipetas antipulgas: eliminan y previenen pulgas 🦟, protegiendo la piel y pelaje ✨",
    price: "25.00",
  },
  {
    name: "Cortes",
    description:
      "✂️🐾 Cortes: estilo personalizado según raza 🐶🐱, con acabado prolijo, suave y brillante ✨",
    price: "40.00",
  },
  {
    name: "Cepillo",
    description:
      "🪮🐾 Cepillado: elimina nudos y pelo suelto 💨, dejando el pelaje suave, limpio y brillante ✨",
    price: "25.00",
  },
];
