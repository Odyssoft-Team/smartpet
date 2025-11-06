import { useState } from "react";
import { generateRoomId } from "../utils/generateRoomId";

export default function LiveHome() {
  const [room, setRoom] = useState(generateRoomId());
  const baseUrl = window.location.origin;

  const hostUrl = `${baseUrl}/live/host?room=${room}`;
  const viewerUrl = `${baseUrl}/live/viewer?room=${room}`;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("✅ Enlace copiado al portapapeles");
  };

  return (
    <div className="p-10 text-center bg-gray-100 min-h-screen">
      <h1 className="text-2xl mb-4">🐾 Streaming Demo (PET)</h1>

      <p className="mb-2">
        <strong>Código de reunión:</strong> {room}
      </p>

      <button
        onClick={() => setRoom(generateRoomId())}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        🔁 Generar nuevo código
      </button>

      <div className="flex justify-center gap-6 flex-wrap">
        <Card title="🎥 Host (Cuidador)" url={hostUrl} copy={copyToClipboard} />
        <Card
          title="👁 Viewer (Dueño)"
          url={viewerUrl}
          copy={copyToClipboard}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  url,
  copy,
}: {
  title: string;
  url: string;
  copy: (t: string) => void;
}) {
  return (
    <div className="bg-white shadow p-6 rounded-lg w-64">
      <h2 className="text-lg mb-4">{title}</h2>
      <button
        onClick={() => window.open(url, "_blank")}
        className="block w-full bg-green-500 text-white py-2 rounded mb-2"
      >
        Entrar
      </button>
      <button
        onClick={() => copy(url)}
        className="block w-full bg-gray-200 py-2 rounded"
      >
        Copiar enlace
      </button>
    </div>
  );
}
