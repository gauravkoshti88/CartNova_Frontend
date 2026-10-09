import { ArrowLeft, MoreVertical } from "lucide-react";

import { useSelector } from "react-redux";

export default function AdminChatHeader({
  conversation,
  socketConnected,
  onBack,
}) {
  const onlineUsers = useSelector((state) => state.chat.onlineUsers);

  const user = conversation?.userId || conversation?.customer;

  const userId = user?._id || conversation?.userId || conversation?.customerId;

  const isOnline = Boolean(userId && onlineUsers[userId]);

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.name ||
    "Customer";

  const initials =
    fullName
      .split(" ")
      .map((item) => item[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "CU";

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex min-w-0 items-center gap-3">
        {/* MOBILE BACK */}

        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 md:hidden dark:hover:bg-gray-900"
        >
          <ArrowLeft size={19} />
        </button>

        {/* AVATAR */}

        <div className="relative shrink-0">
          {user?.profileImage?.url ? (
            <img
              src={user.profileImage.url}
              alt={fullName}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white">
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

        {/* INFO */}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {fullName}
            </h2>

            {isOnline && (
              <span className="hidden text-[11px] font-medium text-emerald-500 sm:inline">
                Online
              </span>
            )}
          </div>

          <div className="mt-0.5 flex items-center gap-2">
            <span className="truncate text-xs text-gray-400">
              {user?.email || "Customer"}
            </span>

            <span
              className={`
                hidden h-1.5 w-1.5 rounded-full sm:block
                ${socketConnected ? "bg-emerald-500" : "bg-red-500"}
              `}
            />

            <span className="hidden text-[10px] text-gray-400 sm:block">
              {socketConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}

      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <MoreVertical size={18} />
        </button>
      </div>
    </header>
  );
}
