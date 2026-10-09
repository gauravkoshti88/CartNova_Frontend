import { ArrowLeft, Headphones, Wifi, WifiOff } from "lucide-react";

export default function ChatHeader({
  activeConversation,
  unreadCount = 0,
  socketConnected = false,
  onBack,
  showBack = false,
}) {
  return (
    <div
      className="
        flex
        h-16
        shrink-0
        items-center
        gap-3
        border-b
        border-gray-200
        bg-white
        px-4
        dark:border-gray-700
        dark:bg-gray-900
      "
    >
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          className="
            rounded-lg
            p-2
            text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-900
            dark:hover:bg-gray-800
            dark:hover:text-white
          "
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
      )}

      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-indigo-100
          text-indigo-600
          dark:bg-indigo-900/40
          dark:text-indigo-400
        "
      >
        <Headphones className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
          {activeConversation ? "Support Chat" : "Customer Support"}
        </h2>

        <div className="flex items-center gap-1.5">
          {socketConnected ? (
            <>
              <Wifi className="h-3 w-3 text-emerald-500" />

              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                Online
              </span>
            </>
          ) : (
            <>
              <WifiOff className="h-3 w-3 text-gray-400" />

              <span className="text-[11px] text-gray-500">Connecting...</span>
            </>
          )}
        </div>
      </div>

      {!activeConversation && unreadCount > 0 && (
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
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </div>
  );
}
