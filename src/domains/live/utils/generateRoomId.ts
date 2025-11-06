export function generateRoomId(): string {
  return `room-${Math.random().toString(36).substring(2, 8)}`;
}
