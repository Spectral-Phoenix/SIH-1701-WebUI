import React from "react";
import { Plus, Library, Flag, User } from "lucide-react";
import { motion } from "framer-motion";

const Sidebar = ({ isDarkMode, toggleProfilePopup, showProfilePopup }) => {
  // Array of icons with their respective tooltips
  const icons = [
    { Icon: Plus, tooltip: "New" },
    { Icon: Library, tooltip: "Library" },
    { Icon: Flag, tooltip: "Review" },
  ];

  return (
    <aside
      className={`w-16 border-r ${
        isDarkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
      } flex flex-col py-6 relative`} // Removed justify-between
    >
      <div className="space-y-6 flex flex-col items-center">
        {icons.map(({ Icon, tooltip }, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-lg transition-colors duration-200 relative group ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
            }`}
          >
            <Icon size={24} />
            {/* Centered tooltip - Now relative to the button */}
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap top-1/2 -translate-y-1/2 pointer-events-none"> 
              {tooltip}
            </span>
          </motion.button>
        ))}
      </div>
    
      <div className="absolute bottom-6 left-0 w-full flex flex-col items-center"> 
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`p-3 rounded-lg transition-colors duration-200 relative group ${
            isDarkMode
              ? "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
              : "hover:bg-gray-200 text-gray-600 hover:text-gray-800"
          }`}
          onClick={toggleProfilePopup}
        >
          <User size={24} />
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap top-1/2 -translate-y-1/2 pointer-events-none">
            Profile
          </span>
        </motion.button>
      </div>
    </aside>
  );
};

export default Sidebar;