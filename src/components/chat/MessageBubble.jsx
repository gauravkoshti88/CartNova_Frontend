import { Check, CheckCheck, FileText, Image as ImageIcon } from "lucide-react";

function formatTime(date) {
  if (!date) return "";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "";
  }

  return value.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessageBubble({ message }) {
  const isUser = String(message?.senderType || "").toLowerCase() === "user";

  const attachments = Array.isArray(message?.attachments)
    ? message.attachments
    : [];

  const status = message?.messageStatus;

  return (
    <div
      className={`
        flex
        w-full
        ${isUser ? "justify-end" : "justify-start"}
      `}
    >
      <div
        className={`
          max-w-[80%]
          ${isUser ? "items-end" : "items-start"}
        `}
      >
        <div
          className={`
            rounded-2xl
            px-3
            py-2
            shadow-sm
            ${
              isUser
                ? "rounded-br-md bg-indigo-600 text-white"
                : "rounded-bl-md bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
            }
          `}
        >
          {message?.text && (
            <p className="whitespace-pre-wrap break-words text-sm leading-5">
              {message.text}
            </p>
          )}

          {attachments.length > 0 && (
            <div
              className={`
                ${message.text ? "mt-2" : ""}
                space-y-2
              `}
            >
              {attachments.map((attachment, index) => {
                const url = attachment?.url;

                if (!url) return null;

                const type = attachment?.type || "";
                const isImage =
                  type.startsWith("image/") ||
                  attachment?.resourceType === "image";

                return (
                  <a
                    key={attachment?._id || index}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-xl"
                  >
                    {isImage ? (
                      <img
                        src={url}
                        alt={attachment?.name || "Attachment"}
                        className="
                          max-h-56
                          w-full
                          object-cover
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-lg
                          bg-black/10
                          px-3
                          py-2
                        "
                      >
                        {type.includes("pdf") ? (
                          <FileText className="h-4 w-4" />
                        ) : (
                          <ImageIcon className="h-4 w-4" />
                        )}

                        <span className="max-w-40 truncate text-xs">
                          {attachment?.name || "Attachment"}
                        </span>
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          )}

          <div
            className={`
              mt-1
              flex
              items-center
              justify-end
              gap-1
              ${isUser ? "text-indigo-100" : "text-gray-400"}
            `}
          >
            <span className="text-[9px]">
              {formatTime(message?.createdAt || message?.sentAt)}
            </span>

            {isUser && (
              <>
                {status === "read" ? (
                  <CheckCheck className="h-3 w-3" />
                ) : (
                  <Check className="h-3 w-3" />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
