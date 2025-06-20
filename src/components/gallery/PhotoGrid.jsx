// components/gallery/PhotoGrid.jsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function PhotoGrid({ media, onLightboxToggle }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (item, index) => {
    setSelectedImage(item);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
    onLightboxToggle?.(true); // Notify parent that lightbox is open
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
    onLightboxToggle?.(false); // Notify parent that lightbox is closed
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % media.length;
    setCurrentIndex(nextIndex);
    setSelectedImage(media[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = (currentIndex - 1 + media.length) % media.length;
    setCurrentIndex(prevIndex);
    setSelectedImage(media[prevIndex]);
  };

  const downloadImage = () => {
    if (selectedImage) {
      const link = document.createElement('a');
      link.href = selectedImage.url;
      link.download = selectedImage.filename || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      {/* Simple Grid Layout */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-4 space-y-4">
        {media.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="break-inside-avoid cursor-pointer rounded-xl overflow-hidden bg-white/60 backdrop-blur-sm border border-amber-200/50 shadow-md"
            onClick={() => openLightbox(item, index)}
          >
            {item.type === 'photo' ? (
              <Image
                src={item.url}
                alt={item.filename}
                width={400}
                height={600}
                className="w-full h-auto object-cover"
                loading={index < 8 ? 'eager' : 'lazy'}
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
              />
            ) : (
              <video
                className="w-full h-auto object-cover"
                poster={item.thumbnail}
              >
                <source src={item.url} type="video/mp4" />
              </video>
            )}
          </motion.div>
        ))}
      </div>

      {/* Custom Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Lightbox Content */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
              className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center p-4 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 cursor-pointer bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation Buttons */}
              {media.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 cursor-pointer z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 cursor-pointer z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image/Video Container */}
              <div className="relative w-full h-full flex items-center justify-center">
                {selectedImage.type === 'photo' ? (
                  <Image
                    src={selectedImage.url}
                    alt={selectedImage.filename}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    priority
                  />
                ) : (
                  <video
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    controls
                    autoPlay
                  >
                    <source src={selectedImage.url} type="video/mp4" />
                  </video>
                )}
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl px-3 sm:px-6 py-2 sm:py-3 flex items-center space-x-2 sm:space-x-4">
                  {/* Image Counter */}
                  <span className="text-white text-xs sm:text-sm font-medium">
                    {currentIndex + 1} / {media.length}
                  </span>
                  
                  {/* Divider */}
                  <div className="w-px h-4 sm:h-6 bg-white/30"></div>
                  
                  {/* Download Button */}
                  <button
                    onClick={downloadImage}
                    className="flex items-center space-x-1 sm:space-x-2 bg-gradient-to-r from-[#F7CD38] cursor-pointer to-[#F4C002] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-serif text-xs sm:text-sm hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">Download</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
