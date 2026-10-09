import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImagePlus, Paperclip, Send, X, Loader2 } from "lucide-react";

import useChatSocket from "../../hooks/useChatSocket";

import { uploadChatAttachments } from "../../redux/thunks/chatThunk";

import { clearUploadError } from "../../redux/slices/chatSlice";

export default function ChatInput({ conversationId }) {
  const dispatch = useDispatch();

  const { sendMessage, startTyping, stopTyping } = useChatSocket();

  const { uploadingAttachments, uploadError, socketConnected } = useSelector(
    (state) => state.chat,
  );

  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);

  const textareaRef = useRef(null);
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

  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => {
        dispatch(clearUploadError());
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [uploadError, dispatch]);

  const handleTextChange = (event) => {
    const value = event.target.value;

    setText(value);

    if (!conversationId) return;

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

  const handleFiles = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    setFiles((previous) => [...previous, ...selectedFiles]);

    event.target.value = "";
  };

  const removeFile = (index) => {
    setFiles((previous) =>
      previous.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  const uploadFiles = async () => {
    if (!files.length) {
      return [];
    }

    const result = await dispatch(uploadChatAttachments(files)).unwrap();

    /*
     * Supports common response structures:
     *
     * { attachments: [] }
     * { data: { attachments: [] } }
     */
    return (
      result?.attachments || result?.data?.attachments || result?.data || []
    );
  };

  const handleSend = async () => {
    if (!conversationId || uploadingAttachments) {
      return;
    }

    const trimmedText = text.trim();

    if (!trimmedText && files.length === 0) {
      return;
    }

    try {
      let attachments = [];

      if (files.length) {
        attachments = await uploadFiles();
      }

      const sent = sendMessage({
        conversationId,
        text: trimmedText,
        attachments,
      });

      if (!sent) {
        console.error("Message was not sent because socket is disconnected.");

        return;
      }

      setText("");
      setFiles([]);

      stopTyping(conversationId);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("SEND CHAT MESSAGE ERROR:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (event) => {
    event.target.style.height = "auto";

    event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
  };

  const canSend =
    socketConnected && !uploadingAttachments && (text.trim() || files.length);

  return (
    <div
      className="
        shrink-0
        border-t
        border-gray-200
        bg-white
        p-3
        dark:border-gray-700
        dark:bg-gray-900
      "
    >
      {files.length > 0 && (
        <div className="mb-2 flex gap-2 overflow-x-auto pb-1">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="
                relative
                flex
                shrink-0
                items-center
                gap-2
                rounded-lg
                bg-gray-100
                px-2
                py-1.5
                dark:bg-gray-800
              "
            >
              <Paperclip className="h-3.5 w-3.5 text-gray-500" />

              <span className="max-w-28 truncate text-[10px] text-gray-600 dark:text-gray-300">
                {file.name}
              </span>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="
                  rounded-full
                  p-0.5
                  text-gray-400
                  hover:bg-gray-200
                  hover:text-gray-700
                  dark:hover:bg-gray-700
                "
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadError && (
        <p className="mb-2 text-xs text-red-500">{uploadError}</p>
      )}

      <div className="flex items-end gap-2">
        <label
          className="
            flex
            h-10
            w-10
            shrink-0
            cursor-pointer
            items-center
            justify-center
            rounded-xl
            text-gray-500
            transition
            hover:bg-gray-100
            hover:text-indigo-600
            dark:hover:bg-gray-800
          "
        >
          <ImagePlus className="h-5 w-5" />

          <input
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFiles}
            className="hidden"
          />
        </label>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onInput={handleTextareaInput}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Type a message..."
          className="
            max-h-[120px]
            min-h-10
            flex-1
            resize-none
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            px-3
            py-2.5
            text-sm
            text-gray-900
            outline-none
            transition
            focus:border-indigo-500
            focus:ring-2
            focus:ring-indigo-500/10
            dark:border-gray-700
            dark:bg-gray-800
            dark:text-white
          "
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
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
            transition
            hover:bg-indigo-700
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {uploadingAttachments ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </div>

      <p className="mt-1.5 px-1 text-[9px] text-gray-400">
        Press Enter to send · Shift + Enter for new line
      </p>
    </div>
  );
}
