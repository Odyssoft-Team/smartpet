import { useEffect, useRef } from "react";
import {
  createSignalingConnection,
  type SignalingMessage,
} from "../utils/signaling";
import { env } from "../config/env";

/**
 * Hook para manejar la transmisión del cuidador (empresa).
 * Obtiene la cámara, crea la conexión RTCPeerConnection y envía la oferta.
 */
export function useHostStream(room: string) {
  const localVideo = useRef<HTMLVideoElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const messageQueue = useRef<string[]>([]); // 🧩 Cola de mensajes

  useEffect(() => {
    async function startStreaming(): Promise<void> {
      try {
        // 🎥 Acceder a cámara y micrófono
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // 🔗 Asignar stream al video local
        if (localVideo.current) {
          localVideo.current.srcObject = stream;
        }

        // ⚙️ Crear conexión RTCPeerConnection
        const pc = new RTCPeerConnection({
          iceServers: [{ urls: env.STUN_SERVER }],
        });
        pcRef.current = pc;

        // 🎬 Agregar tracks al PeerConnection
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // 🌐 Crear conexión WebSocket
        const ws = createSignalingConnection(
          `${env.SIGNALING_URL}?room=${room}&role=host`,
          (msg: SignalingMessage) => {
            if (msg.answer) {
              void pc.setRemoteDescription(
                new RTCSessionDescription(msg.answer)
              );
            } else if (msg.iceCandidate) {
              void pc.addIceCandidate(new RTCIceCandidate(msg.iceCandidate));
            }
          }
        );
        wsRef.current = ws;

        // ✅ Enviar mensajes (usa cola si el socket aún no está abierto)
        const sendQueued = (msg: object): void => {
          const json = JSON.stringify(msg);
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(json);
          } else {
            messageQueue.current.push(json);
          }
        };

        ws.onopen = () => {
          console.log("🔌 WebSocket conectado (Host)");
          // Enviar cualquier mensaje pendiente
          while (messageQueue.current.length > 0) {
            const msg = messageQueue.current.shift();
            if (msg) ws.send(msg);
          }
        };

        // 📤 Enviar candidatos ICE
        pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
          if (event.candidate) {
            const payload: SignalingMessage = {
              iceCandidate: event.candidate.toJSON(),
              room,
            };
            sendQueued(payload);
          }
        };

        // 📡 Crear y enviar la oferta
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const payload: SignalingMessage = { offer, room };
        sendQueued(payload);
        console.log("📤 Host envió offer");
      } catch (error) {
        console.error("🚫 Error al iniciar transmisión:", error);
      }
    }

    void startStreaming();

    return () => {
      wsRef.current?.close();
      pcRef.current?.close();
    };
  }, [room]);

  return { localVideo };
}
