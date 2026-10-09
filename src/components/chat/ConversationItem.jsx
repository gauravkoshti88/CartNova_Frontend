import { MessageCircle } from "lucide-react";

function formatTime(date) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  const now = new Date();

  if (value.toDateString() === now.toDateString()) {
    return value.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return value.toLocaleDateString([], {
    day: "2-digit",
    month: "short",
  });
}

function getLastMessage(conversation) {
  const message = conversation?.lastMessage;

  if (!message) {
    return "Start a conversation";
  }

  if (typeof message === "string") {
    return message;
  }

  return (
    message.text || (message.attachments?.length ? "Attachment" : "Message")
  );
}

export default function ConversationItem({
  conversation,
  onClick,
  onlineAdmins = {},
}) {
  const unread = Number(conversation?.unreadForUser || 0);

  const adminId =
    conversation?.assignedAdmin?._id ||
    conversation?.admin?._id ||
    conversation?.assignedTo?._id;

  const isOnline = adminId ? Boolean(onlineAdmins[adminId]) : false;

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        px-3
        py-3
        text-left
        transition
        hover:bg-gray-50
        dark:hover:bg-gray-800/70
      "
    >
      <div className="relative shrink-0">
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-indigo-100
            text-indigo-600
            dark:bg-indigo-900/40
            dark:text-indigo-400
          "
        >
          <MessageCircle className="h-5 w-5" />
        </div>

        {isOnline && (
          <span
            className="
              absolute
              bottom-0
              right-0
              h-3
              w-3
              rounded-full
              border-2
              border-white
              bg-emerald-500
              dark:border-gray-900
            "
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
            Support Team
          </h4>

          <span className="shrink-0 text-[10px] text-gray-400">
            {formatTime(conversation?.lastMessageAt || conversation?.updatedAt)}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-2">
          <p
            className={`
              min-w-0
              flex-1
              truncate
              text-xs
              ${
                unread > 0
                  ? "font-medium text-gray-800 dark:text-gray-200"
                  : "text-gray-500 dark:text-gray-400"
              }
            `}
          >
            {getLastMessage(conversation)}
          </p>

          {unread > 0 && (
            <span
              className="
                flex
                min-w-5
                items-center
                justify-center
                rounded-full
                bg-indigo-600
                px-1.5
                py-0.5
                text-[10px]
                font-semibold
                text-white
              "
            >
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
