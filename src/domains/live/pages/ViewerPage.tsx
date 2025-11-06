import { useState } from "react";
import { useViewerStream } from "../hooks/useViewerStream";

export default function ViewerPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const room = searchParams.get("room") ?? "";
  const { remoteVideo } = useViewerStream(room);
  const [needsPlay, setNeedsPlay] = useState(false);

  const handleEnable = async () => {
    try {
      await remoteVideo.current?.play();
      setNeedsPlay(false);
      console.log("▶️ Reproducción manual iniciada");
    } catch (err) {
      console.warn("⚠️ No se pudo iniciar la reproducción:", err);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center gap-4">
      <h1 className="text-xl font-semibold">👀 Viewer (Usuario)</h1>

      <video
        ref={remoteVideo}
        autoPlay
        playsInline
        muted={false}
        width={640}
        className="bg-black rounded-xl"
        onPlay={() => setNeedsPlay(false)}
        onPause={() => setNeedsPlay(true)}
      />

      {needsPlay && (
        <button
          onClick={handleEnable}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          🔊 Habilitar transmisión
        </button>
      )}
    </div>
  );
}
