import api from "./api";

const chatService = {
  // USER

  getUserConversations: () => api.get("/api/chat/user/conversations"),

  getOrCreateConversation: () => api.post("/api/chat/user/conversations"),

  getUserConversation: (conversationId) =>
    api.get(`/api/chat/user/conversations/${conversationId}`),

  getUserMessages: (conversationId, params = {}) =>
    api.get(`/api/chat/user/conversations/${conversationId}/messages`, {
      params,
    }),

  markUserMessagesRead: (conversationId) =>
    api.patch(`/api/chat/user/conversations/${conversationId}/read`),

  // ADMIN

  getAdminConversations: () => api.get("/api/chat/admin/conversations"),

  getAdminConversation: (conversationId) =>
    api.get(`/api/chat/admin/conversations/${conversationId}`),

  getAdminMessages: (conversationId, params = {}) =>
    api.get(`/api/chat/admin/conversations/${conversationId}/messages`, {
      params,
    }),

  assignConversation: (conversationId) =>
    api.patch(`/api/chat/admin/conversations/${conversationId}/assign`),

  markAdminMessagesRead: (conversationId) =>
    api.patch(`/api/chat/admin/conversations/${conversationId}/read`),

  closeConversation: (conversationId) =>
    api.patch(`/api/chat/admin/conversations/${conversationId}/close`),

  reopenConversation: (conversationId) =>
    api.patch(`/api/chat/admin/conversations/${conversationId}/reopen`),

  unassignConversation: (conversationId) =>
    api.patch(`/api/chat/admin/conversations/${conversationId}/unassign`),

  deleteConversation: (conversationId) =>
    api.delete(`/api/chat/admin/conversations/${conversationId}`),

  // ATTACHMENTS

  uploadAttachments: (formData) => api.post("/api/chat/upload", formData),
};

export default chatService;
