import { FaChevronLeft } from "react-icons/fa";

export default function NotificationPage() {
  return (
    <div className="w-full flex flex-col gap-6 items-center justify-center overflow-hidden">
      <div className="w-full flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-bold text-lg w-full text-start">
          <FaChevronLeft />
          Notificaciones
        </h2>
      </div>
    </div>
  );
}
