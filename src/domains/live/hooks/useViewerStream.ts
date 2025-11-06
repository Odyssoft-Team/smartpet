import { useEffect, useRef } from "react";
import { env } from "../config/env";

export function useViewerStream(room: string) {
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<number | null>(null);
  const messageQueue = useRef<string[]>([]); // 🧩 Cola de mensajes

  useEffect(() => {
    if (!room) return;

    const signalingUrl = env.SIGNALING_URL;
    const stunServer = env.STUN_SERVER;

    const sendQueued = (msg: object): void => {
      const json = JSON.stringify(msg);
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(json);
      } else {
        messageQueue.current.push(json);
      }
    };

    const flushQueue = (): void => {
      const ws = wsRef.current;
      while (
        ws &&
        ws.readyState === WebSocket.OPEN &&
        messageQueue.current.length > 0
      ) {
        const msg = messageQueue.current.shift();
        if (msg) ws.send(msg);
      }
    };

    const setupWebSocket = () => {
      const ws = new WebSocket(`${signalingUrl}?room=${room}&role=viewer`);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("🔌 WebSocket conectado (Viewer)");
        flushQueue();
      };

      ws.onclose = () => {
        console.warn("⚠️ WebSocket cerrado (Viewer), intentando reconectar...");
        reconnectTimeout.current = window.setTimeout(setupWebSocket, 1500);
      };

      ws.onmessage = async (ev) => {
        const msg = JSON.parse(ev.data);

        if (msg.offer) {
          console.log("📩 Viewer recibió offer del Host");

          if (pcRef.current) {
            pcRef.current.close();
          }

          const pc = await createPeerConnection();
          await pc.setRemoteDescription(new RTCSessionDescription(msg.offer));

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          sendQueued({ answer, room });
          console.log("📤 Viewer envió answer");
        }

        if (msg.iceCandidate) {
          try {
            await pcRef.current?.addIceCandidate(
              new RTCIceCandidate(msg.iceCandidate)
            );
            console.log("🧊 Viewer agregó ICE remoto");
          } catch (e) {
            console.warn("⚠️ Error al agregar ICE:", e);
          }
        }
      };
    };

    const createPeerConnection = async (): Promise<RTCPeerConnection> => {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: stunServer }],
      });
      pcRef.current = pc;

      pc.ontrack = (e) => {
        console.log("🎬 Viewer recibió stream remoto");
        if (remoteVideo.current) {
          remoteVideo.current.srcObject = e.streams[0];
          const playPromise = remoteVideo.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => {
              // ⚠️ Si el navegador bloquea el autoplay, lo manejamos desde el botón
              console.warn(
                "🔇 Autoplay bloqueado, se requiere interacción del usuario"
              );
            });
          }
        }
      };

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          sendQueued({ iceCandidate: e.candidate.toJSON(), room });
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
