import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Paperclip, Send, Smile, X, Loader2 } from "lucide-react";

import useChatSocket from "../../hooks/useChatSocket";

import { uploadChatAttachments } from "../../redux/thunks/chatThunk";

export default function AdminChatInput({ conversationId }) {
  const dispatch = useDispatch();

  const { uploadingAttachments } = useSelector((state) => state.chat);

  const { sendMessage, startTyping, stopTyping } = useChatSocket();

  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (conversationId) {
        stopTyping(conversationId);
      }
    };
  }, [conversationId, stopTyping]);

  const handleTextChange = (e) => {
    const value = e.target.value;

    setText(value);

    if (!conversationId) {
      return;
    }

    if (value.trim()) {
      startTyping(conversationId);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        stopTyping(conversationId);
      }, 1200);
    } else {
      stopTyping(conversationId);
    }
  };

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    if (!selectedFiles.length) {
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);

    e.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, fileIndex) => fileIndex !== index));
  };

  const handleSend = async () => {
    const trimmedText = text.trim();

    if (
      !conversationId ||
      (!trimmedText && files.length === 0) ||
      uploadingAttachments
    ) {
      return;
    }

    let attachments = [];

    // Upload attachments first
    if (files.length > 0) {
      try {
        const result = await dispatch(uploadChatAttachments(files)).unwrap();

        attachments =
          result?.attachments || result?.files || result?.data || [];
      } catch (error) {
        console.error("CHAT ATTACHMENT UPLOAD ERROR:", error);

        return;
      }
    }

    const sent = sendMessage({
      conversationId,
      text: trimmedText,
      attachments,
    });

    if (sent) {
      setText("");
      setFiles([]);
      stopTyping(conversationId);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0 border-t border-gray-200 bg-white px-3 py-3 dark:border-gray-800 dark:bg-gray-950 sm:px-4">
      {/* FILE PREVIEW */}

      {files.length > 0 && (
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900"
            >
              <span className="max-w-[150px] truncate text-xs text-gray-700 dark:text-gray-300">
                {file.name}
              </span>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto flex max-w-4xl items-end gap-2">
        {/* ATTACHMENT */}

        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={handleFiles}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-indigo-600 dark:hover:bg-gray-900 dark:hover:text-indigo-400"
        >
          <Paperclip size={19} />
        </button>

        {/* INPUT */}

        <div className="relative flex min-h-10 flex-1 items-end rounded-xl border border-gray-200 bg-gray-50 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/10 dark:border-gray-800 dark:bg-gray-900">
          <textarea
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Type a message..."
            className="max-h-32 min-h-10 w-full resize-none bg-transparent px-3 py-2.5 pr-10 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white"
          />

          <button
            type="button"
            className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-800"
          >
            <Smile size={17} />
          </button>
        </div>

        {/* SEND */}

        <button
          type="button"
          onClick={handleSend}
          disabled={
            uploadingAttachments || (!text.trim() && files.length === 0)
          }
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-indigo-600
            text-white
            shadow-sm
            transition
            hover:bg-indigo-700
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {uploadingAttachments ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>

      <p className="mx-auto mt-1.5 hidden max-w-4xl px-12 text-[10px] text-gray-400 sm:block">
        Press Enter to send • Shift + Enter for a new line
      </p>
    </div>
  );
}
