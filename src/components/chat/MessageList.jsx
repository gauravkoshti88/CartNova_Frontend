import { useEffect, useRef } from "react";
import { Loader2, MessageCircle } from "lucide-react";

import MessageBubble from "./MessageBubble";

export default function MessageList({ messages = [], loading = false }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div
        className="
          flex
          min-h-0
          flex-1
          flex-col
          items-center
          justify-center
          px-6
          text-center
        "
      >
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-indigo-50
            text-indigo-600
            dark:bg-indigo-900/30
            dark:text-indigo-400
          "
        >
          <MessageCircle className="h-5 w-5" />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
          Start chatting
        </h3>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Send a message to our support team.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-0
        flex-1
        overflow-y-auto
        px-3
        py-4
      "
    >
      <div className="space-y-2">
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}
      </div>

      <div ref={bottomRef} />
    </div>
  );
}
