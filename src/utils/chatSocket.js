import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5200";

let socket = null;

export const connectChatSocket = () => {
  // Already connected
  if (socket?.connected) {
    return socket;
  }

  // Socket already exists but disconnected
  if (socket) {
    socket.connect();
    return socket;
  }

  // Create socket
  socket = io(SOCKET_URL, {
    withCredentials: true,

    autoConnect: true,

    transports: ["websocket", "polling"],

    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socket;
};

export const getChatSocket = () => {
  return socket;
};

/**
 * Disconnect socket during logout
 */
export const disconnectChatSocket = () => {
  if (!socket) {
    return;
  }

  // Prevent automatic reconnection after logout
  socket.disconnect();

  socket = null;
};

export const joinConversation = (conversationId) => {
  if (!socket?.connected || !conversationId) {
    return;
  }

  socket.emit("conversation:join", {
    conversationId,
  });
};

export const leaveConversation = (conversationId) => {
  if (!socket?.connected || !conversationId) {
    return;
  }

  socket.emit("conversation:leave", {
    conversationId,
  });
};

export const sendSocketMessage = ({
  conversationId,
  text = "",
  attachments = [],
}) => {
  if (!socket?.connected) {
    console.warn("Cannot send message. Socket is not connected.");

    return false;
  }

  if (!conversationId) {
    return false;
  }

  socket.emit("message:send", {
    conversationId,
    text,
    attachments,
  });

  return true;
};

export const sendTypingStart = (conversationId) => {
  if (!socket?.connected || !conversationId) {
    return;
  }

  socket.emit("typing:start", {
    conversationId,
  });
};

export const sendTypingStop = (conversationId) => {
  if (!socket?.connected || !conversationId) {
    return;
  }

  socket.emit("typing:stop", {
    conversationId,
  });
};

export const sendMessageRead = (conversationId) => {
  if (!socket?.connected || !conversationId) {
    return;
  }

  socket.emit("message:read", {
    conversationId,
  });
};

export default {
  connectChatSocket,
  getChatSocket,
  disconnectChatSocket,
  joinConversation,
  leaveConversation,
  sendSocketMessage,
  sendTypingStart,
  sendTypingStop,
  sendMessageRead,
};
