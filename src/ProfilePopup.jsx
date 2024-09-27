import React from "react";
import {
  User,
  CreditCard,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUser, SignOutButton } from '@clerk/clerk-react';

const ProfilePopup = ({ isDarkMode, toggleDarkMode }) => {
  const { user } = useUser();

  if (!user) {
    // Handle case where user is not signed in (e.g., show a loading indicator or redirect to sign-in)
    return <div>Loading...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className={`absolute bottom-20 left-20 rounded-lg shadow-lg p-4 w-80 border ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center mb-4">
        {user.profileImageUrl && (
          <img
            src={user.profileImageUrl}
            alt="User Profile"
            className="rounded-full mr-2 w-12 h-12"
          />
        )}
        <div>
          <p
            className={`font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {user.firstName} {user.lastName}
          </p>
          {/* You might want to fetch user's subscription status from your backend if applicable */}
          <p
            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            { /* Replace with actual subscription status */ "Free" }
          </p>
        </div>
      </div>
      {user.emailAddresses.length > 0 && (
        <p
          className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}
        >
          {user.emailAddresses[0].emailAddress}
        </p>
      )}

      <div className="space-y-2">
        {/* Replace with links to your actual profile, payment, and settings pages */}
        {[
          { text: "My Profile", icon: User, href: "/profile" },
          { text: "Payments", icon: CreditCard, href: "/payments" },
          { text: "Settings", icon: Settings, href: "/settings" },
        ].map((item, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center w-full px-2 py-1 rounded transition-colors duration-200 ${
              isDarkMode
                ? "text-gray-400 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => { /* Handle navigation to the respective page */ }}
          >
            <item.icon className="w-5 h-5 mr-2" />
            {item.text}
          </motion.button>
        ))}
        <SignOutButton>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center w-full px-2 py-1 rounded transition-colors duration-200 ${
              isDarkMode
                ? "text-gray-400 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Log Out
          </motion.button>
        </SignOutButton>

      </div>
      <hr
        className={`my-4 ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
      />
      <p
        className={`text-sm font-semibold mb-2 ${
          isDarkMode ? "text-white" : "text-gray-600"
        }`}
      >
        Preferences
      </p>
      <div className="flex items-center justify-between">
        <p
          className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
        >
          Theme
        </p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition-colors duration-200 ${
            isDarkMode
              ? "bg-gray-700 text-gray-400"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfilePopup;