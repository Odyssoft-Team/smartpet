export interface SignalingMessage {
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  iceCandidate?: RTCIceCandidateInit;
  room?: string;
}

/**
 * Crea una conexión WebSocket con tipado seguro para mensajes de señalización.
 */
export function createSignalingConnection(
  url: string,
  onMessage: (msg: SignalingMessage) => void
): WebSocket {
  const ws = new WebSocket(url);
  ws.onmessage = (event: MessageEvent<string>) => {
    try {
      const data: SignalingMessage = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error("❌ Error parsing signaling message:", error);
    }
  };
  return ws;
}
