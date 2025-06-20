"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { bunnyUpload } from "@/lib/bunny";

export default function UploadZone({ albumId, category }) {
  const [progressMap, setProgressMap] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setUploading(true);
      setProgressMap({});
      setStatusMap({});
      try {
        const results = await bunnyUpload(
          acceptedFiles,
          albumId,
          category,
          (fileName, percent) => {
            setProgressMap((prev) => ({ ...prev, [fileName]: percent }));
          }
        );
        // Update status for each file
        const newStatus = {};
        results.forEach((res) => {
          newStatus[res.fileName] = res.success
            ? "Uploaded"
            : res.error || "Failed";
        });
        setStatusMap(newStatus);

        handleReload(); // Reload the page to reflect new uploads
      } catch (error) {
        console.error("Upload failed:", error);
      }
      setUploading(false);
    },
    [albumId, category]
  );

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png"], "video/*": [".mp4"] },
    multiple: true,
  });

  return (
    <motion.div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-xl ${
        isDragActive ? "border-gold bg-cream/50" : "border-deep-purple"
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
        {Object.keys(progressMap).length > 0 && (
          <div className="mt-4 space-y-2">
            {Object.entries(progressMap).map(([file, percent]) => (
              <div key={file}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{file}</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gold h-2.5 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                {statusMap[file] && (
                  <div className="text-xs mt-1 text-green-700">
                    {statusMap[file]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {uploading && (
          <p className="mt-4 text-sm text-gray-500">Uploading...</p>
        )}
      </div>
    </motion.div>
  );
}
