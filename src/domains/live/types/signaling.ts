export interface SignalMessage {
  type: "offer" | "answer" | "ice" | "peer-joined";
  data: RTCSessionDescriptionInit | RTCIceCandidateInit;
}
