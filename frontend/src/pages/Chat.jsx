import { useState, useRef, useEffect } from "react"
import {
  MessageSquare,
  Plus,
  Menu,
  X,
  Send,
  User,
  Bot,
  Trash2,
  MoreVertical,
  LogOut,
  Code,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useNavigate } from 'react-router-dom'; 

// Get backend URL from environment variables (Vite uses VITE_ prefix)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL 

// Enhanced Navbar Component for Chat
const ChatNavbar = ({ onToggleSidebar, onLogout, scrollY, isScrolling }) => {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrollY > 50
          ? "bg-white/90 backdrop-blur-xl shadow-2xl border-b border-gray-200/50"
          : "bg-transparent backdrop-blur-sm"
      } ${isScrolling ? "transform -translate-y-1" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white font-bold text-lg shadow-xl transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110">
                <Code className="w-6 h-6" />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CodeMaster
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">AI-Powered Development</span>
            </div>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={onToggleSidebar}
              className="px-5 py-2.5 text-gray-700 hover:text-indigo-600 transition-all duration-300 font-medium rounded-lg hover:bg-gray-50 relative group flex items-center space-x-2 hover:scale-105 active:scale-95"
            >
              <Menu className="w-4 h-4" />
              <span>Chats</span>
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={onLogout}
              className="relative px-6 py-2.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={onToggleSidebar}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-300 relative group hover:scale-105 active:scale-95"
            >
              <Menu size={24} className="text-gray-700 group-hover:text-indigo-600 transition-colors duration-300" />
            </button>

            <button
              onClick={onLogout}
              className="p-2.5 rounded-xl hover:bg-red-50 text-red-600 hover:text-red-700 transition-all duration-300 relative group hover:scale-105 active:scale-95"
            >
              <LogOut size={20} className="transition-colors duration-300" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentMessage, setCurrentMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [chatHistory, setChatHistory] = useState([])
  const [activeChat, setActiveChat] = useState(null)
  const [currentThreadId, setCurrentThreadId] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [scrollY, setScrollY] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showLogoutToast, setShowLogoutToast] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
    const navigate = useNavigate();


  // Scroll tracking for navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolling(currentScrollY > scrollY)
      setScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrollY])

  // Fetch user and thread_ids only
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        if (!storedUser) throw new Error("No user in localStorage")

        const user = JSON.parse(storedUser)
        setUserProfile(user)

        const response = await fetch(`${BACKEND_URL}/chat/threads?email=${user.email}`)
        if (!response.ok) throw new Error("Failed to fetch threads")

        const data = await response.json()
        const threadIds = data.thread_ids || []

        // Just use thread_id as both id and display text - reverse the order
        const chats = threadIds.reverse().map((thread_id) => ({
          id: thread_id,
          thread_id,
          title: thread_id, // Display thread_id
        }))

        setChatHistory(chats)

        if (chats.length > 0 && !activeChat) {
          const first = chats[0]
          setActiveChat(first.id)
          setCurrentThreadId(first.thread_id)
        }
      } catch (error) {
        console.error("Error fetching threads:", error)
      }
    }

    fetchData()
  }, [activeChat])

 const loadChatHistory = async (threadId) => {
  if (!threadId || !userProfile?.email) return

  setIsLoadingHistory(true)
  try {
    const response = await fetch(`${BACKEND_URL}/chat/history/${threadId}?email=${userProfile.email}`)
    if (!response.ok) throw new Error("Failed to load chat history")

    const data = await response.json()

    // Convert the backend format to our message format - keep original order
    const formatted = []
    if (data.messages && Array.isArray(data.messages)) {
      data.messages.forEach((msgPair, index) => {
        // Add human message
        if (msgPair.Human) {
          formatted.push({
            id: `${threadId}-human-${index}`,
            text: msgPair.Human,
            isBot: false,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          })
        }

        // Add assistant message
        if (msgPair.Assistant) {
          formatted.push({
            id: `${threadId}-assistant-${index}`,
            text: msgPair.Assistant,
            isBot: true,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          })
        }
      })
    }

    setMessages(formatted)
  } catch (error) {
    console.error("Error loading chat history:", error)
    setMessages([])
  } finally {
    setIsLoadingHistory(false)
  }
}


  // Load messages when currentThreadId changes
  useEffect(() => {
    if (currentThreadId && userProfile?.email) {
      loadChatHistory(currentThreadId)
    }
  }, [currentThreadId, userProfile?.email])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleLogout = () => {
    setShowLogoutToast(true)
  }

  const confirmLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setShowLogoutToast(false)
    navigate("/login")

    console.log("User logged out")
  }

  const cancelLogout = () => {
    setShowLogoutToast(false)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createNewChat = () => {
    const tempId = `new_${Date.now()}`
    const newChat = {
      id: tempId,
      thread_id: null, // Set to null for new chats
      title: "New Chat",
    }

    setChatHistory((prev) => [newChat, ...prev])
    setActiveChat(tempId)
    setCurrentThreadId(null) // Clear thread ID for new chat
    setMessages([])
    setSidebarOpen(false)
  }

  const selectChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId)
    if (chat) {
      setActiveChat(chatId)
      setCurrentThreadId(chat.thread_id)
      setSidebarOpen(false)
      // Messages will be loaded automatically by useEffect
    }
  }

  const deleteChat = async (chatId) => {
    try {
      const chat = chatHistory.find((c) => c.id === chatId)
      if (chat?.thread_id) {
        await fetch(`${BACKEND_URL}/chat/delete?thread_id=${chat.thread_id}`, {
          method: "DELETE",
        })
      }
    } catch (error) {
      console.error("Delete failed:", error)
    }

    setChatHistory((prev) => prev.filter((c) => c.id !== chatId))
    if (activeChat === chatId) {
      setActiveChat(null)
      setCurrentThreadId(null)
      setMessages([])
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim() || !userProfile?.email || isSending) return

    const userMessage = {
      id: Date.now(),
      text: currentMessage,
      isBot: false,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsSending(true)
    setIsTyping(true)

    try {
      const requestBody = {
        email: userProfile.email,
        message: currentMessage,
        ...(currentThreadId && { thread_id: currentThreadId }), // Only include thread_id if it exists
      }

      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.thread_id && !currentThreadId) {
        // This is a new chat, update the thread_id
        setCurrentThreadId(data.thread_id)

        // Update the chat history to reflect the new thread_id
        setChatHistory((prev) =>
          prev.map((chat) =>
            chat.id === activeChat ? { ...chat, thread_id: data.thread_id, title: data.thread_id } : chat,
          ),
        )
      }

      const botMessage = {
        id: Date.now() + 1,
        text: data.response || "I'm sorry, I couldn't process your request.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Send message failed:", error)

      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting to the server. Please try again.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setCurrentMessage("")
      setIsSending(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50">
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <BackgroundAmbient />

      {/* Logout Toast */}
      {showLogoutToast && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={cancelLogout} />
          <div className="relative bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 transform transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Confirm Logout</h3>
                <p className="text-sm text-slate-600">Are you sure you want to logout?</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      <ChatNavbar onToggleSidebar={toggleSidebar} onLogout={handleLogout} scrollY={scrollY} isScrolling={isScrolling} />

      {/* Sidebar */}
      {sidebarOpen && (
        <>
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm opacity-100 transition-opacity duration-300"
          />
          <div
            className={`fixed left-0 top-0 z-50 h-full w-80 bg-white/90 backdrop-blur-xl border-r border-white/20 shadow-xl flex flex-col transform transition-transform duration-300 ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="pt-4 p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Chats</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-600" />
                </button>
              </div>

              <button
                onClick={createNewChat}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 transition-all hover:scale-102 active:scale-98"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">New Chat</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              <div className="space-y-2">
                {chatHistory.map((chat) => (
                  <ChatHistoryItem
                    key={chat.id}
                    chat={chat}
                    isActive={activeChat === chat.id}
                    onSelect={() => selectChat(chat.id)}
                    onDelete={() => deleteChat(chat.id)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-white/10 p-4 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 hover:bg-white/80 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center text-white font-semibold text-sm">
                  {userProfile?.name?.charAt(0).toUpperCase() || userProfile?.email?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">{userProfile?.name || "User"}</p>
                  <p className="text-xs text-slate-600 truncate">{userProfile?.email}</p>
                </div>
                <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                  <MoreVertical className="h-4 w-4 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Chat Area */}
      <div className="relative z-10 flex flex-col h-screen pt-16 lg:pt-18">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {isLoadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 text-violet-600 animate-spin" />
                  <span className="text-slate-600">Loading chat history...</span>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-4 opacity-100 transform translate-y-0 transition-all duration-500">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No messages</h3>
                <p className="text-slate-600 mb-6">
                  {activeChat ? "Start the conversation by sending a message!" : "Select a thread or start a new one."}
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator />}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/80 backdrop-blur-sm p-4">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={activeChat ? "Type your message..." : "Select a thread to start chatting..."}
                disabled={!activeChat || isLoadingHistory || isSending}
                rows={1}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white/70 py-3 pl-4 pr-12 text-sm placeholder:text-slate-400 focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-100 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ minHeight: "50px", maxHeight: "150px" }}
              />
              <button
                onClick={sendMessage}
                disabled={!currentMessage.trim() || !activeChat || isLoadingHistory || isSending}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                  currentMessage.trim() && !isSending && activeChat && !isLoadingHistory
                    ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-700 hover:to-fuchsia-700 hover:scale-105 active:scale-95"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
              >
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Components
function ChatHistoryItem({ chat, isActive, onSelect, onDelete }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative">
      <div
        onClick={onSelect}
        className={`group relative cursor-pointer rounded-xl p-3 transition-all hover:scale-102 ${
          isActive
            ? "bg-gradient-to-r from-violet-100 to-fuchsia-100 border border-violet-200"
            : "hover:bg-white/60 border border-transparent hover:border-white/20"
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4
              className={`font-medium text-sm truncate ${isActive ? "text-violet-900" : "text-slate-900"}`}
              title={chat.title}
            >
              {chat.title}
            </h4>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowMenu(!showMenu)
            }}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-100 rounded transition-all"
          >
            <MoreVertical className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      </div>

      {showMenu && (
        <div className="absolute right-0 top-12 z-10 w-32 rounded-xl bg-white border border-slate-200 shadow-xl py-1 opacity-100 scale-100 transform translate-y-0 transition-all duration-200">
          <button
            onClick={() => {
              onDelete()
              setShowMenu(false)
            }}
            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

function MessageBubble({ message }) {
  const formatMessageText = (text) => {
    // Split by code blocks first
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // This is a code block
        const codeContent = part.slice(3, -3);
        const lines = codeContent.split('\n');
        const language = lines[0].trim();
        const code = lines.slice(language ? 1 : 0).join('\n');
        
        return (
          <div key={index} className="my-3 first:mt-0 last:mb-0">
            {language && (
              <div className="text-xs text-slate-500 mb-1 font-mono bg-slate-100 px-2 py-1 rounded-t-md border-b">
                {language}
              </div>
            )}
            <pre className="bg-slate-900 text-slate-100 p-3 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
              <code>{code}</code>
            </pre>
          </div>
        );
      } else {
        // Regular text - handle inline formatting
        return (
          <div key={index} className="whitespace-pre-wrap">
            {formatInlineText(part)}
          </div>
        );
      }
    });
  };

  const formatInlineText = (text) => {
    // Handle **bold** text
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is bold text
        return <strong key={index} className="font-semibold">{part}</strong>;
      } else {
        // Handle other formatting in regular text
        return formatOtherInline(part, index);
      }
    });
  };

  const formatOtherInline = (text, baseIndex) => {
    // Handle numbered lists
    const listRegex = /^\d+\.\s+(.+)$/gm;
    const bulletRegex = /^[-*]\s+(.+)$/gm;
    
    // Split by lines to handle lists
    const lines = text.split('\n');
    let inList = false;
    let listItems = [];
    const result = [];
    
    lines.forEach((line, lineIndex) => {
      const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
      const bulletMatch = line.match(/^[-*]\s+(.+)$/);
      
      if (numberedMatch) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push({
          type: 'numbered',
          number: numberedMatch[1],
          content: numberedMatch[2]
        });
      } else if (bulletMatch) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push({
          type: 'bullet',
          content: bulletMatch[1]
        });
      } else {
        // If we were in a list and now we're not, render the list
        if (inList && listItems.length > 0) {
          result.push(
            <div key={`list-${baseIndex}-${lineIndex}`} className="my-2">
              {listItems.map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2 mb-1">
                  <span className="text-slate-600 font-medium min-w-[1.5rem]">
                    {item.type === 'numbered' ? `${item.number}.` : '•'}
                  </span>
                  <span className="flex-1">{item.content}</span>
                </div>
              ))}
            </div>
          );
          listItems = [];
          inList = false;
        }
        
        // Regular line
        if (line.trim()) {
          result.push(
            <span key={`line-${baseIndex}-${lineIndex}`}>
              {line}
              {lineIndex < lines.length - 1 && '\n'}
            </span>
          );
        } else {
          result.push(<br key={`br-${baseIndex}-${lineIndex}`} />);
        }
      }
    });
    
    // Handle remaining list items
    if (inList && listItems.length > 0) {
      result.push(
        <div key={`final-list-${baseIndex}`} className="my-2">
          {listItems.map((item, itemIndex) => (
            <div key={itemIndex} className="flex gap-2 mb-1">
              <span className="text-slate-600 font-medium min-w-[1.5rem]">
                {item.type === 'numbered' ? `${item.number}.` : '•'}
              </span>
              <span className="flex-1">{item.content}</span>
            </div>
          ))}
        </div>
      );
    }
    
    return result;
  };

  return (
    <div className="w-full opacity-100 transform translate-y-0 transition-all duration-500">
      <div className={`flex gap-3 w-full ${message.isBot ? "justify-start" : "justify-end"}`}>
        {message.isBot && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
        )}

        <div className={`${message.isBot ? "flex-1" : "max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl"} ${message.isBot ? "" : "order-first"}`}>
          <div
            className={`rounded-2xl px-4 py-3 ${message.isBot ? "w-full" : ""} ${
              message.isBot
                ? "bg-white/80 border border-white/20 text-slate-900"
                : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white"
            }`}
          >
            <div className="text-sm leading-relaxed">
              {formatMessageText(message.text)}
            </div>
          </div>
          <p className={`text-xs mt-1 ${message.isBot ? "text-slate-500" : "text-slate-400 text-right"}`}>
            {message.timestamp}
          </p>
        </div>

        {!message.isBot && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
            <User className="h-4 w-4 text-slate-600" />
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3 justify-start opacity-100 transform translate-y-0 transition-all duration-500">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center">
        <Bot className="h-4 w-4 text-white" />
      </div>
      <div className="bg-white/80 border border-white/20 rounded-2xl px-4 py-3">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
              style={{ 
                animationDelay: `${i * 0.2}s`, 
                animationDuration: '1s',
                animationIterationCount: 'infinite'
              }}
            />
          ))}
          <span className="ml-2 text-xs text-slate-500">AI is typing...</span>
        </div>
      </div>
    </div>
  );
}

function BackgroundAmbient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl animate-pulse" />
      <div className="absolute right-[-8rem] top-16 h-80 w-80 rounded-full bg-pink-300/40 blur-3xl animate-pulse" />
    </div>
  )
}