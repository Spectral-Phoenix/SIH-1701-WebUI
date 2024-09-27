import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Sidebar from "./Sidebar";
import InputArea from "./InputArea";
import ProfilePopup from "./ProfilePopup";
import FooterPopup from "./FooterPopup";
import { HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConversationPage from "./ConversationPage";

const Workspace = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showFooterPopup, setShowFooterPopup] = useState(false);
  const [footerPopupContent, setFooterPopupContent] = useState("");
  const profilePopupRef = useRef(null);
  const footerPopupRef = useRef(null);

  const toggleProfilePopup = () => {
    setShowProfilePopup((prevState) => !prevState);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const openFooterPopup = (content) => {
    setFooterPopupContent(content);
    setShowFooterPopup(true);
  };

  const closeFooterPopup = () => {
    setShowFooterPopup(false);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profilePopupRef.current &&
        !profilePopupRef.current.contains(event.target)
      ) {
        setShowProfilePopup(false);
      }
      if (
        footerPopupRef.current &&
        !footerPopupRef.current.contains(event.target)
      ) {
        setShowFooterPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profilePopupRef, footerPopupRef]);

  return (
    <Router>
      <div
        className={`flex flex-col h-screen transition-colors duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
        }`}
      >
        {/* Header */}
        <header
          className={`flex justify-between items-center px-4 py-2 border-b ${ // Reduced padding
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="text-2xl font-semibold">Insight AI</div>
          <div
            className={`text-sm px-2 py-1 rounded-full ${
              isDarkMode
                ? "bg-blue-900 text-blue-200"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            Smart India Hackathon(SIH)-PS ID: 1701
          </div>
        </header>

        {/* Main content */}
        <main className="flex-grow flex overflow-hidden">
          <Sidebar
            isDarkMode={isDarkMode}
            toggleProfilePopup={toggleProfilePopup}
          />
          <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
              {" "}
              {/* Use Routes instead of Switch */}
              <Route
                path="/"
                element={
                  <HomePage
                    isDarkMode={isDarkMode}
                    key="home"
                    transition={{ duration: 0.5 }}
                  />
                }
              />
              <Route
                path="/conversation/:id"
                element={
                  <ConversationPage
                    isDarkMode={isDarkMode}
                    key="conversation"
                    transition={{ duration: 0.5 }}
                  />
                }
              />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <Footer
          isDarkMode={isDarkMode}
          openFooterPopup={openFooterPopup}
          toggleProfilePopup={toggleProfilePopup}
        />

        {/* Profile Popup */}
        {showProfilePopup && (
          <div ref={profilePopupRef}>
            <ProfilePopup
              isDarkMode={isDarkMode}
              toggleDarkMode={toggleDarkMode}
              toggleProfilePopup={toggleProfilePopup}
              showProfilePopup={showProfilePopup}
            />
          </div>
        )}

        {/* Footer Popup */}
        {showFooterPopup && (
          <div ref={footerPopupRef}>
            <FooterPopup
              isDarkMode={isDarkMode}
              title={footerPopupContent}
              onClose={closeFooterPopup}
            >
              {/* Placeholder content for now */}
              <p>
                This is the content for the {footerPopupContent} popup. More
                detailed information will be added here soon.
              </p>
            </FooterPopup>
          </div>
        )}
      </div>
    </Router>
  );
};

const HomePage = ({ isDarkMode, transition }) => {
  const navigate = useNavigate();

  const handleSubmit = (inputValue, uploadedFiles) => {
    const conversationId = uuidv4();
    navigate(`/conversation/${conversationId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={transition}
      className="flex-grow p-8 flex flex-col items-center justify-center"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-medium mb-2"
      >
        Legal Research Assistant
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-8`}
      >
        Generate summaries, analyze case law, and find relevant precedents
        faster.
      </motion.p>
      <InputArea isDarkMode={isDarkMode} onSubmit={handleSubmit} />
    </motion.div>
  );
};

const Footer = ({ isDarkMode, openFooterPopup, toggleProfilePopup }) => {
  const location = useLocation();

  // Only render the footer if the current path is the home page
  if (location.pathname !== "/") return null;

  return (
    <footer
      className={`border-t p-1 flex justify-between items-center ${
        isDarkMode ? "border-gray-700" : "border-gray-200"
      }`}
    >
      <div className="flex-grow"></div>
      <div
        className={`flex space-x-4 text-sm ${
          isDarkMode ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {["FAQ", "Terms", "AI Policy", "Privacy", "Insight AI →"].map(
          (link, index) => (
            <a
              key={index}
              href="#"
              className="hover:underline cursor-pointer"
              onClick={() => openFooterPopup(link)}
            >
              {link}
            </a>
          ),
        )}
      </div>
      <div className="flex-grow"></div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`p-2 rounded-full transition-colors duration-200 ${
          isDarkMode
            ? "hover:bg-gray-800 text-gray-400"
            : "hover:bg-gray-100 text-gray-600"
        }`}
        onClick={toggleProfilePopup}
      >
        <HelpCircle size={20} />
      </motion.button>
    </footer>
  );
};

export default Workspace;