import React, { useState, useCallback } from "react";
import { ArrowUp, X, File, Image, Upload, FileText, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const InputArea = ({ isDarkMode, onSubmit }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  }, []);

  const handleFileInputChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
  }, []);

  const removeFile = useCallback((index) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmit(inputValue, uploadedFiles);
    setInputValue("");
    setUploadedFiles([]);
  }, [inputValue, uploadedFiles, onSubmit]);

  const getFileIcon = (file) => {
    const fileType = file.type.split('/')[0];
    switch (fileType) {
      case 'image':
        return <Image size={24} />;
      case 'video':
        return <Film size={24} />;
      case 'text':
      case 'application':
        return <FileText size={24} />;
      default:
        return <File size={24} />;
    }
  };

  const getFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="w-full max-w-2xl">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        onSubmit={handleSubmit}
        className={`rounded-lg shadow-lg border ${
          isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"
        }`}
      >
        {/* Top section: Input and Send button */}
        <div
          className={`flex items-center p-4 rounded-t-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <input
            type="text"
            placeholder="Add custom instructions (optional)..."
            className={`flex-grow focus:outline-none ${
              isDarkMode ? "text-gray-300 bg-gray-800" : "text-gray-700 bg-white"
            } text-base`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <span className="relative">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={uploadedFiles.length === 0} 
              className={`ml-4 px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                isDarkMode
                  ? uploadedFiles.length > 0 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gray-600 text-gray-400 cursor-not-allowed" 
                  : uploadedFiles.length > 0
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed" 
              }`}
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Send
            </motion.button>
            {uploadedFiles.length === 0 && (
              <div className="tooltip" data-tip="Please add at least one file to continue"></div>
            )}
          </span>
        </div>
        {/* Bottom section: File drop area (Floating Panel) */}
        <div className="p-4">
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-4 flex flex-col items-center justify-center rounded-lg transition-all duration-300 
              ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}
              ${isDragging ? "border-2 border-dashed border-blue-500 bg-opacity-50" : "border border-dashed"}
              ${isDarkMode ? "border-gray-600" : "border-gray-300"}
              shadow-md hover:shadow-lg`}
          >
            <input
              type="file"
              id="fileInput"
              multiple
              onChange={handleFileInputChange}
              className="hidden"
            />
            {uploadedFiles.length > 0 ? (
              <div className="w-full max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500">
                <div className="flex flex-wrap gap-4">
                  <AnimatePresence>
                    {uploadedFiles.map((file, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`flex items-center ${
                          isDarkMode ? "bg-gray-800" : "bg-gray-200"
                        } rounded-md p-3 relative group`}
                      >
                        {getFilePreview(file) ? (
                          <img
                            src={getFilePreview(file)}
                            alt={file.name}
                            className="w-12 h-12 object-cover rounded-md mr-3"
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center rounded-md mr-3 bg-gray-300">
                            {getFileIcon(file)}
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium truncate max-w-[150px] block">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(2)} KB
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => { 
                            e.preventDefault(); // Prevent form submission
                            removeFile(index);
                          }}
                          className={`absolute top-1 right-1 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                            isDarkMode
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        >
                          <X size={14} />
                        </motion.button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <motion.label
                htmlFor="fileInput"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex flex-col items-center justify-center cursor-pointer h-32 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm text-center">
                  Drop any files related to the case here or click to upload
                </p>
              </motion.label>
            )}
          </div>
        </div>
      </motion.form>
    </div>
  );
};

export default InputArea;