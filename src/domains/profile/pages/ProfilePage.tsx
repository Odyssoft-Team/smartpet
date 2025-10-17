import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useProfileStore } from "@/store/profile.store";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { BiSolidEnvelope } from "react-icons/bi";
import { MdPhoneEnabled } from "react-icons/md";
import user_demo from "@/assets/profile/user.png";
import { FaRegClock } from "react-icons/fa";
import { MapContainer } from "react-leaflet/MapContainer";
import { useMapEvents } from "react-leaflet";
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
import { HiPencil } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { cn } from "@/lib/utils";
import AddressEditForm from "../components/AddressEditForm";
import CardEditForm from "../components/CardEditForm";
import MaskedCard from "../components/MaskedCard";
import { ListHistorial } from "@/data/historial";
import { FaPlayCircle } from "react-icons/fa";
import fidel from "@/assets/pets/fidel-dog.png";
import { TbDog } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa";

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
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
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

// Componente para manejar los eventos del mapa
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

export default function ProfilePage() {
  const customIcon = createCustomIcon();
  const { clearAuth, logout } = useAuthStore();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Usar el store global del perfil
  const {
    name,
    email,
    phone,
    profileImage,
    addressLabel,
    address,
    coordinates,
    cardData,
    setEmail,
    setPhone,
    setProfileImage,
    setName,
    setAddress,
    setCoordinates,
    updateCardData,
  } = useProfileStore();

  const [openVideos, setOpenVideos] = useState<{ [key: string]: boolean }>({});
  const [isMapOpen, setIsMapOpen] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState<boolean>(false);

  const toggleVideo = (itemId: string) => {
    setOpenVideos((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Función para manejar clics en el mapa
  const handleMapClick = (lat: number, lng: number) => {
    setCoordinates(lat, lng);
    console.log("Coordenadas guardadas:", { lat, lng });
  };

  const handleSave = () => setIsModalOpen(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSave2 = () => setIsModalOpen2(false);
  const handleOpenModal2 = () => setIsModalOpen2(true);
  const handleCloseModal2 = () => setIsModalOpen2(false);

  const handleCardSave = () => setIsModalOpen3(false);
  const handleOpenCard = () => setIsModalOpen3(true);
  const handleCardClose = () => setIsModalOpen3(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    clearAuth();
    logout();
    navigate("/auth/login");
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Por favor, selecciona un archivo de imagen válido");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("La imagen debe ser menor a 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
          console.log("Imagen de perfil actualizada");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const displayImage = profileImage || user_demo;

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
      <div className="w-full max-w-md rounded-xl flex flex-col mb-2">
        {/* perfil */}
        <div className="flex flex-col items-center gap-y-1">
          <span className="text-3xl font-bold text-[#D86C00]">{name}</span>

          <div className="relative group">
            <div
              className="relative size-[160px] rounded-xl cursor-pointer overflow-hidden"
              onClick={handleImageClick}
            >
              <img
                src={displayImage}
                alt="user-img"
                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-xl transition-all duration-300">
                <IoCamera className="size-8 text-white opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </div>
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
          {/* Información */}
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

          {/* Dirección */}
          <div className="w-full space-y-2 mt-3">
            <div className="flex items-center gap-x-3 ml-5">
              <FaMapMarkerAlt className="size-5 text-[#D86C00]" />
              <div>
                <div className="flex items-center gap-x-2 text-base font-bold">
                  {addressLabel}
                  <button
                    onClick={handleOpenModal2}
                    className="size-5 flex items-center justify-center rounded-full bg-gray-200"
                  >
                    <HiPencil className="size-3" />
                  </button>
                </div>
                <div className="flex items-center gap-x-2 text-xs text-gray-500">
                  {address}
                  <button
                    onClick={() => setIsMapOpen(!isMapOpen)}
                    className="size-5 flex items-center justify-center rounded-full bg-gray-200"
                  >
                    <IoIosArrowDown
                      className={cn(
                        "size-4 text-black",
                        isMapOpen ? "rotate-0" : "rotate-180"
                      )}
                      strokeWidth={12}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Contenedor del mapa */}
            <div
              className={cn(
                "w-full overflow-hidden rounded-xl mt-3 relative z-0 transition-all duration-300 ease-in-out",
                isMapOpen ? "h-[200px]" : "h-0"
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

            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-medium text-sky-500">
              👆 Toca en el mapa para seleccionar tu ubicación
            </div>
          </div>

          <hr className="mt-6 bg-gray-600" />

          {/* Medio de pago frecuente */}
          <div className="flex flex-col gap-y-2">
            <h2 className="ml-4 mt-4 text-base font-bold">Medios de pago</h2>
            <div className="w-full flex rounded-xl bg-gray-200 py-4">
              <div className="w-[35%] flex justify-center items-center">
                <div className="w-12 h-8 flex flex-col rounded-[0.2rem] overflow-hidden">
                  <div className="w-full h-[20%] bg-sky-600"></div>
                  <div className="w-full h-[20%] bg-black"></div>
                  <div className="w-full h-[60%] bg-sky-600"></div>
                </div>
              </div>
              <div className="w-[65%] flex items-center justify-between pl-4 pr-5 border-l-[2px] border-gray-500">
                <div className="space-y-2">
                  <div className="text-xs font-bold text-[#D86C00]">
                    Tarjeta de débito:
                  </div>
                  <div className="text-xs flex items-center gap-x-2 ml-1">
                    VISA <MaskedCard cardNumber={cardData.cardNumber} />
                  </div>
                </div>
                <button
                  onClick={handleOpenCard}
                  className="size-5 flex items-center justify-center rounded-full bg-black"
                >
                  <HiPencil className="size-3 text-gray-200" />
                </button>
              </div>
            </div>
          </div>

          {/* Resto del código (Historial y Favoritos) se mantiene igual */}
          <hr className="mt-6 bg-gray-600" />

          {/* Historial - MANTENIDO IGUAL */}
          <div className="flex flex-col gap-y-2">
            <h2 className="ml-4 mt-4 text-base font-bold">Historial</h2>
            <div className="flex flex-col gap-y-3">
              {ListHistorial.slice(0, 2).map((item, index) => (
                <div key={item.id || index} className="flex flex-col">
                  {/* info */}
                  <div className="flex px-4 items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <div className="relative w-fit h-fit">
                        <img
                          src={item.img}
                          alt={`hs-${index}`}
                          className="size-15 rounded-full"
                        />
                        <div className="absolute inset-0 bg-white/50 rounded-full z-20 flex items-center justify-center">
                          <FaRegClock className="size-5 text-black" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center font-bold gap-x-1">
                          {item.name} <item.icon className="size-5" />
                        </div>
                        <p className="text-xs -mb-1">{item.description}</p>
                        <span className="text-[12px] text-gray-400">
                          {item.date}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleVideo(item.id || `item-${index}`)}
                      className="size-5 flex items-center justify-center rounded-full bg-gray-200"
                    >
                      <IoIosArrowDown
                        className={cn(
                          "size-4 text-black",
                          openVideos[item.id || `item-${index}`]
                            ? "rotate-0"
                            : "rotate-180"
                        )}
                        strokeWidth={12}
                      />
                    </button>
                  </div>

                  {/* video */}
                  <div
                    className={cn(
                      "w-full m-2 transition-all duration-300 ease-in-out rounded-xl relative overflow-hidden",
                      openVideos[item.id || `item-${index}`]
                        ? "h-[170px]"
                        : "h-0"
                    )}
                  >
                    <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 z-10 w-fit h-fit -mt-3">
                      <FaPlayCircle className="size-10" />
                    </div>
                    <div className="absolute inset-0 bottom-0 left-5 text-2xl text-white/95">
                      35:00
                    </div>
                    <img
                      src={item.video}
                      alt="img-banio"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <h2 className="ml-4 text-sm text-sky-500">Mayo 2025</h2>

            <div className="flex flex-col gap-y-3">
              {ListHistorial.slice(2, 4).map((item, index) => (
                <div key={item.id || index + 2} className="flex flex-col">
                  {/* info */}
                  <div className="flex px-4 items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      <div className="relative w-fit h-fit">
                        <img
                          src={item.img}
                          alt={`hs-${index + 2}`}
                          className="size-15 rounded-full"
                        />
                        <div className="absolute inset-0 bg-white/50 rounded-full z-20 flex items-center justify-center">
                          <FaRegClock className="size-5 text-black" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center font-bold gap-x-1">
                          {item.name} <item.icon className="size-5" />
                        </div>
                        <p className="text-xs -mb-1">{item.description}</p>
                        <span className="text-[12px] text-gray-400">
                          {item.date}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        toggleVideo(item.id || `item-${index + 2}`)
                      }
                      className="size-5 flex items-center justify-center rounded-full bg-gray-200"
                    >
                      <IoIosArrowDown
                        className={cn(
                          "size-4 text-black",
                          openVideos[item.id || `item-${index + 2}`]
                            ? "rotate-0"
                            : "rotate-180"
                        )}
                        strokeWidth={12}
                      />
                    </button>
                  </div>

                  {/* video */}
                  <div
                    className={cn(
                      "w-full m-2 transition-all duration-300 ease-in-out rounded-xl relative overflow-hidden",
                      openVideos[item.id || `item-${index + 2}`]
                        ? "h-[170px]"
                        : "h-0"
                    )}
                  >
                    <div className="absolute inset-0 top-1/2 left-1/2 -translate-x-1/2 z-10 w-fit h-fit -mt-3">
                      <FaPlayCircle className="size-10" />
                    </div>
                    <div className="absolute inset-0 bottom-0 left-5 text-2xl text-white/95">
                      35:00
                    </div>
                    <img
                      src={item.video}
                      alt="img-banio"
                      className="w-full h-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="mt-2 bg-gray-600" />

          {/* favoritos - MANTENIDO IGUAL */}
          <div className="space-y-2">
            <div className="ml-4 mt-4 flex items-center gap-x-2 text-base font-bold">
              Favoritos <FaRegHeart className="text-red-500" />
            </div>
            <div className="flex px-4 py-2 items-center justify-between bg-gray-200 rounded-xl mt-4 ">
              <div className="flex items-center gap-x-2">
                <img
                  src={fidel}
                  alt="img-fidel"
                  className="size-15 rounded-full mr-2"
                />

                <div className="pl-4 border-l-[2px] border-gray-400">
                  <div className="flex items-center font-bold gap-x-1">
                    Fidel <TbDog className="size-5" />
                  </div>
                  <p className="text-xs -mb-1">Ducha y corte de pelo</p>
                  <span className="text-[12px] text-gray-400">Gromming</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modales (se mantienen igual) */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ProfileEditForm
          email={email}
          phone={phone}
          name={name}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onNameChange={setName}
          onSave={handleSave}
          onClose={handleCloseModal}
        />
      </Modal>

      <Modal isOpen={isModalOpen2} onClose={handleCloseModal2}>
        <AddressEditForm
          label={addressLabel}
          address={address}
          onLabelChange={(label) => setAddress(label, address)}
          onAddressChange={(newAddress) => setAddress(addressLabel, newAddress)}
          onSave={handleSave2}
          onClose={handleCloseModal2}
        />
      </Modal>

      <Modal isOpen={isModalOpen3} onClose={handleCardClose}>
        <CardEditForm
          label={cardData.label}
          cardNumber={cardData.cardNumber}
          cardHolder={cardData.cardHolder}
          expiryDate={cardData.expiryDate}
          cvv={cardData.cvv}
          onLabelChange={(label) => updateCardData({ label })}
          onCardNumberChange={(cardNumber) => updateCardData({ cardNumber })}
          onCardHolderChange={(cardHolder) => updateCardData({ cardHolder })}
          onExpiryDateChange={(expiryDate) => updateCardData({ expiryDate })}
          onCvvChange={(cvv) => updateCardData({ cvv })}
          onSave={handleCardSave}
          onClose={handleCardClose}
        />
      </Modal>

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
