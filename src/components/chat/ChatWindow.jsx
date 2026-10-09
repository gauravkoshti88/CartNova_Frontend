import { useMemo } from "react";
import { useSelector } from "react-redux";

import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({
  conversation,
  messages = [],
  loading = false,
}) {
  const { typingUsers, onlineAdmins } = useSelector((state) => state.chat);

  const conversationId = conversation?._id;

  const isTyping = useMemo(() => {
    if (!conversationId) return false;

    return Object.keys(typingUsers?.[conversationId] || {}).length > 0;
  }, [typingUsers, conversationId]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div
        className="
          flex
          shrink-0
          items-center
          gap-2
          border-b
          border-gray-100
          px-4
          py-2
          dark:border-gray-800
        "
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500" />

        <span className="text-xs text-gray-500 dark:text-gray-400">
          Support
        </span>
      </div>

      <MessageList messages={messages} loading={loading} />

      <TypingIndicator visible={isTyping} />

      <ChatInput conversationId={conversationId} />
    </div>
  );
}
