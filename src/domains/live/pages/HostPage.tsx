import { useHostStream } from "../hooks/useHostStream";

export default function HostPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const room = searchParams.get("room") ?? "";
  const { localVideo } = useHostStream(room);

  return (
    <div className="p-6">
      <h1>🎥 Host (Cuidador)</h1>
      <video ref={localVideo} autoPlay playsInline muted width={640} />
    </div>
  );
}
