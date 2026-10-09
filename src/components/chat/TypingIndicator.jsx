export default function TypingIndicator({ visible }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="px-4 pb-1">
      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
        <span>Support is typing</span>

        <span className="flex gap-0.5">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce" style={{ animationDelay: "100ms" }}>
            .
          </span>
          <span className="animate-bounce" style={{ animationDelay: "200ms" }}>
            .
          </span>
        </span>
      </div>
    </div>
  );
}
