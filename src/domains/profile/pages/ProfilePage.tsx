// 🧩 React & React Router
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useAuthStore } from "@/store/auth.store";
import { useProfiles } from "../services/servicesProfile";
import { useCards } from "../services/cardService";

// import MaskedCard from "../components/MaskedCard";
import CardCreateForm from "../components/CardCreateForm";
import CardEditForm from "../components/CardEditForm";
import CardDeleteDialog from "../components/CardDeleteDialog";
import ProfileEditForm from "../components/ProfileEditForm";
import Modal from "../components/Modal";
import { AvatarUploader } from "../components/AvatarUploader";

import { ListHistorial } from "@/data/historial";
import type { ListProfile } from "../utils/Profile";
import type { Cards } from "../utils/Card";
import fidel from "@/assets/pets/fidel-dog.png";
import user_demo from "@/assets/profile/user-profile.jpg";

import {
  // FaRegTrashAlt,
  FaPlayCircle,
  FaRegHeart,
  FaRegClock,
  // FaPaw,
  FaCreditCard,
  // FaBook,
} from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
//import { FiArrowRightCircle } from "react-icons/fi";
//import { IoIosArrowForward } from "react-icons/io";
import { BiSolidEnvelope } from "react-icons/bi";
import { MdPhoneEnabled } from "react-icons/md";
// import { HiPencil } from "react-icons/hi";
import { TbDog } from "react-icons/tb";
import { useProfileStore } from "@/store/profile.store";
import { useCardsStore } from "@/store/card.store";
import { HiMapPin } from "react-icons/hi2";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { clearAuth, logout } = useAuthStore();
  const navigate = useNavigate();

  const { getCurrentUserProfile, updateProfile } = useProfiles();
  // const { loadUserCards, updateCard } = useCards();

  const [openVideos, setOpenVideos] = useState<{ [key: string]: boolean }>({});

  const toggleVideo = (itemId: string) => {
    setOpenVideos((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // estados y const de PROFILE

  const [loading, setLoading] = useState<boolean>(true);

  // ESTADOS GLOBALES para DIRECCION
  const { profile, setProfile, clearProfile } = useProfileStore();

  useEffect(() => {
    const fetchProfile = async () => {
      // if (profile.id && profile.full_name) {
      //   console.log("✅ Ya hay datos en el store, omitiendo fetch");
      //   setLoading(false);
      //   return;
      // }

      try {
        setLoading(true);
        const data = await getCurrentUserProfile();

        if (data) {
          setProfile({
            id: data.id,
            full_name: data.full_name || "",
            email: data.email || "",
            phone: data.phone || "",
            avatar_url: data.avatar_url || "",
            label_address: data.label_address || "",
            address: data.address || "",
          });
        } else {
          toast.error("No se pudo cargar el perfil del usuario");
        }
      } catch (error) {
        console.error("Error cargando perfil:", error);
        toast.error("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [openProfile, setOpenProfile] = useState<boolean>(false);

  // manejadores para editar INFORMACION
  const handleCloseProfile = () => {
    // cierras el modal
    setOpenProfile(false);
  };

  const handleEditProfile = async (updatedProfile: ListProfile) => {
    const result = await updateProfile({
      full_name: updatedProfile.full_name,
      email: updatedProfile.email,
      phone: updatedProfile.phone,
    });

    if (result) {
      setProfile({
        full_name: result.full_name,
        email: result.email,
        phone: result.phone,
        avatar_url: result.avatar_url ?? undefined,
      });

      handleCloseProfile();
    }
  };

  // manejadores para editar DIRECCION

  // estados GLOBALES y GET de CARDS
  const {
    // listCards,
    setCards,
    addCard: addCardToStore,
    updateCard: updateCardInStore,
    deleteCard: deleteCardFromStore,
  } = useCardsStore();

  const { getCards, addCard, updateCard, deleteCard } = useCards();

  const fetchCards = useCallback(async () => {
    // if (listCards.length > 0) {
    //   console.log("✅ Ya hay datos en el store, omitiendo fetch card");
    //   return;
    // }
    try {
      const data = await getCards();
      if (data) {
        setCards(data);
      } else {
        toast.error("No se pudieron cargar las tarjetas");
      }
    } catch (error) {
      console.error("Error obteniendo las cards:", error);
      toast.error("No se pudieron cargar las tarjetas");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCards]);

  useEffect(() => {
    fetchCards();
  }, [fetchCards]);

  // estados y const de CREATE Card
  const [openCreateCard, setOpenCreateCard] = useState<boolean>(false);

  const handleCardClose = () => {
    setOpenCreateCard(false);
  };

  const handleCardSave = async (
    newCard: Omit<Cards, "id" | "created_at" | "update_at">
  ) => {
    try {
      const created = await addCard(newCard);
      if (created) {
        toast.success("Tarjeta guardada correctamente");
        addCardToStore(created);
        handleCardClose();
      }
    } catch (error) {
      console.error("Error al guardar tarjeta:", error);
      toast.error("No se pudo guardar la tarjeta");
    }
  };

  // estados y const de EDIT Card
  const [openEditCard, setOpenEditCard] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<Cards | null>(null);

  // const handleOpenEditCard = (card: Cards) => {
  //   setSelectedCard(card);
  //   setOpenEditCard(true);
  // };

  const handleCloseEditCard = () => {
    setSelectedCard(null);
    setOpenEditCard(false);
  };

  const handleEditCardSave = async (updatedCard: Cards) => {
    try {
      const edited = await updateCard(updatedCard.id, {
        label: updatedCard.label,
        card_number: updatedCard.card_number,
        card_holder_name: updatedCard.card_holder_name,
        expiry_month: updatedCard.expiry_month,
        expiry_year: updatedCard.expiry_year,
        is_default: updatedCard.is_default,
      });

      toast.success("Tarjeta actualizada correctamente");
      updateCardInStore(updatedCard.id, edited);
      handleCloseEditCard();

      handleCloseEditCard();
    } catch (error) {
      console.error("Error al editar tarjeta:", error);
      toast.error("No se pudo actualizar la tarjeta");
    }
  };

  // estados y const de DELETE Card
  const [openDeleteCard, setOpenDeleteCard] = useState(false);

  // const handleOpenDeleteCard = (card: Cards) => {
  //   setSelectedCard(card);
  //   setOpenDeleteCard(true);
  // };

  const handleCloseDeleteCard = () => {
    setOpenEditCard(false);
    setOpenDeleteCard(false);
    setSelectedCard(null);
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(cardId);
      deleteCardFromStore(cardId);
      toast.success("Tarjeta eliminada correctamente");
      handleCloseDeleteCard();
    } catch (error) {
      console.error("Error al eliminar tarjeta:", error);
      toast.error("No se pudo eliminar la tarjeta");
    }
  };

  // LOGGOUT----------------------
  const handleLogout = () => {
    clearAuth();
    clearProfile();
    localStorage.removeItem("profile-storage");
    localStorage.removeItem("cards-storage");
    localStorage.removeItem("detail-store");
    logout();
    navigate("/auth/login");
  };

  const linkItems = [
    //{ to: "/", label: "Inicio", icon: HiHome },
    // { to: "/mypets", label: "Mis Mascotas", icon: FaPaw },
    { to: "/address", label: "Mis Direcciones", icon: HiMapPin },
    { to: "/cards", label: "Métodos de pago", icon: FaCreditCard },

    // { to: "/libro", label: "Libro de Reclamaciones", icon: FaBook },
  ];

  return (
    <div className="flex flex-col items-center justify-start pt-4 bg-white h-fit min-h-screen">
      {/* Body */}
      <div className="w-full max-w-md rounded-xl flex flex-col mb-2">
        {/* perfil */}
        <div className="flex flex-col items-center gap-y-4">
          <span className="text-xl font-bold text-[#D86C00]">
            ¡Hola,{" "}
            {loading ? (
              <Skeleton className="inline-block h-6 w-32 align-middle rounded" />
            ) : (
              `${profile.full_name.split(" ")[0]} ${profile.full_name.split(" ")[1]}`
            )}
            !
          </span>
          <AvatarUploader
            defaultImage={user_demo}
            avatarUrl={profile.avatar_url}
            onAvatarChange={(newUrl) => setProfile({ avatar_url: newUrl })}
          />
        </div>

        {/* datos */}
        <div className="flex flex-col">
          {/* Información */}
          <h2 className="mt-4 text-lg font-semibold">Información</h2>
          <div className="w-full flex rounded-xl bg-gray-200 py-4">
            <div className="w-[65%] space-y-2 pl-4">
              <div className="text-xs flex items-center gap-x-2">
                <BiSolidEnvelope className="size-6" />
                {loading ? (
                  <Skeleton className="inline-block h-6 w-32 align-middle rounded" />
                ) : (
                  <span className="truncate w-[22ch]">
                    {profile.email || ""}
                  </span>
                )}
              </div>
              <div className="text-xs flex items-center gap-x-2 ml-1">
                <MdPhoneEnabled className="size-[17px] rotate-225" />
                {loading ? (
                  <Skeleton className="inline-block h-6 w-32 align-middle rounded" />
                ) : (
                  profile.phone || "Sin número"
                )}
              </div>
            </div>
            <div className="w-[35%] flex justify-center items-center">
              <Button
                onClick={() => setOpenProfile(true)}
                className="bg-black text-white rounded-lg font-light px-6"
              >
                Editar
              </Button>
            </div>
          </div>

          <hr className="mt-6 bg-gray-600" />

          {linkItems.map(({ to, label, icon: Icon }) => {
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "flex justify-between items-center py-3 cursor-pointer"
                )}
              >
                <div className="flex items-center gap-x-2">
                  <Icon />
                  <span className="text-base font-normal">{label}</span>
                </div>
                <IoIosArrowForward />
              </Link>
            );
          })}

          <hr className="mt-6 bg-gray-600 hidden" />

          {/* Medio de pago frecuente */}
          {/* <div className="flex flex-col gap-y-2">
            <div className="ml-4 mt-4 text-base font-bold flex justify-between">
              Medios de pago
              <button
                onClick={() => setOpenCreateCard(true)}
                className="flex items-center gap-x-1 text-[11px] font-semibold"
              >
                <MdAddCard className="size-6" /> Añadir
              </button>
            </div>

            {listCards.length > 0 ? (
              <div className="w-full max-h-[120px] flex flex-col gap-y-3 overflow-y-scroll">
                {listCards.map((card) => (
                  <div key={card.id} className="flex items-center gap-x-2">
                    <div className="w-full flex rounded-xl bg-gray-200 py-4">
                      <div className="w-[28%] flex justify-center items-center">
                        <div className="w-12 h-8 flex flex-col rounded-[0.2rem] overflow-hidden">
                          <div className="w-full h-[20%] bg-sky-600"></div>
                          <div className="w-full h-[20%] bg-black"></div>
                          <div className="w-full h-[60%] bg-sky-600"></div>
                        </div>
                      </div>
                      <div className="w-[72%] flex items-center justify-between pl-3 pr-5 border-l-[2px] border-gray-500">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-[#D86C00]">
                            {card.label}
                          </div>
                          <div className="text-sm flex items-center gap-x-2 ml-1">
                            VISA <MaskedCard cardNumber={card.card_number} />
                          </div>
                        </div>

                        <button
                          onClick={() => handleOpenEditCard(card)}
                          className="size-5 flex items-center justify-center rounded-full bg-black"
                        >
                          <HiPencil className="size-3 text-gray-200" />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => handleOpenDeleteCard(card)}>
                      <FaRegTrashAlt className="size-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full flex rounded-xl bg-gray-200 opacity-90 py-4">
                <div className="w-[35%] flex justify-center items-center">
                  <div className="w-12 h-8 flex flex-col rounded-[0.2rem] overflow-hidden grayscale">
                    <div className="w-full h-[20%] bg-sky-600"></div>
                    <div className="w-full h-[20%] bg-black"></div>
                    <div className="w-full h-[60%] bg-sky-600"></div>
                  </div>
                </div>
                <div className="w-[65%] flex items-center justify-between pl-4 pr-5 border-l-[2px] border-gray-500">
                  <div className="space-y-2">
                    <div className="w-20 h-4 rounded-2xl bg-gray-300" />
                    <div className="w-40 h-4 rounded-2xl bg-gray-300" />
                  </div>
                </div>
              </div>
            )}
          </div> */}

          <hr className="mt-6 bg-gray-600" />

          {/* Historial */}
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

          {/* favoritos */}
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

      {/* Modal de edición de perfil */}
      <Modal isOpen={openProfile} onClose={handleCloseProfile}>
        <ProfileEditForm
          profileData={profile}
          onEdit={handleEditProfile}
          onClose={handleCloseProfile}
        />
      </Modal>

      {/* Modal para CREAR tarjeta - usa newCardData */}
      <Modal isOpen={openCreateCard} onClose={handleCardClose}>
        <CardCreateForm onSave={handleCardSave} onClose={handleCardClose} />
      </Modal>

      {/* Modal para EDITAR tarjeta - usa editingCardData */}
      {selectedCard && (
        <Modal isOpen={openEditCard} onClose={handleCloseEditCard}>
          <CardEditForm
            cardData={selectedCard}
            onEdit={handleEditCardSave}
            onClose={handleCloseEditCard}
          />
        </Modal>
      )}

      {selectedCard && openDeleteCard && (
        <Modal isOpen={openDeleteCard} onClose={handleCloseDeleteCard}>
          <CardDeleteDialog
            selectedCard={selectedCard}
            onClose={handleCloseDeleteCard}
            onDelete={handleDeleteCard}
          />
        </Modal>
      )}

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
