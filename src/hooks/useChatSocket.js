import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

import {
  connectChatSocket,
  getChatSocket,
  disconnectChatSocket,
  joinConversation,
  leaveConversation,
  sendSocketMessage,
  sendTypingStart,
  sendTypingStop,
  sendMessageRead,
} from "../utils/chatSocket";

import {
  handleSocketNewMessage,
  handleSocketConversationUpdated,
  updateMessageStatus,
  markConversationMessagesRead,
  setTyping,
  setSocketConnected,
  setUserOnline,
  setUserOffline,
  setAdminOnline,
  setAdminOffline,
} from "../redux/slices/chatSlice";
import toast from "react-hot-toast";

export default function useChatSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = connectChatSocket();

    if (!socket) {
      return;
    }

    // CONNECT

    const handleConnect = () => {
      dispatch(setSocketConnected(true));
    };

    // DISCONNECT

    const handleDisconnect = (reason) => {
      dispatch(setSocketConnected(false));
    };

    // CONNECTION ERROR

    const handleConnectError = (error) => {
      dispatch(setSocketConnected(false));
    };

    // NEW MESSAGE

    const handleNewMessage = ({ message }) => {
      if (!message?._id) {
        return;
      }

      dispatch(handleSocketNewMessage(message));
    };

    // ADMIN NEW MESSAGE
    // This is VERY IMPORTANT.
    // Backend sends this to "admins" room.

    const handleAdminNewMessage = ({
      conversationId,
      message,
      conversation,
    }) => {
      if (!conversationId || !message?._id) {
        return;
      }

      // Add message
      dispatch(handleSocketNewMessage(message));

      // Update admin conversation list
      if (conversation?._id) {
        dispatch(handleSocketConversationUpdated(conversation));
      }
    };

    // USER NEW MESSAGE
    // Backend sends this to user's personal room.

    const handleUserNewMessage = ({
      conversationId,
      message,
      conversation,
    }) => {
      if (!conversationId || !message?._id) {
        return;
      }

      dispatch(handleSocketNewMessage(message));

      if (conversation?._id) {
        dispatch(handleSocketConversationUpdated(conversation));
      }
    };

    // =====================================================
    // CONVERSATION UPDATED
    // =====================================================

    const handleConversationUpdated = ({ conversation }) => {
      if (!conversation?._id) {
        return;
      }

      dispatch(handleSocketConversationUpdated(conversation));
    };

    // MESSAGE DELIVERED

    const handleMessageDelivered = ({ conversationId, messageId }) => {
      if (!conversationId || !messageId) {
        return;
      }

      dispatch(
        updateMessageStatus({
          conversationId,
          messageId,
          messageStatus: "delivered",
        }),
      );
    };

    // MESSAGE READ

    const handleMessageReadUpdate = ({
      conversationId,
      readerType,
      modifiedCount,
    }) => {
      if (!conversationId) {
        return;
      }

      dispatch(
        markConversationMessagesRead({
          conversationId,
          readerType,
          modifiedCount,
        }),
      );
    };

    // TYPING START

    const handleTypingStart = ({ conversationId, userId, userType }) => {
      if (!conversationId || !userId) {
        return;
      }

      dispatch(
        setTyping({
          conversationId,
          userId,
          userType,
          isTyping: true,
        }),
      );
    };

    // TYPING STOP

    const handleTypingStop = ({ conversationId, userId, userType }) => {
      if (!conversationId || !userId) {
        return;
      }

      dispatch(
        setTyping({
          conversationId,
          userId,
          userType,
          isTyping: false,
        }),
      );
    };

    // =====================================================
    // CONVERSATION JOINED
    // =====================================================

    const handleConversationJoined = ({ conversationId }) => {};

    // =====================================================
    // CONVERSATION ERROR
    // =====================================================

    const handleConversationError = ({ message }) => {};

    // =====================================================
    // MESSAGE ERROR
    // =====================================================

    const handleMessageError = ({ message }) => {};

    // =====================================================
    // USER ONLINE
    // =====================================================

    const handleUserOnline = ({ userId }) => {
      if (!userId) {
        return;
      }

      dispatch(setUserOnline(userId));
    };

    // =====================================================
    // USER OFFLINE
    // =====================================================

    const handleUserOffline = ({ userId }) => {
      if (!userId) {
        return;
      }

      dispatch(setUserOffline(userId));
    };

    // =====================================================
    // ADMIN ONLINE
    // =====================================================

    const handleAdminOnline = ({ adminId }) => {
      if (!adminId) {
        return;
      }

      dispatch(setAdminOnline(adminId));
    };

    // =====================================================
    // ADMIN OFFLINE
    // =====================================================

    const handleAdminOffline = ({ adminId }) => {
      if (!adminId) {
        return;
      }

      dispatch(setAdminOffline(adminId));
    };

    // =====================================================
    // REGISTER EVENTS
    // =====================================================

    socket.on("connect", handleConnect);

    socket.on("disconnect", handleDisconnect);

    socket.on("connect_error", handleConnectError);

    socket.on("conversation:joined", handleConversationJoined);

    socket.on("conversation:error", handleConversationError);

    socket.on("message:new", handleNewMessage);

    socket.on("admin:new-message", handleAdminNewMessage);

    socket.on("user:new-message", handleUserNewMessage);

    socket.on("conversation:updated", handleConversationUpdated);

    socket.on("message:delivered", handleMessageDelivered);

    socket.on("message:read:update", handleMessageReadUpdate);

    socket.on("typing:start", handleTypingStart);

    socket.on("typing:stop", handleTypingStop);

    socket.on("message:error", handleMessageError);

    socket.on("user:online", handleUserOnline);

    socket.on("user:offline", handleUserOffline);

    socket.on("admin:online", handleAdminOnline);

    socket.on("admin:offline", handleAdminOffline);

    // =====================================================
    // ALREADY CONNECTED
    // =====================================================

    if (socket.connected) {
      dispatch(setSocketConnected(true));
    }

    // =====================================================
    // CLEANUP
    // =====================================================

    return () => {
      socket.off("connect", handleConnect);

      socket.off("disconnect", handleDisconnect);

      socket.off("connect_error", handleConnectError);

      socket.off("conversation:joined", handleConversationJoined);

      socket.off("conversation:error", handleConversationError);

      socket.off("message:new", handleNewMessage);

      socket.off("admin:new-message", handleAdminNewMessage);

      socket.off("user:new-message", handleUserNewMessage);

      socket.off("conversation:updated", handleConversationUpdated);

      socket.off("message:delivered", handleMessageDelivered);

      socket.off("message:read:update", handleMessageReadUpdate);

      socket.off("typing:start", handleTypingStart);

      socket.off("typing:stop", handleTypingStop);

      socket.off("message:error", handleMessageError);

      socket.off("user:online", handleUserOnline);

      socket.off("user:offline", handleUserOffline);

      socket.off("admin:online", handleAdminOnline);

      socket.off("admin:offline", handleAdminOffline);
    };
  }, [dispatch]);

  // =====================================================
  // CONNECT
  // =====================================================

  const connectSocket = useCallback(() => {
    const socket = connectChatSocket();

    if (socket?.connected) {
      dispatch(setSocketConnected(true));
    }

    return socket;
  }, [dispatch]);

  // =====================================================
  // DISCONNECT
  // =====================================================

  const disconnectSocket = useCallback(() => {
    disconnectChatSocket();

    dispatch(setSocketConnected(false));
  }, [dispatch]);

  // =====================================================
  // JOIN
  // =====================================================

  const handleJoinConversation = useCallback((conversationId) => {
    if (!conversationId) {
      return;
    }

    let socket = getChatSocket();

    if (!socket) {
      socket = connectChatSocket();
    }

    if (socket?.connected) {
      joinConversation(conversationId);
      return;
    }

    if (!socket) {
      return;
    }

    const handleConnect = () => {
      joinConversation(conversationId);

      socket.off("connect", handleConnect);
    };

    socket.once("connect", handleConnect);
  }, []);

  // =====================================================
  // LEAVE
  // =====================================================

  const handleLeaveConversation = useCallback((conversationId) => {
    if (!conversationId) {
      return;
    }

    leaveConversation(conversationId);
  }, []);

  // =====================================================
  // SEND MESSAGE
  // =====================================================

  const sendMessage = useCallback(
    ({ conversationId, text = "", attachments = [] }) => {
      if (!conversationId) {
        return false;
      }

      return sendSocketMessage({
        conversationId,
        text,
        attachments,
      });
    },
    [],
  );

  // =====================================================
  // TYPING START
  // =====================================================

  const startTyping = useCallback((conversationId) => {
    if (!conversationId) {
      return;
    }

    sendTypingStart(conversationId);
  }, []);

  // =====================================================
  // TYPING STOP
  // =====================================================

  const stopTyping = useCallback((conversationId) => {
    if (!conversationId) {
      return;
    }

    sendTypingStop(conversationId);
  }, []);

  // =====================================================
  // READ
  // =====================================================

  const markMessagesRead = useCallback((conversationId) => {
    if (!conversationId) {
      return;
    }

    sendMessageRead(conversationId);
  }, []);

  // =====================================================
  // GET SOCKET
  // =====================================================

  const getSocket = useCallback(() => {
    return getChatSocket();
  }, []);

  // =====================================================
  // RETURN
  // =====================================================

  return {
    socket: getChatSocket(),

    connectSocket,
    disconnectSocket,

    joinConversation: handleJoinConversation,
    leaveConversation: handleLeaveConversation,

    sendMessage,

    startTyping,
    stopTyping,

    markMessagesRead,

    getSocket,
  };
}
