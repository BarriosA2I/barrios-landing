'use client';

import { useState, useRef, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Check, Loader2, Trash2 } from 'lucide-react';

interface ProfileImageUploadProps {
  size?: 'sm' | 'md' | 'lg';
  showEditButton?: boolean;
  className?: string;
}

export default function ProfileImageUpload({
  size = 'lg',
  showEditButton = true,
  className = ''
}: ProfileImageUploadProps) {
  const { user, isLoaded } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  // Check if user has a custom profile image (not default initials)
  const hasCustomImage = user?.imageUrl && !user.imageUrl.includes('initials');

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setShowModal(true);
  }, []);

  const handleUpload = async () => {
    if (!selectedFile || !user) return;

    setIsUploading(true);
    setError(null);

    try {
      // Use Clerk's built-in setProfileImage method
      await user.setProfileImage({ file: selectedFile });

      // Reload user to get updated image URL
      await user.reload();

      // Close modal and reset state
      setShowModal(false);
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (err) {
      console.error('Failed to upload profile image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!user || !hasCustomImage) return;

    setIsUploading(true);
    setError(null);

    try {
      // Pass null to remove the current image
      await user.setProfileImage({ file: null });
      await user.reload();
      setShowModal(false);
    } catch (err) {
      console.error('Failed to remove profile image:', err);
      setError('Failed to remove image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleFileSelect({ target: input } as React.ChangeEvent<HTMLInputElement>);
      }
    }
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const cancelUpload = () => {
    setShowModal(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isLoaded) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-white/5 animate-pulse ${className}`} />
    );
  }

  return (
    <>
      {/* Avatar with Upload Trigger */}
      <div
        className={`relative cursor-pointer ${className}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => showEditButton && fileInputRef.current?.click()}
      >
        {/* Animated Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#00CED1] via-purple-500 to-[#FFD700] opacity-50 blur-sm"
        />

        {/* Avatar Image */}
        <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-4 border-[#0B1220]`}>
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.fullName || 'Profile'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">
                {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <AnimatePresence>
            {isHovering && showEditButton && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer backdrop-blur-sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={iconSizes[size]} className="text-[#00CED1]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Online Indicator */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute -bottom-1 -right-1 z-20"
        >
          <div className="relative">
            <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-[#0B1220]" />
            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-50" />
          </div>
        </motion.div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={cancelUpload}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-[#0B1220] rounded-2xl border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">
                  Update Profile Photo
                </h3>
                <button
                  onClick={cancelUpload}
                  className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {previewUrl ? (
                  /* Preview Selected Image */
                  <div className="space-y-4">
                    <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-[#00CED1]/30">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-center text-sm text-gray-400 truncate">
                      {selectedFile?.name}
                    </p>
                  </div>
                ) : (
                  /* Drop Zone */
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-[#00CED1]/50 hover:bg-[#00CED1]/5 transition-all"
                  >
                    <Upload size={40} className="mx-auto text-gray-500 mb-4" />
                    <p className="text-white font-medium mb-1">
                      Drop an image here or click to upload
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 text-sm text-red-400 text-center bg-red-500/10 rounded-lg p-2"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-4 border-t border-white/10 bg-white/5">
                {/* Remove Button (only show if user has custom image and no preview) */}
                {hasCustomImage && !previewUrl ? (
                  <button
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    Remove Photo
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={cancelUpload}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>

                  {previewUrl && (
                    <button
                      onClick={handleUpload}
                      disabled={isUploading}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-black bg-gradient-to-r from-[#00CED1] to-[#00CED1]/80 rounded-lg hover:from-[#00CED1]/90 hover:to-[#00CED1]/70 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          Save Photo
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
