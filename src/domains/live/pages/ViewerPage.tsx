import { useViewerStream } from "../hooks/useViewerStream";

export default function ViewerPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const room = searchParams.get("room") ?? "";
  const { remoteVideo } = useViewerStream(room);

  return (
    <div className="p-6">
      <h1>👀 Viewer (Dueño)</h1>
      {/* <video ref={remoteVideo} autoPlay playsInline width={640} /> */}
      <video
        ref={remoteVideo}
        autoPlay
        playsInline
        muted={false} // puede probarse true si el navegador bloquea autoplay
        width={640}
        className="bg-black rounded-xl"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
}
