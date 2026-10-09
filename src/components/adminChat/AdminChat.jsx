import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageCircle } from "lucide-react";

import {
  getAdminConversations,
  getAdminConversation,
  getAdminMessages,
} from "../../redux/thunks/chatThunk";

import useChatSocket from "../../hooks/useChatSocket";

import {
  setActiveAdminConversation,
  clearActiveAdminConversation,
} from "../../redux/slices/chatSlice";

import AdminChatSidebar from "./AdminChatSidebar";
import AdminChatHeader from "./AdminChatHeader";
import AdminMessageList from "./AdminMessageList";
import AdminChatInput from "./AdminChatInput";

export default function AdminChat() {
  const dispatch = useDispatch();

  const {
    adminConversations = [],
    activeAdminConversation,
    adminMessages = [],
    conversationsLoading,
    messagesLoading,
    socketConnected,
  } = useSelector((state) => state.chat);

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(true);

  const { joinConversation, leaveConversation, markMessagesRead } =
    useChatSocket();

  // LOAD ADMIN CONVERSATIONS

  useEffect(() => {
    const loadConversations = async () => {
      await dispatch(getAdminConversations()).unwrap();
    };

    loadConversations();
  }, [dispatch]);

  // JOIN ACTIVE CONVERSATION

  useEffect(() => {
    const conversationId = activeAdminConversation?._id;

    if (!conversationId) {
      return;
    }

    const loadConversation = async () => {
      try {
        const conversationResult = await dispatch(
          getAdminConversation(conversationId),
        ).unwrap();

        const messagesResult = await dispatch(
          getAdminMessages({
            conversationId,
            params: {
              page: 1,
              limit: 50,
            },
          }),
        ).unwrap();

        joinConversation(conversationId);

        markMessagesRead(conversationId);
      } catch (error) {
        console.error("❌ ADMIN CONVERSATION LOAD ERROR:", error);
      }
    };

    loadConversation();

    return () => {
      leaveConversation(conversationId);
    };
  }, [
    activeAdminConversation?._id,
    dispatch,
    joinConversation,
    leaveConversation,
    markMessagesRead,
  ]);

  // =========================================================
  // SELECT CONVERSATION
  // =========================================================

  const handleSelectConversation = (conversation) => {
    if (!conversation?._id) {
      console.warn("⚠️ Conversation has no _id");

      return;
    }

    dispatch(setActiveAdminConversation(conversation));

    setMobileSidebarOpen(false);
  };

  // =========================================================
  // BACK
  // =========================================================

  const handleBack = () => {
    dispatch(clearActiveAdminConversation());

    setMobileSidebarOpen(true);
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div
      className="
        flex h-full min-h-0 w-full
        overflow-hidden
        rounded-2xl
        border border-gray-200
        bg-white
        shadow-sm
        dark:border-gray-800
        dark:bg-gray-950
      "
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div
        className={`
          ${mobileSidebarOpen ? "flex w-full" : "hidden"}

          md:flex
          md:w-[320px]
          lg:w-[360px]

          shrink-0
        `}
      >
        <AdminChatSidebar
          conversations={adminConversations}
          activeConversation={activeAdminConversation}
          loading={conversationsLoading}
          onSelectConversation={handleSelectConversation}
          socketConnected={socketConnected}
        />
      </div>

      {/* =====================================================
          CHAT AREA
      ===================================================== */}

      <div
        className={`
          ${mobileSidebarOpen ? "hidden" : "flex w-full"}

          md:flex
          min-w-0
          flex-1
          flex-col
        `}
      >
        {activeAdminConversation ? (
          <>
            <AdminChatHeader
              conversation={activeAdminConversation}
              socketConnected={socketConnected}
              onBack={handleBack}
            />

            <AdminMessageList
              messages={adminMessages}
              conversation={activeAdminConversation}
              loading={messagesLoading}
            />

            <AdminChatInput conversationId={activeAdminConversation._id} />
          </>
        ) : (
          <div
            className="
              flex flex-1
              items-center
              justify-center
              bg-gray-50
              dark:bg-gray-950
            "
          >
            <div
              className="
                flex max-w-sm
                flex-col items-center
                px-6 text-center
              "
            >
              <div
                className="
                  mb-5 flex h-16 w-16
                  items-center justify-center
                  rounded-2xl
                  bg-indigo-100
                  text-indigo-600
                  dark:bg-indigo-950/50
                  dark:text-indigo-400
                "
              >
                <MessageCircle size={30} />
              </div>

              <h2
                className="
                  text-lg font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                Select a conversation
              </h2>

              <p
                className="
                  mt-2 text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Select a customer conversation from the left to start chatting.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
