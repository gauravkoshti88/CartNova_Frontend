import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { getUserConversations } from "../../redux/thunks/chatThunk";

import useChatSocket from "../../hooks/useChatSocket";

import ConversationList from "../../components/Chat/ConversationList";
import ChatWindow from "../../components/Chat/ChatWindow";

export default function UserChat() {
  const dispatch = useDispatch();

  const { userConversations, activeUserConversation, conversationsLoading } =
    useSelector((state) => state.chat);

  useChatSocket();

  useEffect(() => {
    dispatch(getUserConversations());
  }, [dispatch]);

  return (
    <div className="mx-auto flex h-[calc(100vh-80px)] max-w-7xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="w-[340px] shrink-0 border-r border-gray-200 dark:border-gray-700">
        <ConversationList
          conversations={userConversations}
          loading={conversationsLoading}
        />
      </div>

      <div className="min-w-0 flex-1">
        {activeUserConversation ? (
          <ChatWindow />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="text-5xl">💬</div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              Welcome to G-Shop Support
            </h2>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
              Select a conversation to start chatting with our support team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
