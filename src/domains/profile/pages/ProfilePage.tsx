import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEnvelope } from "react-icons/bi";
import { MdPhoneEnabled } from "react-icons/md";
import user_demo from "@/assets/profile/user.png";

import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker } from "react-leaflet/Marker";
import { Popup } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { FaMapMarkerAlt } from "react-icons/fa";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useRef } from "react";
import ProfileEditForm from "../components/ProfileEditForm";
import { IoCamera } from "react-icons/io5";
// import AddressManager from "../components/AddressManager";

// Componente del Modal/Overlay
const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Fondo oscuro */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Contenido del modal */}
      <div className="relative z-[10000] transform transition-all">
        {children}
      </div>
    </div>
  );
};

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

export default function ProfilePage() {
  const customIcon = createCustomIcon();
  const { clearAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estados para la información del perfil
  const [email, setEmail] = useState("josecorreo@hotmail.com");
  const [phone, setPhone] = useState("+51 999 989 943");
  const [profileImage, setProfileImage] = useState<string>(user_demo);

  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    logout();
    navigate("/auth/login");
  };

  const handleSave = () => {
    // Aquí puedes agregar lógica para guardar los cambios en una API
    console.log("Datos guardados:", { email, phone });
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Función para manejar el clic en la imagen de perfil
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Función para manejar el cambio de imagen
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecciona un archivo de imagen válido");
        return;
      }

      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          // Aquí podrías guardar la imagen en tu backend
          console.log("Imagen de perfil actualizada");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-4 bg-white h-fit min-h-screen">
      <div className="w-full flex justify-start max-w-md">
        <Link to="/" className="!text-black">
          <Button
            size="back"
            variant={"back"}
            className="w-auto h-auto py-2 text-icon hover:text-icon cursor-pointer"
          >
            <IoIosArrowBack className="size-8" strokeWidth={12} />
            <span className="-ml-2 font-bold">Tú Perfil</span>
          </Button>
        </Link>
      </div>

      {/* Body */}
      <div className="w-full max-w-md rounded-xl flex flex-col">
        {/* perfil */}
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-[#D86C00]">José</span>

          {/* Contenedor de la imagen de perfil - SOLUCIÓN */}
          <div className="relative group">
            <div
              className="relative size-[160px] rounded-xl cursor-pointer overflow-hidden"
              onClick={handleImageClick}
            >
              <img
                src={profileImage}
                alt="user-img"
                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
              />

              {/* Overlay con icono de cámara - ahora es parte del mismo elemento clickeable */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-xl transition-all duration-300">
                <IoCamera className="size-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </div>

            {/* Input file oculto */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <span className="text-[10px] text-gray-500 mt-2">
            Toca para añadir una foto de perfil
          </span>
        </div>

        {/* datos */}
        <div className="flex flex-col">
          <h2 className="ml-4 mt-4 text-xl font-semibold">Información</h2>

          <div className="w-full flex rounded-xl bg-gray-200 py-4">
            <div className="w-[65%] space-y-2 pl-4">
              <div className="text-xs flex items-center gap-x-2">
                <BiSolidEnvelope className="size-6" />
                {email}
              </div>
              <div className="text-xs flex items-center gap-x-2 ml-1">
                <MdPhoneEnabled className="size-[17px] rotate-225" />
                {phone}
              </div>
            </div>
            <div className="w-[35%] flex justify-center items-center border-l-[2px] border-gray-500 ">
              <Button
                onClick={handleOpenModal}
                className="bg-black text-white rounded-lg font-light px-6"
              >
                Editar
              </Button>
            </div>
          </div>

          <div className="w-full space-y-2">
            <div className=""></div>
            {/* Contenedor del mapa con z-index bajo */}
            <div className="w-full h-[160px] overflow-hidden rounded-xl mt-4 relative z-0">
              <MapContainer
                className="w-full h-full relative z-0"
                center={[-12.111575, -77.0125695]}
                zoom={18}
                scrollWheelZoom={false}
                style={{ position: "relative", zIndex: 0 }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[-12.111575, -77.0125695]} icon={customIcon}>
                  <Popup>Av. Tomas Marsano 961, Surquillo 15036</Popup>
                </Marker>
              </MapContainer>
            </div>
            {/* <AddressManager /> */}
          </div>
        </div>
      </div>

      {/* Modal para editar perfil */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ProfileEditForm
          email={email}
          phone={phone}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      </Modal>

      {/* cerrar sesion */}
      <Button
        variant={"destructive"}
        onClick={handleLogout}
        className="mt-2 w-full max-w-md"
      >
        Cerrar Sesi&oacute;n
      </Button>
    </div>
  );
}
