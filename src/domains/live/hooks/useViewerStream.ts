import { useEffect, useRef } from "react";
import { env } from "../config/env";

export function useViewerStream(room: string) {
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<number | null>(null);

  useEffect(() => {
    if (!room) return;

    const signalingUrl = env.SIGNALING_URL;
    const stunServer = env.STUN_SERVER;

    const setupWebSocket = () => {
      const ws = new WebSocket(`${signalingUrl}?room=${room}&role=viewer`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("🔌 WebSocket conectado (Viewer)");
      };

      ws.onclose = () => {
        console.warn("⚠️ WebSocket cerrado (Viewer), intentando reconectar...");
        reconnectTimeout.current = window.setTimeout(setupWebSocket, 1500);
      };

      ws.onmessage = async (ev) => {
        const msg = JSON.parse(ev.data);

        if (msg.type === "offer") {
          console.log("📩 Viewer recibió offer del Host");

          if (pcRef.current) {
            pcRef.current.close();
          }

          const pc = await createPeerConnection();
          await pc.setRemoteDescription(new RTCSessionDescription(msg.data));

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          ws.send(JSON.stringify({ type: "answer", data: answer }));
          console.log("📤 Viewer envió answer");
        }

        if (msg.type === "ice") {
          try {
            await pcRef.current?.addIceCandidate(msg.data);
            console.log("🧊 Viewer agregó ICE remoto");
          } catch (e) {
            console.warn("⚠️ Error al agregar ICE:", e);
          }
        }
      };
    };

    const createPeerConnection = async () => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: stunServer }],
      });
      pcRef.current = pc;

      pc.ontrack = (e) => {
        console.log("🎬 Viewer recibió stream remoto");
        const stream = e.streams[0];
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = stream;
        }
      };

      pc.onicecandidate = (e) => {
        if (e.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({ type: "ice", data: e.candidate })
          );
        }
      };

      return pc;
    };

    setupWebSocket();

    return () => {
      wsRef.current?.close();
      pcRef.current?.close();
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    };
  }, [room]);

  return { remoteVideo };
}
