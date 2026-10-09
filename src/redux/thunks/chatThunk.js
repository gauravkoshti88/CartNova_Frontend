import { createAsyncThunk } from "@reduxjs/toolkit";
import chatService from "../../services/chatService";

// USER

export const getUserConversations = createAsyncThunk(
  "chat/getUserConversations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await chatService.getUserConversations();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get conversations",
      );
    }
  },
);

export const getOrCreateConversation = createAsyncThunk(
  "chat/getOrCreateConversation",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await chatService.getOrCreateConversation();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create conversation",
      );
    }
  },
);

export const getUserConversation = createAsyncThunk(
  "chat/getUserConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await chatService.getUserConversation(conversationId);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get conversation",
      );
    }
  },
);

export const getUserMessages = createAsyncThunk(
  "chat/getUserMessages",
  async ({ conversationId, params = {} }, { rejectWithValue }) => {
    try {
      const { data } = await chatService.getUserMessages(
        conversationId,
        params,
      );

      return {
        conversationId,
        ...data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get messages",
      );
    }
  },
);

export const markUserMessagesRead = createAsyncThunk(
  "chat/markUserMessagesRead",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await chatService.markUserMessagesRead(conversationId);

      return {
        conversationId,
        ...data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark messages as read",
      );
    }
  },
);

// ADMIN

export const getAdminConversations = createAsyncThunk(
  "chat/getAdminConversations",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await chatService.getAdminConversations();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get admin conversations",
      );
    }
  },
);

export const getAdminConversation = createAsyncThunk(
  "chat/getAdminConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await chatService.getAdminConversation(conversationId);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get conversation",
      );
    }
  },
);

export const getAdminMessages = createAsyncThunk(
  "chat/getAdminMessages",
  async ({ conversationId, params = {} }, { rejectWithValue }) => {
    try {
      const { data } = await chatService.getAdminMessages(
        conversationId,
        params,
      );

      return {
        conversationId,
        ...data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get messages",
      );
    }
  },
);

export const assignConversation = createAsyncThunk(
  "chat/assignConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await chatService.assignConversation(conversationId);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to assign conversation",
      );
    }
  },
);

export const markAdminMessagesRead = createAsyncThunk(
  "chat/markAdminMessagesRead",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await chatService.markAdminMessagesRead(conversationId);

      return {
        conversationId,
        ...data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark messages as read",
      );
    }
  },
);

export const closeConversation = createAsyncThunk(
  "chat/closeConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await chatService.closeConversation(conversationId);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to close conversation",
      );
    }
  },
);

export const reopenConversation = createAsyncThunk(
  "chat/reopenConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await chatService.reopenConversation(conversationId);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to reopen conversation",
      );
    }
  },
);

export const unassignConversation = createAsyncThunk(
  "chat/unassignConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await chatService.unassignConversation(conversationId);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to unassign conversation",
      );
    }
  },
);

export const deleteConversation = createAsyncThunk(
  "chat/deleteConversation",
  async (conversationId, { rejectWithValue }) => {
    try {
      const { data } = await chatService.deleteConversation(conversationId);

      return {
        conversationId,
        ...data,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete conversation",
      );
    }
  },
);

// ATTACHMENTS

export const uploadChatAttachments = createAsyncThunk(
  "chat/uploadChatAttachments",
  async (files, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      for (const file of files) {
        formData.append("files", file);
      }

      const { data } = await chatService.uploadAttachments(formData);

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to upload attachments",
      );
    }
  },
);
