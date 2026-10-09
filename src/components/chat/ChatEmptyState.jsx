import { MessageCircle } from "lucide-react";

export default function ChatEmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center">
        <div
          className="
            mx-auto
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
          No conversation selected
        </h3>

        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Select a conversation to start chatting.
        </p>
      </div>
    </div>
  );
}
