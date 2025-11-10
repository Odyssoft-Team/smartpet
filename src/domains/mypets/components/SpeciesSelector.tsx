import { Cat } from "lucide-react";
import { TbDog } from "react-icons/tb";

interface SpeciesSelectorProps {
  selected?: 'Perro' | 'Gato';
  onSelect: (species: 'Perro' | 'Gato') => void;
}

export default function SpeciesSelector({ selected, onSelect }: SpeciesSelectorProps) {
  return (
    <div className="flex justify-center gap-x-8">
      <button
        type="button"
        onClick={() => onSelect('Gato')}
        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
          selected === 'Gato'
            ? 'bg-blue-100 text-blue-600'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        <Cat className="size-12" />
        <span className="font-medium">Gato</span>
      </button>

      <button
        type="button"
        onClick={() => onSelect('Perro')}
        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
          selected === 'Perro'
            ? 'bg-blue-100 text-blue-600'
            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
        }`}
      >
        <TbDog className="size-12" />
        <span className="font-medium">Perro</span>
      </button>
    </div>
  );
}