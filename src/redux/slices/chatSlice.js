import { createSlice } from "@reduxjs/toolkit";

import {
  getUserConversations,
  getOrCreateConversation,
  getUserConversation,
  getUserMessages,
  markUserMessagesRead,
  getAdminConversations,
  getAdminConversation,
  getAdminMessages,
  assignConversation,
  markAdminMessagesRead,
  closeConversation,
  reopenConversation,
  unassignConversation,
  deleteConversation,
  uploadChatAttachments,
} from "../thunks/chatThunk";

const initialState = {
  // =========================================================
  // USER
  // =========================================================

  userConversations: [],
  activeUserConversation: null,
  userMessages: [],

  userConversationsLoading: false,
  userConversationLoading: false,
  userMessagesLoading: false,

  userMessagesPagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  },

  // =========================================================
  // ADMIN
  // =========================================================

  adminConversations: [],
  activeAdminConversation: null,
  adminMessages: [],

  adminConversationsLoading: false,
  adminConversationLoading: false,
  adminMessagesLoading: false,

  adminMessagesPagination: {
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  },

  // =========================================================
  // CHAT STATE
  // =========================================================

  socketConnected: false,

  // {
  //   [conversationId]: {
  //     userId,
  //     userType,
  //     isTyping
  //   }
  // }
  typing: {},

  // online users
  onlineUsers: {},

  // online admins
  onlineAdmins: {},

  // =========================================================
  // ACTION STATES
  // =========================================================

  assigning: false,
  closing: false,
  reopening: false,
  unassigning: false,
  deleting: false,

  uploadingAttachments: false,

  // =========================================================
  // ERROR / SUCCESS
  // =========================================================

  error: null,
  success: false,
  message: "",
};

const chatSlice = createSlice({
  name: "chat",

  initialState,

  reducers: {
    // =======================================================
    // ACTIVE USER CONVERSATION
    // =======================================================

    setActiveUserConversation: (state, action) => {
      state.activeUserConversation = action.payload || null;

      // Keep only active conversation messages
      state.userMessages = [];
    },

    clearActiveUserConversation: (state) => {
      state.activeUserConversation = null;
      state.userMessages = [];
    },

    // =======================================================
    // ACTIVE ADMIN CONVERSATION
    // =======================================================

    setActiveAdminConversation: (state, action) => {
      state.activeAdminConversation = action.payload || null;

      // Clear old messages
      state.adminMessages = [];
    },

    clearActiveAdminConversation: (state) => {
      state.activeAdminConversation = null;
      state.adminMessages = [];
    },

    // =======================================================
    // SET USER MESSAGES
    // =======================================================

    setUserMessages: (state, action) => {
      state.userMessages = Array.isArray(action.payload) ? action.payload : [];
    },

    // =======================================================
    // SET ADMIN MESSAGES
    // =======================================================

    setAdminMessages: (state, action) => {
      state.adminMessages = Array.isArray(action.payload) ? action.payload : [];
    },

    // =======================================================
    // SOCKET CONNECTION
    // =======================================================

    setSocketConnected: (state, action) => {
      state.socketConnected = Boolean(action.payload);
    },

    // =======================================================
    // SOCKET NEW MESSAGE
    // =======================================================

    handleSocketNewMessage: (state, action) => {
      const message = action.payload;

      if (!message?._id) {
        return;
      }

      const conversationId =
        message.conversationId?._id || message.conversationId;

      if (!conversationId) {
        return;
      }

      // -----------------------------------------------------
      // USER ACTIVE CONVERSATION
      // -----------------------------------------------------

      if (
        state.activeUserConversation?._id?.toString() ===
        conversationId.toString()
      ) {
        const exists = state.userMessages.some(
          (item) => item._id === message._id,
        );

        if (!exists) {
          state.userMessages.push(message);
        }
      }

      // -----------------------------------------------------
      // ADMIN ACTIVE CONVERSATION
      // -----------------------------------------------------

      if (
        state.activeAdminConversation?._id?.toString() ===
        conversationId.toString()
      ) {
        const exists = state.adminMessages.some(
          (item) => item._id === message._id,
        );

        if (!exists) {
          state.adminMessages.push(message);
        }
      }
    },

    // =======================================================
    // SOCKET CONVERSATION UPDATED
    // =======================================================

    handleSocketConversationUpdated: (state, action) => {
      const conversation = action.payload;

      if (!conversation?._id) {
        return;
      }

      const conversationId = conversation._id.toString();

      // -----------------------------------------------------
      // USER CONVERSATION LIST
      // -----------------------------------------------------

      const userIndex = state.userConversations.findIndex(
        (item) => item._id?.toString() === conversationId,
      );

      if (userIndex !== -1) {
        state.userConversations[userIndex] = conversation;
      }

      // If not available, add it
      if (userIndex === -1) {
        state.userConversations.unshift(conversation);
      }

      // -----------------------------------------------------
      // ADMIN CONVERSATION LIST
      // -----------------------------------------------------

      const adminIndex = state.adminConversations.findIndex(
        (item) => item._id?.toString() === conversationId,
      );

      if (adminIndex !== -1) {
        state.adminConversations[adminIndex] = conversation;
      } else {
        state.adminConversations.unshift(conversation);
      }

      // -----------------------------------------------------
      // ACTIVE USER CONVERSATION
      // -----------------------------------------------------

      if (state.activeUserConversation?._id?.toString() === conversationId) {
        state.activeUserConversation = conversation;
      }

      // -----------------------------------------------------
      // ACTIVE ADMIN CONVERSATION
      // -----------------------------------------------------

      if (state.activeAdminConversation?._id?.toString() === conversationId) {
        state.activeAdminConversation = conversation;
      }
    },

    // =======================================================
    // MESSAGE STATUS
    // =======================================================

    updateMessageStatus: (state, action) => {
      const { conversationId, messageId, messageStatus } = action.payload || {};

      if (!conversationId || !messageId) {
        return;
      }

      // USER
      if (
        state.activeUserConversation?._id?.toString() ===
        conversationId.toString()
      ) {
        const message = state.userMessages.find(
          (item) => item._id?.toString() === messageId.toString(),
        );

        if (message) {
          message.messageStatus = messageStatus;

          if (messageStatus === "read") {
            message.isRead = true;
            message.readAt = new Date().toISOString();
          }
        }
      }

      // ADMIN
      if (
        state.activeAdminConversation?._id?.toString() ===
        conversationId.toString()
      ) {
        const message = state.adminMessages.find(
          (item) => item._id?.toString() === messageId.toString(),
        );

        if (message) {
          message.messageStatus = messageStatus;

          if (messageStatus === "read") {
            message.isRead = true;
            message.readAt = new Date().toISOString();
          }
        }
      }
    },

    // =======================================================
    // MARK CONVERSATION MESSAGES READ
    // =======================================================

    markConversationMessagesRead: (state, action) => {
      const { conversationId, readerType } = action.payload || {};

      if (!conversationId) {
        return;
      }

      // -----------------------------------------------------
      // USER READ
      // Means user read ADMIN messages
      // -----------------------------------------------------

      if (readerType === "user") {
        if (
          state.activeUserConversation?._id?.toString() ===
          conversationId.toString()
        ) {
          state.userMessages.forEach((message) => {
            if (message.senderType === "Admin") {
              message.messageStatus = "read";
              message.isRead = true;
            }
          });
        }

        const conversation = state.userConversations.find(
          (item) => item._id?.toString() === conversationId.toString(),
        );

        if (conversation) {
          conversation.unreadForUser = 0;
        }
      }

      // -----------------------------------------------------
      // ADMIN READ
      // Means admin read USER messages
      // -----------------------------------------------------

      if (readerType === "admin") {
        if (
          state.activeAdminConversation?._id?.toString() ===
          conversationId.toString()
        ) {
          state.adminMessages.forEach((message) => {
            if (message.senderType === "User") {
              message.messageStatus = "read";
              message.isRead = true;
            }
          });
        }

        const conversation = state.adminConversations.find(
          (item) => item._id?.toString() === conversationId.toString(),
        );

        if (conversation) {
          conversation.unreadForAdmin = 0;
        }
      }
    },

    // =======================================================
    // TYPING
    // =======================================================

    setTyping: (state, action) => {
      const { conversationId, userId, userType, isTyping } =
        action.payload || {};

      if (!conversationId || !userId) {
        return;
      }

      state.typing[conversationId] = {
        userId,
        userType,
        isTyping: Boolean(isTyping),
      };
    },

    // =======================================================
    // USER ONLINE
    // =======================================================

    setUserOnline: (state, action) => {
      const userId = action.payload;

      if (!userId) {
        return;
      }

      state.onlineUsers[userId] = true;
    },

    // =======================================================
    // USER OFFLINE
    // =======================================================

    setUserOffline: (state, action) => {
      const userId = action.payload;

      if (!userId) {
        return;
      }

      state.onlineUsers[userId] = false;
    },

    // =======================================================
    // ADMIN ONLINE
    // =======================================================

    setAdminOnline: (state, action) => {
      const adminId = action.payload;

      if (!adminId) {
        return;
      }

      state.onlineAdmins[adminId] = true;
    },

    // =======================================================
    // ADMIN OFFLINE
    // =======================================================

    setAdminOffline: (state, action) => {
      const adminId = action.payload;

      if (!adminId) {
        return;
      }

      state.onlineAdmins[adminId] = false;
    },

    // =======================================================
    // CLEAR ERROR
    // =======================================================

    clearChatError: (state) => {
      state.error = null;
    },

    clearChatSuccess: (state) => {
      state.success = false;
      state.message = "";
    },

    resetChatState: () => initialState,
  },

  // =========================================================
  // EXTRA REDUCERS
  // =========================================================

  extraReducers: (builder) => {
    // =======================================================
    // USER CONVERSATIONS
    // =======================================================

    builder
      .addCase(getUserConversations.pending, (state) => {
        state.userConversationsLoading = true;
        state.error = null;
      })

      .addCase(getUserConversations.fulfilled, (state, action) => {
        state.userConversationsLoading = false;

        state.userConversations = action.payload?.conversations || [];

        state.error = null;
      })

      .addCase(getUserConversations.rejected, (state, action) => {
        state.userConversationsLoading = false;
        state.error = action.payload || "Failed to get conversations";
      });

    // =======================================================
    // GET / CREATE USER CONVERSATION
    // =======================================================

    builder
      .addCase(getOrCreateConversation.pending, (state) => {
        state.userConversationLoading = true;
        state.error = null;
      })

      .addCase(getOrCreateConversation.fulfilled, (state, action) => {
        state.userConversationLoading = false;

        const conversation =
          action.payload?.conversation ||
          action.payload?.data ||
          action.payload;

        if (!conversation?._id) {
          return;
        }

        state.activeUserConversation = conversation;

        const exists = state.userConversations.some(
          (item) => item._id?.toString() === conversation._id.toString(),
        );

        if (!exists) {
          state.userConversations.unshift(conversation);
        }
      })

      .addCase(getOrCreateConversation.rejected, (state, action) => {
        state.userConversationLoading = false;
        state.error = action.payload || "Failed to create conversation";
      });

    // =======================================================
    // GET USER CONVERSATION
    // =======================================================

    builder
      .addCase(getUserConversation.pending, (state) => {
        state.userConversationLoading = true;
        state.error = null;
      })

      .addCase(getUserConversation.fulfilled, (state, action) => {
        state.userConversationLoading = false;

        const conversation =
          action.payload?.conversation ||
          action.payload?.data ||
          action.payload;

        if (conversation?._id) {
          state.activeUserConversation = conversation;
        }
      })

      .addCase(getUserConversation.rejected, (state, action) => {
        state.userConversationLoading = false;
        state.error = action.payload || "Failed to get conversation";
      });

    // =======================================================
    // GET USER MESSAGES
    // =======================================================

    builder
      .addCase(getUserMessages.pending, (state) => {
        state.userMessagesLoading = true;
        state.error = null;
      })

      .addCase(getUserMessages.fulfilled, (state, action) => {
        state.userMessagesLoading = false;

        const payload = action.payload || {};

        const messages = payload.messages || [];

        state.userMessages = messages;

        if (payload.pagination) {
          state.userMessagesPagination = payload.pagination;
        }
      })

      .addCase(getUserMessages.rejected, (state, action) => {
        state.userMessagesLoading = false;
        state.error = action.payload || "Failed to get messages";
      });

    // =======================================================
    // MARK USER READ
    // =======================================================

    builder.addCase(markUserMessagesRead.fulfilled, (state, action) => {
      const conversationId = action.payload?.conversationId;

      if (!conversationId) {
        return;
      }

      const conversation = state.userConversations.find(
        (item) => item._id?.toString() === conversationId.toString(),
      );

      if (conversation) {
        conversation.unreadForUser = 0;
      }

      if (
        state.activeUserConversation?._id?.toString() ===
        conversationId.toString()
      ) {
        state.userMessages.forEach((message) => {
          if (message.senderType === "Admin") {
            message.messageStatus = "read";
            message.isRead = true;
          }
        });
      }
    });

    // =======================================================
    // ADMIN CONVERSATIONS
    // =======================================================

    builder
      .addCase(getAdminConversations.pending, (state) => {
        state.adminConversationsLoading = true;
        state.error = null;
      })

      .addCase(getAdminConversations.fulfilled, (state, action) => {
        state.adminConversationsLoading = false;

        state.adminConversations = action.payload?.conversations || [];

        state.error = null;
      })

      .addCase(getAdminConversations.rejected, (state, action) => {
        state.adminConversationsLoading = false;
        state.error = action.payload || "Failed to get admin conversations";
      });

    // =======================================================
    // GET ADMIN CONVERSATION
    // =======================================================

    builder
      .addCase(getAdminConversation.pending, (state) => {
        state.adminConversationLoading = true;
        state.error = null;
      })

      .addCase(getAdminConversation.fulfilled, (state, action) => {
        state.adminConversationLoading = false;

        const conversation =
          action.payload?.conversation ||
          action.payload?.data ||
          action.payload;

        if (conversation?._id) {
          state.activeAdminConversation = conversation;
        }
      })

      .addCase(getAdminConversation.rejected, (state, action) => {
        state.adminConversationLoading = false;
        state.error = action.payload || "Failed to get admin conversation";
      });

    // =======================================================
    // GET ADMIN MESSAGES
    // =======================================================

    builder
      .addCase(getAdminMessages.pending, (state) => {
        state.adminMessagesLoading = true;
        state.error = null;
      })

      .addCase(getAdminMessages.fulfilled, (state, action) => {
        state.adminMessagesLoading = false;

        const payload = action.payload || {};

        state.adminMessages = payload.messages || [];

        if (payload.pagination) {
          state.adminMessagesPagination = payload.pagination;
        }
      })

      .addCase(getAdminMessages.rejected, (state, action) => {
        state.adminMessagesLoading = false;
        state.error = action.payload || "Failed to get admin messages";
      });

    // =======================================================
    // ASSIGN
    // =======================================================

    builder
      .addCase(assignConversation.pending, (state) => {
        state.assigning = true;
        state.error = null;
      })

      .addCase(assignConversation.fulfilled, (state, action) => {
        state.assigning = false;

        const conversation =
          action.payload?.conversation || action.payload?.data;

        if (conversation?._id) {
          state.activeAdminConversation = conversation;

          const index = state.adminConversations.findIndex(
            (item) => item._id?.toString() === conversation._id.toString(),
          );

          if (index !== -1) {
            state.adminConversations[index] = conversation;
          }
        }
      })

      .addCase(assignConversation.rejected, (state, action) => {
        state.assigning = false;
        state.error = action.payload || "Failed to assign conversation";
      });

    // =======================================================
    // ADMIN READ
    // =======================================================

    builder.addCase(markAdminMessagesRead.fulfilled, (state, action) => {
      const conversationId = action.payload?.conversationId;

      if (!conversationId) {
        return;
      }

      const conversation = state.adminConversations.find(
        (item) => item._id?.toString() === conversationId.toString(),
      );

      if (conversation) {
        conversation.unreadForAdmin = 0;
      }

      if (
        state.activeAdminConversation?._id?.toString() ===
        conversationId.toString()
      ) {
        state.adminMessages.forEach((message) => {
          if (message.senderType === "User") {
            message.messageStatus = "read";
            message.isRead = true;
          }
        });
      }
    });

    // =======================================================
    // CLOSE
    // =======================================================

    builder
      .addCase(closeConversation.pending, (state) => {
        state.closing = true;
        state.error = null;
      })

      .addCase(closeConversation.fulfilled, (state, action) => {
        state.closing = false;

        const conversation =
          action.payload?.conversation || action.payload?.data;

        if (conversation?._id) {
          state.activeAdminConversation = conversation;

          const index = state.adminConversations.findIndex(
            (item) => item._id?.toString() === conversation._id.toString(),
          );

          if (index !== -1) {
            state.adminConversations[index] = conversation;
          }
        }
      })

      .addCase(closeConversation.rejected, (state, action) => {
        state.closing = false;
        state.error = action.payload || "Failed to close conversation";
      });

    // =======================================================
    // REOPEN
    // =======================================================

    builder
      .addCase(reopenConversation.pending, (state) => {
        state.reopening = true;
        state.error = null;
      })

      .addCase(reopenConversation.fulfilled, (state, action) => {
        state.reopening = false;

        const conversation =
          action.payload?.conversation || action.payload?.data;

        if (conversation?._id) {
          state.activeAdminConversation = conversation;

          const index = state.adminConversations.findIndex(
            (item) => item._id?.toString() === conversation._id.toString(),
          );

          if (index !== -1) {
            state.adminConversations[index] = conversation;
          }
        }
      })

      .addCase(reopenConversation.rejected, (state, action) => {
        state.reopening = false;
        state.error = action.payload || "Failed to reopen conversation";
      });

    // =======================================================
    // UNASSIGN
    // =======================================================

    builder
      .addCase(unassignConversation.pending, (state) => {
        state.unassigning = true;
        state.error = null;
      })

      .addCase(unassignConversation.fulfilled, (state, action) => {
        state.unassigning = false;

        const conversation =
          action.payload?.conversation || action.payload?.data;

        if (conversation?._id) {
          state.activeAdminConversation = conversation;

          const index = state.adminConversations.findIndex(
            (item) => item._id?.toString() === conversation._id.toString(),
          );

          if (index !== -1) {
            state.adminConversations[index] = conversation;
          }
        }
      })

      .addCase(unassignConversation.rejected, (state, action) => {
        state.unassigning = false;
        state.error = action.payload || "Failed to unassign conversation";
      });

    // =======================================================
    // DELETE
    // =======================================================

    builder
      .addCase(deleteConversation.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })

      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.deleting = false;

        const conversationId = action.payload?.conversationId;

        if (!conversationId) {
          return;
        }

        state.adminConversations = state.adminConversations.filter(
          (item) => item._id?.toString() !== conversationId.toString(),
        );

        if (
          state.activeAdminConversation?._id?.toString() ===
          conversationId.toString()
        ) {
          state.activeAdminConversation = null;
          state.adminMessages = [];
        }
      })

      .addCase(deleteConversation.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || "Failed to delete conversation";
      });

    // =======================================================
    // ATTACHMENT UPLOAD
    // =======================================================

    builder
      .addCase(uploadChatAttachments.pending, (state) => {
        state.uploadingAttachments = true;
        state.error = null;
      })

      .addCase(uploadChatAttachments.fulfilled, (state) => {
        state.uploadingAttachments = false;
      })

      .addCase(uploadChatAttachments.rejected, (state, action) => {
        state.uploadingAttachments = false;
        state.error = action.payload || "Failed to upload attachments";
      });
  },
});

// =============================================================
// ACTIONS
// =============================================================

export const {
  setActiveUserConversation,
  clearActiveUserConversation,

  setActiveAdminConversation,
  clearActiveAdminConversation,

  setUserMessages,
  setAdminMessages,

  setSocketConnected,

  handleSocketNewMessage,
  handleSocketConversationUpdated,

  updateMessageStatus,
  markConversationMessagesRead,

  setTyping,

  setUserOnline,
  setUserOffline,

  setAdminOnline,
  setAdminOffline,

  clearChatError,
  clearChatSuccess,

  resetChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
