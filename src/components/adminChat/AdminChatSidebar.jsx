import { useMemo, useState } from "react";
import { MessageCircle, Search, Users, Wifi, WifiOff } from "lucide-react";

import AdminConversationItem from "./AdminConversationItem";

export default function AdminChatSidebar({
  conversations = [],
  activeConversation,
  loading,
  onSelectConversation,
  socketConnected,
}) {
  const [search, setSearch] = useState("");

  const filteredConversations = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const user = conversation?.userId;

      const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

      const email = user?.email || "";

      const lastMessage =
        conversation?.lastMessage?.text ||
        conversation?.lastMessage?.content ||
        "";

      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        lastMessage.toLowerCase().includes(query)
      );
    });
  }, [conversations, search]);

  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      {/* HEADER */}

      <div className="shrink-0 border-b border-gray-200 px-4 py-4 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <MessageCircle size={19} />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Customer Chat
                </h2>

                <div className="mt-0.5 flex items-center gap-1.5">
                  {socketConnected ? (
                    <>
                      <Wifi size={12} className="text-emerald-500" />

                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400">
                        Connected
                      </span>
                    </>
                  ) : (
                    <>
                      <WifiOff size={12} className="text-red-500" />

                      <span className="text-[11px] text-red-600 dark:text-red-400">
                        Disconnected
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-gray-100 px-2 text-xs font-semibold text-gray-600 dark:bg-gray-900 dark:text-gray-300">
            {conversations.length}
          </div>
        </div>

        {/* SEARCH */}

        <div className="relative mt-4">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="
              h-10
              w-full
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              pl-10
              pr-3
              text-sm
              text-gray-900
              outline-none
              transition
              placeholder:text-gray-400
              focus:border-indigo-400
              focus:ring-2
              focus:ring-indigo-500/10
              dark:border-gray-800
              dark:bg-gray-900
              dark:text-white
            "
          />
        </div>
      </div>

      {/* LIST */}

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loading ? (
          <div className="space-y-2 p-3">
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className="flex animate-pulse gap-3 rounded-xl p-3"
              >
                <div className="h-11 w-11 shrink-0 rounded-full bg-gray-200 dark:bg-gray-800" />

                <div className="min-w-0 flex-1">
                  <div className="h-3 w-28 rounded bg-gray-200 dark:bg-gray-800" />

                  <div className="mt-2 h-3 w-full rounded bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-500 dark:bg-gray-900">
              <Users size={22} />
            </div>

            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              No conversations
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Customer conversations will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <AdminConversationItem
                key={conversation._id}
                conversation={conversation}
                active={activeConversation?._id === conversation._id}
                onClick={() => onSelectConversation(conversation)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
