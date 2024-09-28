import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react';

const WorkspaceContent = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showFooterPopup, setShowFooterPopup] = useState(false);
  const [footerPopupContent, setFooterPopupContent] = useState("");
  const profilePopupRef = useRef(null);
  const footerPopupRef = useRef(null);
  const location = useLocation();

  const toggleProfilePopup = useCallback(() => {
    setShowProfilePopup((prevState) => !prevState);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prevMode) => !prevMode);
  }, []);

  const openFooterPopup = useCallback((content) => {
    setFooterPopupContent(content);
    setShowFooterPopup(true);
  }, []);

  const closeFooterPopup = useCallback(() => {
    setShowFooterPopup(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilePopupRef.current && !profilePopupRef.current.contains(event.target)) {
        setShowProfilePopup(false);
      }
      if (footerPopupRef.current && !footerPopupRef.current.contains(event.target)) {
        setShowFooterPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <div className={`flex flex-col h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}>
      <Header isDarkMode={isDarkMode} />
      <main className="flex-grow flex overflow-hidden mt-12"> 
        <SignedIn>
          <Sidebar isDarkMode={isDarkMode} toggleProfilePopup={toggleProfilePopup} />
          <AnimatePresence mode='wait'>
            <Routes>
              <Route path="/" element={<HomePage isDarkMode={isDarkMode} />} />
              <Route path="/conversation/:id" element={<ConversationPage isDarkMode={isDarkMode} />} />
            </Routes>
          </AnimatePresence>
        </SignedIn>
        <SignedOut>
          <SignOutContent />
        </SignedOut>
      </main>

      {/* Footer Links */}
      <SignedIn>
        {isHomePage && (
          <div className={`mt-auto p-2 text-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {["FAQ", "Terms", "AI Policy", "Privacy", "Insight AI →"].map((link) => (
              <a
                key={link}
                href="#"
                className={`mx-2 hover:underline cursor-pointer ${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"}`}
                onClick={() => openFooterPopup(link)}
              >
                {link}
              </a>
            ))}
          </div>
        )}
      </SignedIn>

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
      {showFooterPopup && (
        <div ref={footerPopupRef}>
          <FooterPopup
            isDarkMode={isDarkMode}
            title={footerPopupContent}
            onClose={closeFooterPopup}
          >
            <p>This is the content for the {footerPopupContent} popup. More detailed information will be added here soon.</p>
          </FooterPopup>
        </div>
      )}
    </div>
  );
};

const Workspace = () => {
  return (
    <Router>
      <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
        <WorkspaceContent />
      </ClerkProvider>
    </Router>
  );
};

const Header = React.memo(({ isDarkMode }) => (
  <header className={`flex justify-between items-center px-4 py-2 border-b fixed top-0 left-0 right-0 z-50 ${isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-white"}`}>
    <div className="text-2xl font-semibold">Insight AI</div>
    <div className={`text-sm px-2 py-1 rounded-full ${isDarkMode ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
      Smart India Hackathon(SIH)-PS ID: 1701
    </div>
  </header>
));

const HomePage = React.memo(({ isDarkMode }) => {
  const navigate = useNavigate();

  const handleSubmit = useCallback((inputValue, uploadedFiles) => {
    const conversationId = uuidv4();
    navigate(`/conversation/${conversationId}`);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
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
        Generate summaries, analyze case law, and find relevant precedents faster.
      </motion.p>
      <InputArea isDarkMode={isDarkMode} onSubmit={handleSubmit} />
    </motion.div>
  );
});

const SignOutContent = () => (
  <div className="flex-grow p-8 flex flex-col items-center justify-center">
    <h1 className="text-4xl font-medium mb-4">Welcome to Insight AI</h1>
    <p className="text-gray-600 mb-8">
      Please sign in or sign up to continue.
    </p>
    <div className="space-x-4">
      <SignInButton />
      <SignUpButton />
    </div>
  </div>
);

export default Workspace;