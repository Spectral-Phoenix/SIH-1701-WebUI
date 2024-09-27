import React from "react";
import {
  User,
  CreditCard,
  DollarSign,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";

const ProfilePopup = ({ isDarkMode, toggleDarkMode }) => {
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
        <img
          src="https://vercel.com/api/www/avatar/YLS1nS2AeRXPhg01SmdeN2rp?s=64"
          alt="User Profile"
          className="rounded-full mr-2"
        />
        <div>
          <p
            className={`font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Praneel
          </p>
          <p
            className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
          >
            Free
          </p>
        </div>
      </div>
      <p
        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}
      >
        spectralphoenix.07@gmail.com
      </p>
      <p
        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2`}
      >
        Running out of credits?
      </p>
      <button className="w-full text-white bg-blue-600 p-2 rounded-md hover:bg-blue-700 transition-colors duration-200 mb-4">
        Get More Credits
      </button>
      <div className="space-y-2">
        {[
          { text: "My Profile", icon: User },
          { text: "Payments", icon: CreditCard },
          { text: "Settings", icon: DollarSign },
          { text: "Log Out", icon: LogOut },
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
          >
            <item.icon className="w-5 h-5 mr-2" />
            {item.text}
          </motion.button>
        ))}
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