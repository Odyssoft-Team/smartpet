import { TbDog } from "react-icons/tb";
import fidel from "@/assets/pets/fidel-dog.png";
import olivia from "@/assets/pets/olivia-dog.png";
import banio from "@/assets/pets/perro-banio.png";

type Historial = {
  id: string;
  video: string;
  img: string;
  name: string;
  description: string;
  date: string;
  icon: React.ElementType;
};

export const ListHistorial: Historial[] = [
  {
    id: "1",
    video: banio,
    img: fidel,
    name: "Fidel",
    description: "Ducha y corte de pelo",
    date: "17 de julio - 3:00 pm",
    icon: TbDog,
  },
  {
    id: "2",
    video: banio,
    img: olivia,
    name: "Olivia",
    description: "Ducha y corte de pelo",
    date: "15 de julio - 2:00 pm",
    icon: TbDog,
  },
  {
    id: "3",
    video: banio,
    img: olivia,
    name: "Olivia",
    description: "Paseo de mascota",
    date: "25 de mayo - 10:00 am",
    icon: TbDog,
  },
  {
    id: "4",
    video: banio,
    img: fidel,
    name: "Fidel",
    description: "Ducha y corte de pelo",
    date: "13 de mayo - 3:00 am",
    icon: TbDog,
  },
];
