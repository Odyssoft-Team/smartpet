import { useViewerStream } from "../hooks/useViewerStream";

export default function ViewerPage() {
  const searchParams = new URLSearchParams(window.location.search);
  const room = searchParams.get("room") ?? "";
  const { remoteVideo } = useViewerStream(room);

  return (
    <div className="p-6">
      <h1>👀 Viewer (Dueño)</h1>
      <video ref={remoteVideo} autoPlay playsInline width={640} />
    </div>
  );
}
