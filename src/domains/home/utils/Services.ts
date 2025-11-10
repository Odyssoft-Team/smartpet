import opcion_1 from "@/assets/home/serv-bano.png";
import opcion_2 from "@/assets/home/serv-paseo.png";
import opcion_3 from "@/assets/home/serv-comida.png";
import groming_1 from "@/assets/grooming/clasico.png";
import groming_2 from "@/assets/grooming/medicado.png";
import groming_3 from "@/assets/grooming/premium.png";
import groming_4 from "@/assets/grooming/seco.png";

type Services = {
  id: number;
  img: string;
};

export const SERVICES: Services[] = [
  {
    id: 1,
    img: opcion_1,
  },
  { id: 2, img: opcion_2 },
  { id: 3, img: opcion_3 },
];

type TypeService = {
  id: number;
  type_service: "Clásico" | "Medicado" | "Premium" | "Seco";
  icon: string;
  commend: string;
  description: string;
  includes: string[];
};

export const TYPE_SERVICE_GROMMING: TypeService[] = [
  {
    id: 1,
    type_service: "Clásico",
    icon: groming_1,
    commend: "Ideal para perros activos",
    description:
      " Ofrece una limpieza completa y cuidadosa para tu mascota, utilizando productos suaves que eliminan la suciedad y mantienen su pelaje brillante y saludable.",
    includes: [
      "Shampoo y acondicionador hipoalergénicos.",
      "Recorte de uñas.",
      "Limpieza de orejas y dental.",
      "Aplicación de humectante y perfume.",
    ],
  },
  {
    id: 2,
    type_service: "Medicado",
    icon: groming_2,
    commend: "Cuidado especial",
    description:
      " Diseñado para mascotas con piel sensible, alergias o irritaciones. Utiliza productos dermatológicos especiales que favorecen la recuperación de la piel.",
    includes: [
      "Shampoo y acondicionador hipoclorosos.",
      "Recorte de uñas.",
      "Limpieza de orejas y dental.",
      "Aplicación de humectante y perfume.",
    ],
  },
  {
    id: 3,
    type_service: "Premium",
    commend: "Experiencia premium",
    icon: groming_3,
    description:
      "Brinda una experiencia de spa para tu mascota, con productos de alta calidad, mascarillas y cuidados que dejan su piel revitalizada.",
    includes: [
      "Shampoo intensivo.",
      "Recorte de uñas.",
      "Limpieza de orejas y dental.",
      "Aplicación de humectante, brillo de pelaje y perfume.",
    ],
  },
  {
    id: 4,
    type_service: "Seco",
    commend: "Limpieza en seco",
    icon: groming_4,
    description:
      "La opción perfecta para mantener limpia a tu mascota sin necesidad de agua. Se aplican productos especiales que eliminan la suciedad y los malos olores.",
    includes: [
      "Shampoo en seco.",
      "Recorte de uñas.",
      "Limpieza de orejas y dental.",
      "Aplicación de humectante, brillo de pelaje y perfume.",
    ],
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
