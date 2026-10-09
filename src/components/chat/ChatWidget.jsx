import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MessageCircle,
  X,
  Send,
  Paperclip,
  MoreVertical,
  Headphones,
  Check,
  CheckCheck,
  Image as ImageIcon,
  FileText,
  Download,
  Loader2,
  Wifi,
  WifiOff,
  ArrowDown,
  Headset,
} from "lucide-react";

import useChatSocket from "../../hooks/useChatSocket";

import {
  getOrCreateConversation,
  getUserMessages,
  markUserMessagesRead,
  uploadChatAttachments,
} from "../../redux/thunks/chatThunk";

import {
  setActiveUserConversation,
  clearActiveUserConversation,
} from "../../redux/slices/chatSlice";

export default function ChatWidget() {
  const dispatch = useDispatch();

  const {
    userConversations,
    activeUserConversation,
    userMessages,
    messagesLoading,
    uploadingAttachments,
    socketConnected,
    typingUsers,
    onlineAdmins,
  } = useSelector((state) => state.chat);

  const { user } = useSelector((state) => state.userAuth || {});

  const {
    joinConversation,
    leaveConversation,
    sendMessage,
    startTyping,
    stopTyping,
    markMessagesRead,
  } = useChatSocket();

  // ==================================================
  // STATE
  // ==================================================

  const [isOpen, setIsOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const [isInitializing, setIsInitializing] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  // ==================================================
  // REFS
  // ==================================================

  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const typingTimeoutRef = useRef(null);
  const previousConversationRef = useRef(null);

  // ==================================================
  // CURRENT CONVERSATION
  // ==================================================

  const conversationId = activeUserConversation?._id;

  // ==================================================
  // TYPING ADMIN
  // ==================================================

  const conversationTypingUsers =
    conversationId && typingUsers?.[conversationId]
      ? Object.values(typingUsers[conversationId])
      : [];

  const adminTyping = conversationTypingUsers.some(
    (typingUser) =>
      String(typingUser?.userType || "").toLowerCase() === "admin",
  );

  // ==================================================
  // ADMIN ONLINE
  // ==================================================

  const assignedAdminId =
    activeUserConversation?.assignedAdmin?._id ||
    activeUserConversation?.assignedAdminId ||
    activeUserConversation?.admin?._id ||
    activeUserConversation?.adminId;

  const isAdminOnline = assignedAdminId
    ? Boolean(onlineAdmins?.[assignedAdminId])
    : false;

  // ==================================================
  // HELPERS
  // ==================================================

  const getConversationName = () => {
    return (
      activeUserConversation?.admin?.name ||
      activeUserConversation?.assignedAdmin?.name ||
      "G-Shop Support"
    );
  };

  const getAdminInitial = () => {
    const name = getConversationName();

    return name?.charAt(0)?.toUpperCase() || "G";
  };

  const scrollToBottom = useCallback((behavior = "smooth") => {
    const container = messagesContainerRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  }, []);

  // ==================================================
  // INITIALIZE CONVERSATION
  // ==================================================

  const initializeConversation = useCallback(async () => {
    if (activeUserConversation?._id) {
      return activeUserConversation;
    }

    setIsInitializing(true);

    try {
      const result = await dispatch(getOrCreateConversation()).unwrap();

      const conversation =
        result?.conversation ||
        result?.data?.conversation ||
        result?.data ||
        result;

      if (conversation?._id) {
        dispatch(setActiveUserConversation(conversation));

        return conversation;
      }

      return null;
    } catch (error) {
      console.error("CHAT INITIALIZATION ERROR:", error);

      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [dispatch, activeUserConversation]);

  // ==================================================
  // OPEN CHAT
  // ==================================================

  const handleOpenChat = async () => {
    setIsOpen(true);
    setShowMenu(false);

    if (!activeUserConversation?._id) {
      await initializeConversation();
    }
  };

  // ==================================================
  // CLOSE CHAT
  // ==================================================

  const handleCloseChat = () => {
    setIsOpen(false);
    setShowMenu(false);
  };

  // ==================================================
  // LOAD MESSAGES
  // ==================================================

  useEffect(() => {
    if (!isOpen || !conversationId) {
      return;
    }

    dispatch(
      getUserMessages({
        conversationId,
        params: {
          page: 1,
          limit: 50,
        },
      }),
    );
  }, [dispatch, isOpen, conversationId]);

  // ==================================================
  // JOIN CONVERSATION
  // ==================================================

  useEffect(() => {
    if (!isOpen || !conversationId) {
      return;
    }

    if (previousConversationRef.current === conversationId) {
      return;
    }

    const previousConversation = previousConversationRef.current;

    if (previousConversation) {
      leaveConversation(previousConversation);
    }

    joinConversation(conversationId);

    previousConversationRef.current = conversationId;

    return () => {
      leaveConversation(conversationId);
    };
  }, [isOpen, conversationId, joinConversation, leaveConversation]);

  // ==================================================
  // MARK READ
  // ==================================================

  useEffect(() => {
    if (!isOpen || !conversationId || !userMessages.length) {
      return;
    }

    markMessagesRead(conversationId);

    dispatch(markUserMessagesRead(conversationId));
  }, [isOpen, conversationId, userMessages.length, dispatch, markMessagesRead]);

  // ==================================================
  // AUTO SCROLL
  // ==================================================

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const timer = setTimeout(() => {
      scrollToBottom("smooth");
    }, 50);

    return () => clearTimeout(timer);
  }, [userMessages.length, adminTyping, isOpen, scrollToBottom]);

  // ==================================================
  // SCROLL HANDLER
  // ==================================================

  const handleMessagesScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    setShowScrollButton(distanceFromBottom > 250);
  };

  // ==================================================
  // INPUT
  // ==================================================

  const handleInputChange = (event) => {
    const value = event.target.value;

    setMessageText(value);

    if (!conversationId) {
      return;
    }

    startTyping(conversationId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(conversationId);
    }, 1200);
  };

  // ==================================================
  // STOP TYPING
  // ==================================================

  const stopCurrentTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    if (conversationId) {
      stopTyping(conversationId);
    }
  };

  // ==================================================
  // SELECT FILES
  // ==================================================

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    setSelectedFiles((previous) => [...previous, ...files]);

    event.target.value = "";
  };

  // ==================================================
  // REMOVE FILE
  // ==================================================

  const removeSelectedFile = (index) => {
    setSelectedFiles((previous) =>
      previous.filter((_, fileIndex) => fileIndex !== index),
    );
  };

  // ==================================================
  // UPLOAD ATTACHMENTS
  // ==================================================

  const uploadAttachments = async () => {
    if (!selectedFiles.length) {
      return [];
    }

    try {
      const result = await dispatch(
        uploadChatAttachments(selectedFiles),
      ).unwrap();

      return (
        result?.attachments ||
        result?.data?.attachments ||
        result?.files ||
        result?.data?.files ||
        []
      );
    } catch (error) {
      console.error("CHAT ATTACHMENT UPLOAD ERROR:", error);

      return [];
    }
  };

  // ==================================================
  // SEND MESSAGE
  // ==================================================

  const handleSendMessage = async () => {
    const text = messageText.trim();

    if (!conversationId) {
      return;
    }

    if (!text && !selectedFiles.length) {
      return;
    }

    if (!socketConnected) {
      console.warn("CHAT SOCKET IS NOT CONNECTED");
      return;
    }

    setSendLoading(true);

    stopCurrentTyping();

    try {
      let attachments = [];

      if (selectedFiles.length) {
        attachments = await uploadAttachments();
      }

      const sent = sendMessage({
        conversationId,
        text,
        attachments,
      });

      if (!sent) {
        console.error("MESSAGE WAS NOT SENT");
        return;
      }

      setMessageText("");
      setSelectedFiles([]);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }

      setTimeout(() => {
        scrollToBottom("smooth");
      }, 50);
    } finally {
      setSendLoading(false);
    }
  };

  // ==================================================
  // ENTER SEND
  // ==================================================

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSendMessage();
    }
  };

  // ==================================================
  // TEXTAREA
  // ==================================================

  const handleTextareaInput = (event) => {
    event.target.style.height = "auto";

    event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;

    handleInputChange(event);
  };

  // ==================================================
  // FORMAT TIME
  // ==================================================

  const formatMessageTime = (date) => {
    if (!date) {
      return "";
    }

    try {
      return new Intl.DateTimeFormat("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      }).format(new Date(date));
    } catch {
      return "";
    }
  };

  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatMessageDate = (date) => {
    if (!date) {
      return "";
    }

    try {
      return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(date));
    } catch {
      return "";
    }
  };

  // ==================================================
  // SAME DAY
  // ==================================================

  const isSameDay = (firstDate, secondDate) => {
    if (!firstDate || !secondDate) {
      return false;
    }

    const first = new Date(firstDate);
    const second = new Date(secondDate);

    return (
      first.getDate() === second.getDate() &&
      first.getMonth() === second.getMonth() &&
      first.getFullYear() === second.getFullYear()
    );
  };

  // ==================================================
  // IMPORTANT:
  // USER SIDE:
  //
  // User  -> RIGHT
  // Admin -> LEFT
  //
  // ==================================================

  const isOwnMessage = (message) => {
    const senderType = String(message?.senderType || "").toLowerCase();

    return senderType === "user";
  };

  // ==================================================
  // ATTACHMENT URL
  // ==================================================

  const getAttachmentUrl = (attachment) => {
    return (
      attachment?.url ||
      attachment?.secure_url ||
      attachment?.fileUrl ||
      attachment?.src ||
      ""
    );
  };

  // ==================================================
  // ATTACHMENT NAME
  // ==================================================

  const getAttachmentName = (attachment) => {
    return (
      attachment?.name ||
      attachment?.originalName ||
      attachment?.filename ||
      "Attachment"
    );
  };

  // ==================================================
  // RENDER ATTACHMENT
  // ==================================================

  const renderAttachment = (attachment, index) => {
    const url = getAttachmentUrl(attachment);

    if (!url) {
      return null;
    }

    const type =
      attachment?.type ||
      attachment?.mimeType ||
      attachment?.resourceType ||
      "";

    const isImage =
      type.startsWith("image/") || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url);

    if (isImage) {
      return (
        <a
          key={`${url}-${index}`}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block overflow-hidden rounded-xl"
        >
          <img
            src={url}
            alt={getAttachmentName(attachment)}
            className="max-h-60 w-full object-cover transition duration-200 hover:scale-[1.02]"
          />
        </a>
      );
    }

    return (
      <a
        key={`${url}-${index}`}
        href={url}
        target="_blank"
        rel="noreferrer"
        className="
          mt-2 flex items-center gap-3 rounded-xl
          border border-gray-200 bg-white/80
          p-3 text-sm transition
          hover:bg-gray-50
          dark:border-gray-700
          dark:bg-gray-800/80
          dark:hover:bg-gray-700
        "
      >
        <FileText className="h-5 w-5 shrink-0" />

        <span className="min-w-0 flex-1 truncate">
          {getAttachmentName(attachment)}
        </span>

        <Download className="h-4 w-4 shrink-0" />
      </a>
    );
  };

  // ==================================================
  // RENDER MESSAGE
  // ==================================================

  const renderMessage = (message, index) => {
    const own = isOwnMessage(message);

    const messageDate =
      message?.createdAt || message?.sentAt || message?.timestamp;

    const previousMessage = userMessages[index - 1];

    const previousDate =
      previousMessage?.createdAt ||
      previousMessage?.sentAt ||
      previousMessage?.timestamp;

    const showDate = !previousMessage || !isSameDay(previousDate, messageDate);

    const attachments = message?.attachments || message?.files || [];

    return (
      <div key={message?._id || `${messageDate}-${index}`}>
        {/* DATE */}
        {showDate && (
          <div className="my-4 flex justify-center">
            <span
              className="
                rounded-full
                bg-gray-100
                px-3 py-1
                text-[11px]
                font-medium
                text-gray-500
                dark:bg-gray-800
                dark:text-gray-400
              "
            >
              {formatMessageDate(messageDate)}
            </span>
          </div>
        )}

        {/* ==================================================
            MESSAGE ROW

            USER  -> justify-end
            ADMIN -> justify-start
        ================================================== */}

        <div
          className={`
            mb-3 flex w-full
            ${own ? "justify-end" : "justify-start"}
          `}
        >
          {/* ADMIN AVATAR - LEFT */}
          {!own && (
            <div
              className="
                mr-2 mt-auto
                flex h-8 w-8 shrink-0
                items-center justify-center
                rounded-full
                bg-gradient-to-br
                from-indigo-500
                to-violet-600
                text-xs font-bold
                text-white
              "
            >
              {getAdminInitial()}
            </div>
          )}

          {/* MESSAGE CONTENT */}
          <div
            className={`
              flex max-w-[78%]
              flex-col
              sm:max-w-[70%]
              ${own ? "items-end" : "items-start"}
            `}
          >
            {/* BUBBLE */}
            <div
              className={`
                rounded-2xl
                px-4 py-2.5
                shadow-sm

                ${
                  own
                    ? `
                      rounded-br-md
                      bg-indigo-600
                      text-white
                    `
                    : `
                      rounded-bl-md
                      border
                      border-gray-200
                      bg-white
                      text-gray-800
                      dark:border-gray-700
                      dark:bg-gray-800
                      dark:text-gray-100
                    `
                }
              `}
            >
              {/* TEXT */}
              {message?.text && (
                <p
                  className="
                    whitespace-pre-wrap
                    break-words
                    text-sm
                    leading-5
                  "
                >
                  {message.text}
                </p>
              )}

              {/* ATTACHMENTS */}
              {attachments.length > 0 && (
                <div className="space-y-1">
                  {attachments.map((attachment, attachmentIndex) =>
                    renderAttachment(attachment, attachmentIndex),
                  )}
                </div>
              )}
            </div>

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
                ${own ? "justify-end" : "justify-start"}
              `}
            >
              <span>{formatMessageTime(messageDate)}</span>

              {/* ONLY USER MESSAGES SHOW STATUS */}
              {own && (
                <>
                  {message?.messageStatus === "read" || message?.isRead ? (
                    <CheckCheck className="h-3.5 w-3.5 text-indigo-500" />
                  ) : message?.messageStatus === "delivered" ? (
                    <CheckCheck className="h-3.5 w-3.5" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ==================================================
  // CLEANUP
  // ==================================================

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <>
      {/* ==================================================
          FLOATING BUTTON
      ================================================== */}

      {!isOpen && (
        <button
          type="button"
          onClick={handleOpenChat}
          className="
            fixed
            bottom-5
            right-5
            z-[999]
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-gradient-to-br
            from-indigo-600
            to-violet-600
            text-white
            shadow-xl
            shadow-indigo-500/30
            transition-all
            duration-200
            hover:scale-105
            hover:shadow-2xl
            active:scale-95
            sm:bottom-6
            sm:right-6
          "
          aria-label="Open chat"
        >
          <Headset className="h-6 w-6" />

          {(() => {
            const unread =
              activeUserConversation?.unreadForUser ||
              userConversations?.reduce(
                (total, conversation) =>
                  total + Number(conversation?.unreadForUser || 0),
                0,
              ) ||
              0;

            if (!unread) {
              return null;
            }

            return (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-red-500
                  px-1
                  text-[10px]
                  font-bold
                  text-white
                  ring-2
                  ring-white
                  dark:ring-gray-900
                "
              >
                {unread > 99 ? "99+" : unread}
              </span>
            );
          })()}
        </button>
      )}

      {/* ==================================================
          CHAT WINDOW
      ================================================== */}

      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-[999]
            flex
            flex-col
            bg-white
            dark:bg-gray-950

            sm:inset-auto
            sm:bottom-5
            sm:right-5
            sm:h-[650px]
            sm:w-[390px]
            sm:rounded-2xl
            sm:border
            sm:border-gray-200
            sm:shadow-2xl

            dark:sm:border-gray-800
          "
        >
          {/* ==================================================
              HEADER
          ================================================== */}

          <div
            className="
              flex
              shrink-0
              items-center
              justify-between
              border-b
              border-gray-200
              bg-white
              px-4
              py-3
              dark:border-gray-800
              dark:bg-gray-900
              sm:rounded-t-2xl
            "
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative">
                <div
                  className="
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-indigo-500
                    to-violet-600
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {getAdminInitial()}
                </div>

                {isAdminOnline && (
                  <span
                    className="
                      absolute
                      bottom-0
                      right-0
                      h-3
                      w-3
                      rounded-full
                      bg-emerald-500
                      ring-2
                      ring-white
                      dark:ring-gray-900
                    "
                  />
                )}
              </div>

              <div className="min-w-0">
                <h3
                  className="
                    truncate
                    text-sm
                    font-semibold
                    text-gray-900
                    dark:text-white
                  "
                >
                  {getConversationName()}
                </h3>

                <div className="mt-0.5 flex items-center gap-1.5">
                  {socketConnected ? (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        {adminTyping
                          ? "Typing..."
                          : isAdminOnline
                            ? "Online"
                            : "Support"}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                      <span className="text-[11px] text-gray-500 dark:text-gray-400">
                        Connecting...
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="hidden sm:block">
                {socketConnected ? (
                  <Wifi className="h-4 w-4 text-emerald-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowMenu((previous) => !previous)}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    text-gray-500
                    transition
                    hover:bg-gray-100
                    dark:text-gray-400
                    dark:hover:bg-gray-800
                  "
                >
                  <MoreVertical className="h-5 w-5" />
                </button>

                {/* {showMenu && (
                  <div
                    className="
                      absolute
                      right-0
                      top-10
                      z-20
                      w-40
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-1
                      shadow-xl
                      dark:border-gray-700
                      dark:bg-gray-900
                    "
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        scrollToBottom();
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        rounded-lg
                        px-3
                        py-2
                        text-left
                        text-xs
                        text-gray-700
                        hover:bg-gray-100
                        dark:text-gray-300
                        dark:hover:bg-gray-800
                      "
                    >
                      Go to latest
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        dispatch(clearActiveUserConversation());
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        rounded-lg
                        px-3
                        py-2
                        text-left
                        text-xs
                        text-red-500
                        hover:bg-red-50
                        dark:hover:bg-red-950/30
                      "
                    >
                      Clear conversation
                    </button>
                  </div>
                )} */}
              </div>

              <button
                type="button"
                onClick={handleCloseChat}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  text-gray-500
                  transition
                  hover:bg-gray-100
                  dark:text-gray-400
                  dark:hover:bg-gray-800
                "
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* ==================================================
              CHAT BODY
          ================================================== */}

          <div className="relative flex min-h-0 flex-1 flex-col">
            <div
              ref={messagesContainerRef}
              onScroll={handleMessagesScroll}
              className="
                min-h-0
                flex-1
                overflow-y-auto
                bg-gray-50
                px-4
                py-4
                dark:bg-gray-950
                [scrollbar-width:none]
                [&::-webkit-scrollbar]:hidden
              "
            >
              {/* LOADING */}

              {(isInitializing || messagesLoading) &&
                userMessages.length === 0 && (
                  <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />

                      <p className="text-xs text-gray-500">Loading chat...</p>
                    </div>
                  </div>
                )}

              {/* EMPTY */}

              {!isInitializing &&
                !messagesLoading &&
                userMessages.length === 0 && (
                  <div className="flex min-h-full items-center justify-center">
                    <div className="max-w-[270px] text-center">
                      <div
                        className="
                          mx-auto
                          mb-4
                          flex
                          h-16
                          w-16
                          items-center
                          justify-center
                          rounded-2xl
                          bg-indigo-100
                          text-indigo-600
                          dark:bg-indigo-950
                          dark:text-indigo-400
                        "
                      >
                        <Headphones className="h-8 w-8" />
                      </div>

                      <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                        Welcome to G-Shop Support
                      </h4>

                      <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                        Have a question about your order, products, payments or
                        anything else? We're here to help.
                      </p>
                    </div>
                  </div>
                )}

              {/* ==================================================
                  MESSAGES
              ================================================== */}

              {userMessages.map(renderMessage)}

              {/* ==================================================
                  ADMIN TYPING
              ================================================== */}

              {adminTyping && (
                <div className="mb-3 flex items-end gap-2">
                  <div
                    className="
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-gradient-to-br
                      from-indigo-500
                      to-violet-600
                      text-xs
                      font-bold
                      text-white
                    "
                  >
                    {getAdminInitial()}
                  </div>

                  <div
                    className="
                      rounded-2xl
                      rounded-bl-md
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-3
                      dark:border-gray-700
                      dark:bg-gray-800
                    "
                  >
                    <div className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />

                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                        style={{
                          animationDelay: "100ms",
                        }}
                      />

                      <span
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400"
                        style={{
                          animationDelay: "200ms",
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SCROLL BUTTON */}

            {showScrollButton && (
              <button
                type="button"
                onClick={() => scrollToBottom()}
                className="
                  absolute
                  bottom-24
                  right-4
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  text-gray-600
                  shadow-lg
                  transition
                  hover:scale-105
                  dark:border-gray-700
                  dark:bg-gray-800
                  dark:text-gray-300
                "
              >
                <ArrowDown className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* ==================================================
              SELECTED FILES
          ================================================== */}

          {selectedFiles.length > 0 && (
            <div
              className="
                shrink-0
                border-t
                border-gray-200
                bg-white
                px-3
                py-2
                dark:border-gray-800
                dark:bg-gray-900
              "
            >
              <div
                className="
                  flex
                  gap-2
                  overflow-x-auto
                  [scrollbar-width:none]
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {selectedFiles.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="
                        relative
                        flex
                        shrink-0
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-50
                        px-3
                        py-2
                        dark:border-gray-700
                        dark:bg-gray-800
                      "
                  >
                    {file.type?.startsWith("image/") ? (
                      <ImageIcon className="h-4 w-4 text-indigo-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-indigo-500" />
                    )}

                    <span
                      className="
                          max-w-28
                          truncate
                          text-[11px]
                          text-gray-600
                          dark:text-gray-300
                        "
                    >
                      {file.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeSelectedFile(index)}
                      className="
                          flex
                          h-4
                          w-4
                          items-center
                          justify-center
                          rounded-full
                          bg-gray-200
                          text-gray-600
                          hover:bg-red-100
                          hover:text-red-500
                          dark:bg-gray-700
                        "
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================
              INPUT
          ================================================== */}

          <div
            className="
              shrink-0
              border-t
              border-gray-200
              bg-white
              p-3
              dark:border-gray-800
              dark:bg-gray-900
              sm:rounded-b-2xl
            "
          >
            {!socketConnected && (
              <div
                className="
                  mb-2
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  bg-red-50
                  px-3
                  py-2
                  text-[11px]
                  text-red-600
                  dark:bg-red-950/30
                  dark:text-red-400
                "
              >
                <WifiOff className="h-3.5 w-3.5" />

                <span>Connecting to support...</span>
              </div>
            )}

            <div
              className="
                flex
                items-end
                gap-2
                rounded-2xl
                border
                border-gray-200
                bg-gray-50
                p-2
                transition
                focus-within:border-indigo-400
                focus-within:ring-2
                focus-within:ring-indigo-100
                dark:border-gray-700
                dark:bg-gray-800
                dark:focus-within:border-indigo-500
                dark:focus-within:ring-indigo-950
              "
            >
              {/* FILE INPUT */}

              <input
                ref={fileInputRef}
                type="file"
                multiple
                hidden
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={sendLoading || uploadingAttachments}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-gray-500
                  transition
                  hover:bg-gray-200
                  hover:text-indigo-600
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  dark:text-gray-400
                  dark:hover:bg-gray-700
                "
              >
                {uploadingAttachments ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Paperclip className="h-5 w-5" />
                )}
              </button>

              {/* TEXTAREA */}

              <textarea
                ref={textareaRef}
                value={messageText}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                onBlur={stopCurrentTyping}
                disabled={sendLoading || isInitializing || !conversationId}
                rows={1}
                placeholder="Type a message..."
                className="
                  max-h-[120px]
                  min-h-[36px]
                  flex-1
                  resize-none
                  bg-transparent
                  px-1
                  py-2
                  text-sm
                  text-gray-800
                  outline-none
                  placeholder:text-gray-400
                  dark:text-gray-100
                "
              />

              {/* SEND */}

              <button
                type="button"
                onClick={handleSendMessage}
                disabled={
                  sendLoading ||
                  uploadingAttachments ||
                  !socketConnected ||
                  (!messageText.trim() && selectedFiles.length === 0)
                }
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-indigo-600
                  text-white
                  shadow-md
                  shadow-indigo-500/20
                  transition
                  hover:bg-indigo-700
                  disabled:cursor-not-allowed
                  disabled:bg-gray-300
                  disabled:shadow-none
                  dark:disabled:bg-gray-700
                "
              >
                {sendLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>

            <div className="mt-1.5 flex items-center justify-between px-1">
              <p className="text-[10px] text-gray-400">Press Enter to send</p>

              <p className="text-[10px] text-gray-400">
                Shift + Enter for new line
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
