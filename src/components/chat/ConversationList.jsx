import { MessageCircle, Plus, Loader2 } from "lucide-react";

import ConversationItem from "./ConversationItem";

export default function ConversationList({
  conversations = [],
  loading = false,
  onSelect,
  onStartChat,
  onlineAdmins = {},
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Your conversations
          </h3>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Chat with our support team
          </p>
        </div>

        <button
          type="button"
          onClick={onStartChat}
          className="
            flex
            items-center
            gap-1.5
            rounded-lg
            bg-indigo-600
            px-3
            py-2
            text-xs
            font-medium
            text-white
            transition
            hover:bg-indigo-700
          "
        >
          <Plus className="h-4 w-4" />
          New Chat
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex h-full min-h-72 flex-col items-center justify-center px-6 text-center">
            <div
              className="
                flex
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-indigo-50
                text-indigo-600
                dark:bg-indigo-900/30
              "
            >
              <MessageCircle className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
              No conversations yet
            </h3>

            <p className="mt-1 max-w-xs text-xs text-gray-500 dark:text-gray-400">
              Start a conversation with our support team and we will help you.
            </p>

            <button
              type="button"
              onClick={onStartChat}
              className="
                mt-5
                rounded-lg
                bg-indigo-600
                px-4
                py-2
                text-xs
                font-medium
                text-white
                hover:bg-indigo-700
              "
            >
              Start Chat
            </button>
          </div>
        ) : (
          conversations.map((conversation) => (
            <ConversationItem
              key={conversation._id}
              conversation={conversation}
              onlineAdmins={onlineAdmins}
              onClick={() => onSelect(conversation)}
            />
          ))
        )}
      </div>
    </div>
  );
}
