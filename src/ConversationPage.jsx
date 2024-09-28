import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConversationPage = ({ isDarkMode, transition }) => {
  const [message, setMessage] = useState("");
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isFirstOpen, setIsFirstOpen] = useState(true);
  const [hasSentFirstMessage, setHasSentFirstMessage] = useState(false);
  const chatContainerRef = useRef(null);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && message.trim() !== "") {
      e.preventDefault();
      const newMessage = { type: "user", content: message };
      setConversations([...conversations, newMessage]);
      simulateAIResponse(newMessage);
      setMessage("");
      setIsFirstOpen(false);
      if (!hasSentFirstMessage) {
        setHasSentFirstMessage(true);
      }
    }
  };

  const simulateAIResponse = (userMessage) => {
    setTimeout(() => {
      const aiResponse = {
        type: "ai",
        content: `Response to: ${userMessage.content}`,
      };
      setConversations((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    return () => {
      document.body.classList.remove("dark");
    };
  }, [isDarkMode]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversations]);

  const chatVariants = {
    closed: { height: "64px", opacity: 0.9 },
    open: { height: "80vh", opacity: 1 }
  };

  const handleChatAreaClick = (e) => {
    e.stopPropagation();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={transition}
      className={`flex flex-col min-h-screen p-8 pl-24 relative transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-800"
      }`}
    >
      <div className="flex-grow">
        <h2 className="text-2xl font-medium mb-4 transition-colors duration-300">
          Case Title
        </h2>
        <p className="transition-colors duration-300 mb-8">
          Displays summarized info about the case details through various modes
          of presentation.
        </p>
      </div>

      {/* Conversation Area */}
      <motion.div
        className="w-full max-w-3xl mx-auto fixed inset-x-0 bottom-0 z-50 flex justify-center"
        initial="closed"
        animate={isChatExpanded ? "open" : "closed"}
        variants={chatVariants}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        onClick={handleChatAreaClick}
      >
        <motion.div
          className={`w-full rounded-t-xl shadow-lg overflow-hidden transition-all duration-300 ${
            isDarkMode
              ? "bg-gray-800 text-gray-100 shadow-gray-900"
              : "bg-gray-50 text-gray-800 shadow-gray-300"
          }`}
          style={{
            border: isDarkMode ? "1px solid #4a5568" : "1px solid #e2e8f0"
          }}
        >
          {/* Header Section */}
          {hasSentFirstMessage && isChatExpanded && (
            <div
              className={`relative flex items-center justify-center p-4 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3 className="text-lg font-medium">Assistant</h3>
              <button
                onClick={() => setIsChatExpanded(false)}
                className={`absolute right-4 text-xl transition-colors duration-300 ${
                  isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"
                }`}
              >
                &times;
              </button>
            </div>
          )}

          <AnimatePresence>
            {isChatExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                ref={chatContainerRef}
                className="p-4 overflow-y-auto flex flex-col"
                style={{ 
                  height: hasSentFirstMessage ? "calc(80vh - 128px)" : "calc(80vh - 64px)",
                  maxHeight: hasSentFirstMessage ? "calc(80vh - 128px)" : "calc(80vh - 64px)"
                }}
              >
                {isFirstOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center flex-grow"
                  >
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Assistant Profile"
                      className="w-24 h-24 rounded-full mb-4 shadow-lg"
                    />
                    <h3 className="text-xl font-medium mb-2 text-center">Welcome to the Assistant</h3>
                    <p className="text-sm text-center mb-4">
                      I'm here to help you with any questions related to the case. Feel free to ask anything!
                    </p>
                  </motion.div>
                )}
                {conversations.map((conv, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`mb-4 ${
                      conv.type === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block px-4 py-2 rounded-lg ${
                        conv.type === "user"
                          ? "bg-[#e0efff] text-gray-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <strong>{conv.type === "ai" ? "AI: " : "You: "}</strong>
                      {conv.content}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="p-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsChatExpanded(true)}
              placeholder="Ask any question related to the case..."
              className={`w-full px-4 py-2 rounded-md resize-none focus:outline-none transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-800 text-gray-200 placeholder-gray-400"
                  : "bg-gray-50 text-gray-800 placeholder-gray-500"
              }`}
              style={{
                minHeight: "48px",
                maxHeight: "120px",
                border: "none",
              }}
              aria-label="Ask any question related to the case"
              aria-multiline="true"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Full-screen Background Blur */}
      <AnimatePresence>
        {isChatExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
            onClick={() => setIsChatExpanded(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      </motion.div>
      );
      };
export default ConversationPage;