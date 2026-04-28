import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const FileUploader = ({ onFileSelect, type, label, accept }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles.length > 0) {
      const errorMsg = rejectedFiles[0].errors[0].message;
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      onFileSelect(selectedFile);
      toast.success(`${selectedFile.name} uploaded successfully!`);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const removeFile = () => {
    setFile(null);
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-blue-500 bg-blue-500/10 scale-105'
                : error
                ? 'border-red-500 bg-red-500/5'
                : 'border-gray-600 hover:border-blue-500 hover:bg-blue-500/5'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
              isDragActive ? 'text-blue-400' : error ? 'text-red-400' : 'text-gray-400'
            }`} />
            <p className="text-gray-300 mb-2">
              {isDragActive
                ? "Drop your file here"
                : "Drag & drop or click to browse"}
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: PDF, DOCX, TXT (Max 10MB)
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="w-8 h-8 text-green-400" />
                <div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-sm text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-red-400" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 text-sm text-red-400 flex items-center"
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FileUploader;