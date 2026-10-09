import { Check, CheckCheck, Download, FileText } from "lucide-react";

export default function AdminMessageBubble({ message }) {
  const isAdmin = message?.senderType === "Admin";

  const text = message?.text || message?.content || "";

  const attachments = message?.attachments || [];

  const createdAt = message?.createdAt || message?.sentAt;

  const time = createdAt
    ? new Date(createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const renderStatus = () => {
    if (!isAdmin) {
      return null;
    }

    if (message?.messageStatus === "read") {
      return <CheckCheck size={14} className="text-blue-500" />;
    }

    if (message?.messageStatus === "delivered") {
      return <CheckCheck size={14} className="text-gray-400" />;
    }

    return <Check size={14} className="text-gray-400" />;
  };

  return (
    <div className={`flex w-full ${isAdmin ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          flex
          max-w-[85%]
          flex-col
          sm:max-w-[70%]
          ${isAdmin ? "items-end" : "items-start"}
        `}
      >
        {/* ATTACHMENTS */}

        {attachments.length > 0 && (
          <div className="mb-1 flex max-w-full flex-col gap-2">
            {attachments.map((attachment, index) => {
              const url = attachment?.url || attachment?.secure_url;

              const type = attachment?.mimeType || attachment?.type || "";

              const isImage =
                type.startsWith("image/") ||
                /\.(jpg|jpeg|png|gif|webp)$/i.test(url || "");

              if (isImage && url) {
                return (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    key={attachment?._id || `${url}-${index}`}
                  >
                    <img
                      src={url}
                      alt={attachment?.name || "Attachment"}
                      className="max-h-72 max-w-full rounded-2xl border border-gray-200 object-cover shadow-sm dark:border-gray-800"
                    />
                  </a>
                );
              }

              return (
                <a
                  key={attachment?._id || `${index}`}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <FileText size={20} className="text-indigo-500" />

                  <span className="max-w-[180px] truncate text-gray-700 dark:text-gray-300">
                    {attachment?.name || "Attachment"}
                  </span>

                  <Download size={16} className="text-gray-400" />
                </a>
              );
            })}
          </div>
        )}

        {/* MESSAGE */}

        {text && (
          <div
            className={`
              rounded-2xl
              px-4
              py-2.5
              text-sm
              leading-relaxed
              shadow-sm
              ${
                isAdmin
                  ? "rounded-br-md bg-indigo-600 text-white"
                  : "rounded-bl-md border border-gray-200 bg-white text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
              }
            `}
          >
            <p className="whitespace-pre-wrap break-words">{text}</p>
          </div>
        )}

        {/* TIME + STATUS */}

        <div
          className={`
            mt-1
            flex
            items-center
            gap-1
            px-1
            text-[10px]
            text-gray-400
          `}
        >
          <span>{time}</span>

          {renderStatus()}
        </div>
      </div>
    </div>
  );
}
