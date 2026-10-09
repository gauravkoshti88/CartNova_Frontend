import { useEffect, useRef } from "react";
import { Loader2, MessageCircle } from "lucide-react";

import AdminMessageBubble from "./AdminMessageBubble";

export default function AdminMessageList({
  messages = [],
  conversation,
  loading,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);

  if (loading && messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900/30">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 size={18} className="animate-spin" />
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 overflow-y-auto bg-gray-50 px-4 py-5 dark:bg-gray-900/30 sm:px-6">
      {messages.length === 0 ? (
        <div className="flex h-full min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-indigo-500 shadow-sm dark:bg-gray-900">
              <MessageCircle size={25} />
            </div>

            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              No messages yet
            </h3>

            <p className="mt-1 max-w-xs text-xs text-gray-400">
              Start the conversation with this customer.
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
          {messages.map((message, index) => (
            <AdminMessageBubble
              key={message?._id || `${message?.createdAt}-${index}`}
              message={message}
              conversation={conversation}
            />
          ))}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
