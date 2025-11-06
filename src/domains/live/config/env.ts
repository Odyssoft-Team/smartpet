export const env = {
  SIGNALING_URL: import.meta.env.VITE_SIGNALING_URL || "ws://localhost:8080/ws",
  STUN_SERVER:
    import.meta.env.VITE_STUN_SERVER || "stun:stun.l.google.com:19302",
};
