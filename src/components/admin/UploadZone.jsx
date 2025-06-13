// components/admin/UploadZone.tsx
'use client';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { bunnyUpload } from '@/lib/bunny';

export default function UploadZone({ albumId }) {
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    try {
      const results = await bunnyUpload(acceptedFiles, albumId);
      // TODO: Add media entries to Firestore
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }, [albumId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {'image/*': ['.jpg', '.jpeg', '.png'], 'video/*': ['.mp4']},
    multiple: true
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-xl ${
        isDragActive ? 'border-gold bg-cream/50' : 'border-deep-purple'
      }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        {isDragActive ? (
          <p className="text-gold">Drop files here</p>
        ) : (
          <p>Drag & drop files or click to upload</p>
        )}
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div
              className="bg-gold h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
