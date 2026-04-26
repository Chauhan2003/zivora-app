import { useState, useEffect, useRef, useCallback } from "react";
import { Phone, Video, Info, Send, MessageSquare, Search, X, ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../utils/apiClient";
import { chatRoute } from "../utils/routes";
import { useSocket } from "../context/socket";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
};

const formatMsgTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MessagePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { socket, onlineUsers } = useSocket();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await apiClient.get(`${chatRoute}/conversations`);
        if (res?.status === 200) {
          setConversations(res.data?.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!selectedConv) return;

    const fetchMessages = async () => {
      try {
        const res = await apiClient.get(
          `${chatRoute}/${selectedConv._id}/messages`,
        );
        if (res?.status === 200) {
          setMessages(res.data?.data || []);
          setTimeout(scrollToBottom, 100);
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();

    // Mark as seen
    apiClient.put(`${chatRoute}/${selectedConv._id}/seen`).catch(() => {});

    // Update unread count in sidebar
    setConversations((prev) =>
      prev.map((c) =>
        c._id === selectedConv._id ? { ...c, unreadCount: 0 } : c,
      ),
    );
  }, [selectedConv?._id]);

  // Scroll to bottom when chat view becomes visible (mobile)
  useEffect(() => {
    if (selectedConv && messages.length > 0) {
      setTimeout(scrollToBottom, 150);
    }
  }, [selectedConv]);

  // Socket: listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (selectedConv && msg.conversationId === selectedConv._id) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 100);
        apiClient.put(`${chatRoute}/${selectedConv._id}/seen`).catch(() => {});
      }

      // Update conversation list
      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c._id === msg.conversationId) {
            return {
              ...c,
              lastMessage: {
                text: msg.text,
                senderId: msg.senderId,
                seen: selectedConv?._id === msg.conversationId,
                createdAt: msg.createdAt,
              },
              lastMessageAt: msg.createdAt,
              unreadCount:
                selectedConv?._id === msg.conversationId
                  ? 0
                  : (c.unreadCount || 0) + 1,
            };
          }
          return c;
        });
        return updated.sort(
          (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
        );
      });
    };

    const handleTyping = ({ conversationId }) => {
      if (selectedConv && conversationId === selectedConv._id) {
        setTyping(true);
      }
    };

    const handleStopTyping = ({ conversationId }) => {
      if (selectedConv && conversationId === selectedConv._id) {
        setTyping(false);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedConv?._id]);

  // Send message
  const handleSend = async () => {
    if (!text.trim() || !selectedConv || sending) return;

    const msgText = text.trim();
    setText("");
    setSending(true);

    // Emit stop typing
    if (socket && selectedConv) {
      socket.emit("stopTyping", {
        conversationId: selectedConv._id,
        receiverId: selectedConv.user?._id,
      });
    }

    try {
      const res = await apiClient.post(
        `${chatRoute}/${selectedConv._id}/messages`,
        { text: msgText },
      );
      if (res?.status === 201) {
        const newMsg = res.data?.data;
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(scrollToBottom, 100);

        setConversations((prev) => {
          const updated = prev.map((c) => {
            if (c._id === selectedConv._id) {
              return {
                ...c,
                lastMessage: {
                  text: newMsg.text,
                  senderId: newMsg.senderId,
                  seen: false,
                  createdAt: newMsg.createdAt,
                },
                lastMessageAt: newMsg.createdAt,
              };
            }
            return c;
          });
          return updated.sort(
            (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt),
          );
        });
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  // Handle typing indicator
  const handleTypingInput = (e) => {
    setText(e.target.value);

    if (socket && selectedConv) {
      socket.emit("typing", {
        conversationId: selectedConv._id,
        receiverId: selectedConv.user?._id,
      });

      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("stopTyping", {
          conversationId: selectedConv._id,
          receiverId: selectedConv.user?._id,
        });
      }, 1500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-400 border-t-blue-600 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const chatArea = (
    <>
      {/* Chat Header */}
      <div className="h-16 px-4 md:px-6 border-b border-gray-300 dark:border-[#363636] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedConv(null)}
            className="w-8 h-8 rounded-full hover:bg-muted transition-colors flex items-center justify-center md:hidden"
          >
            <ArrowLeft size={20} />
          </button>
          <button
            onClick={() => navigate(`/profile/${selectedConv?.user?.username}`)}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <img
                src={selectedConv?.user?.avatar || "/profileImage.jpg"}
                alt={selectedConv?.user?.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              {onlineUsers.has(selectedConv?.user?._id) && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">
                {selectedConv?.user?.username}
              </p>
              {typing ? (
                <p className="text-xs text-green-500">typing...</p>
              ) : onlineUsers.has(selectedConv?.user?._id) ? (
                <p className="text-xs text-green-500">Active now</p>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {selectedConv?.user?.fullName}
                </p>
              )}
            </div>
          </button>
        </div>
        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
          <button className="w-9 h-9 rounded-full hover:bg-muted transition-colors flex items-center justify-center">
            <Phone size={18} />
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-muted transition-colors flex items-center justify-center">
            <Video size={18} />
          </button>
          <button className="w-9 h-9 rounded-full hover:bg-muted transition-colors items-center justify-center hidden sm:flex">
            <Info size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto disableScrollbar px-4 md:px-6 py-4 flex flex-col gap-1">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <img
              src={selectedConv?.user?.avatar || "/profileImage.jpg"}
              alt={selectedConv?.user?.username}
              className="w-20 h-20 rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">
              {selectedConv?.user?.fullName}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              @{selectedConv?.user?.username}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Send a message to start the conversation
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?._id;
            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] md:max-w-[65%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-gray-100 dark:bg-[#262626] text-foreground rounded-bl-md"
                  }`}
                >
                  <p className="break-words">{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMe
                        ? "text-blue-200"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {formatMsgTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-[#262626] rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-300 dark:border-[#363636] shrink-0 pb-16 md:pb-4">
        <div className="flex items-center gap-3 bg-gray-100 dark:bg-[#262626] rounded-full px-4 md:px-5 py-2.5">
          <input
            type="text"
            value={text}
            onChange={handleTypingInput}
            onKeyDown={handleKeyDown}
            placeholder="Message..."
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="text-blue-600 disabled:text-gray-400 transition-colors disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </>
  );

  const conversationList = (
    <div className={`w-full md:w-[360px] border-r border-gray-300 dark:border-[#363636] flex flex-col shrink-0 ${selectedConv ? "hidden md:flex" : "flex"}`}>
      <div className="h-16 px-4 border-b border-gray-300 dark:border-[#363636] flex items-center justify-between shrink-0">
        {showSearch ? (
          <div className="flex items-center gap-2 w-full">
            <Search size={16} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-gray-500"
            />
            <button
              onClick={() => { setShowSearch(false); setSearch(""); }}
              className="w-7 h-7 rounded-full hover:bg-muted transition-colors flex items-center justify-center shrink-0"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
        ) : (
          <>
            <h2 className="font-semibold text-base">Messages</h2>
            <button
              onClick={() => setShowSearch(true)}
              className="w-8 h-8 rounded-full hover:bg-muted transition-colors flex items-center justify-center"
            >
              <Search size={18} />
            </button>
          </>
        )}
      </div>

      <div className="flex-1 overflow-y-auto disableScrollbar">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 px-6 text-center">
            <MessageSquare size={48} className="mb-3 text-gray-400" />
            <p className="text-sm">No conversations yet</p>
            <p className="text-xs mt-1">
              Message someone from their profile to start chatting
            </p>
          </div>
        ) : (
          conversations
          .filter((conv) => {
            if (!search.trim()) return true;
            const q = search.toLowerCase();
            return (
              conv.user?.username?.toLowerCase().includes(q) ||
              conv.user?.fullName?.toLowerCase().includes(q)
            );
          })
          .map((conv) => (
            <button
              key={conv._id}
              onClick={() => setSelectedConv(conv)}
              className={`w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-muted transition-colors ${
                selectedConv?._id === conv._id ? "bg-muted" : ""
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={conv.user?.avatar || "/profileImage.jpg"}
                  alt={conv.user?.username}
                  className="w-14 h-14 rounded-full object-cover"
                />
                {onlineUsers.has(conv.user?._id) && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {conv.user?.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {conv.lastMessage?.senderId === currentUser?._id
                    ? `You: ${conv.lastMessage?.text || ""}`
                    : conv.lastMessage?.text || ""}
                  {conv.lastMessage?.createdAt && (
                    <span> · {formatTime(conv.lastMessage.createdAt)}</span>
                  )}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen flex bg-background">
      {conversationList}

      {/* Mobile: show chat area when conversation selected */}
      {selectedConv && (
        <div className="flex flex-col flex-1 min-w-0 md:hidden">
          {chatArea}
        </div>
      )}

      {/* Desktop: always show chat area panel */}
      <div className="hidden md:flex flex-1 flex-col min-w-0">
        {selectedConv ? (
          chatArea
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <MessageSquare size={64} className="mb-4 text-gray-300 dark:text-gray-600" />
            <h2 className="text-xl font-semibold mb-1">Your messages</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Send a message to start a chat
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagePage;
