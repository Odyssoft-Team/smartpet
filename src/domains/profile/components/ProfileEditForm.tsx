import { Button } from "@/components/ui/button";
import { IoClose } from "react-icons/io5";

const ProfileEditForm = ({
  email,
  phone,
  onEmailChange,
  onPhoneChange,
  onSave,
  onClose,
}: {
  email: string;
  phone: string;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
  onSave: () => void;
  onClose: () => void;
}) => {
  return (
    <div className="bg-white rounded-xl p-6 max-w-md mx-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Editar Perfil</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <IoClose className="size-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent"
            placeholder="Ingresa tu correo"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D86C00] focus:border-transparent"
            placeholder="Ingresa tu teléfono"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Button>
          <Button
            onClick={onSave}
            className="flex-1 bg-[#D86C00] hover:bg-[#b35900] text-white"
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;
