import { Circle } from "lucide-react";
import { useSelector } from "react-redux";

export default function AdminConversationItem({
  conversation,
  active,
  onClick,
}) {
  const onlineUsers = useSelector((state) => state.chat.onlineUsers);

  const user = conversation?.userId || conversation?.customer;

  const userId = user?._id || conversation?.userId || conversation?.customerId;

  const isOnline = Boolean(userId && onlineUsers[userId]);

  const firstName = user?.firstName || "";
  const lastName = user?.lastName || "";

  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") || user?.name || "Customer";

  const email = user?.email || "";

  const lastMessage =
    conversation?.lastMessageText ||
    conversation?.lastMessage?.text ||
    conversation?.lastMessage?.content ||
    "No messages yet";

  const unread = Number(conversation?.unreadForAdmin || 0);

  const date = conversation?.lastMessageAt || conversation?.updatedAt;

  const formattedDate = date
    ? new Date(date).toLocaleDateString([], {
        day: "2-digit",
        month: "short",
      })
    : "";

  const initials =
    fullName
      .split(" ")
      .map((item) => item[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CU";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        p-3
        text-left
        transition
        ${
          active
            ? "bg-indigo-50 dark:bg-indigo-950/40"
            : "hover:bg-gray-50 dark:hover:bg-gray-900"
        }
      `}
    >
      {/* AVATAR */}

      <div className="relative shrink-0">
        {user?.profileImage?.url ? (
          <img
            src={user.profileImage.url}
            alt={fullName}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white">
            {initials}
          </div>
        )}

        <span
          className={`
            absolute
            bottom-0
            right-0
            h-3
            w-3
            rounded-full
            border-2
            border-white
            dark:border-gray-950
            ${isOnline ? "bg-emerald-500" : "bg-gray-400"}
          `}
        />
      </div>

      {/* CONTENT */}

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3
            className={`
              truncate
              text-sm
              ${
                unread > 0
                  ? "font-bold text-gray-900 dark:text-white"
                  : "font-medium text-gray-800 dark:text-gray-200"
              }
            `}
          >
            {fullName}
          </h3>

          <span className="shrink-0 text-[10px] text-gray-400">
            {formattedDate}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between gap-2">
          <p
            className={`
              truncate
              text-xs
              ${
                unread > 0
                  ? "font-medium text-gray-700 dark:text-gray-300"
                  : "text-gray-500 dark:text-gray-500"
              }
            `}
          >
            {lastMessage}
          </p>

          {unread > 0 && (
            <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[10px] font-bold text-white">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </div>

        {email && (
          <p className="mt-0.5 truncate text-[10px] text-gray-400">{email}</p>
        )}
      </div>
    </button>
  );
}
