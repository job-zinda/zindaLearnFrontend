import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      transports: ["websocket"],
    });
  }
  return socket;
}

export function connectSocket() {
  const token = localStorage.getItem("token");
  const socket = getSocket();

  socket.auth = { token };

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
}