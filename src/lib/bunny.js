// lib/bunny.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

// Move API key to environment variables for production
const BUNNY_API_KEY = 'f967c6e4-16f1-49da-be3c14c3ad45-deeb-4c75';
const storageZone = 'testvg';

// Helper function to get content type
const getContentType = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const mimeTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'pdf': 'application/pdf',
    'txt': 'text/plain',
  };
  return mimeTypes[extension || ''] || 'application/octet-stream';
};

// Helper function to determine media type
const getMediaType = (fileName) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  
  if (videoExtensions.includes(extension)) return 'video';
  if (imageExtensions.includes(extension)) return 'photo';
  return 'other';
};

// Helper function to categorize media (based on your categories array)
const categorizeMedia = (fileName) => {
  const name = fileName.toLowerCase();
  if (name.includes('haldi')) return 'haldi';
  if (name.includes('mehandi') || name.includes('mehndi')) return 'mehandi';
  if (name.includes('wedding')) return 'wedding';
  if (name.includes('reception')) return 'reception';
  if (name.includes('engagement')) return 'engagement';
  return 'all'; // default category
};

export const bunnyUpload = async (files, albumId, category, onFileProgress) => {
  if (!BUNNY_API_KEY) throw new Error('BunnyCDN API key not configured');
  if (!albumId) throw new Error('Album ID is required for uploads');

  const uploadPromises = files.map(async (file) => {
    try {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${sanitizedName}`;
      const filePath = `${albumId}/${fileName}`;
      const uploadUrl = `https://sg.storage.bunnycdn.com/${storageZone}/${filePath}`;

      // Progress tracking for fetch is not natively supported; so we show 0% -> 100% on completion
      if (onFileProgress) onFileProgress(file.name, 10);

      const response = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          AccessKey: BUNNY_API_KEY,
          "Content-Type": getContentType(file.name),
        },
        body: file,
      });

      if (!response.ok) throw new Error(`Upload failed: ${response.status} ${response.statusText}`);

      if (onFileProgress) onFileProgress(file.name, 100);

      const cdnUrl = `https://${storageZone}.b-cdn.net/${filePath}`;
      const mediaData = {
        albumId,
        filename: file.name,
        originalName: file.name,
        url: cdnUrl,
        type: getMediaType(file.name),
        category: category || 'all',
        size: file.size,
        contentType: getContentType(file.name),
        uploadedAt: new Date(),
        bunnyPath: filePath,
      };

      const docRef = await addDoc(collection(db, 'media'), mediaData);

      return {
        success: true,
        fileName: file.name,
        url: cdnUrl,
        firebaseId: docRef.id,
        mediaData: { ...mediaData, id: docRef.id }
      };
    } catch (error) {
      if (onFileProgress) onFileProgress(file.name, 100);
      return {
        success: false,
        fileName: file.name,
        error: error.message || 'Upload failed'
      };
    }
  });

  return Promise.all(uploadPromises);
};


// Optional: Function to delete files from BunnyCDN
export const bunnyDelete = async (filePath) => {
  try {
    const deleteUrl = `https://sg.storage.bunnycdn.com/${storageZone}/${filePath}`;
    
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        AccessKey: BUNNY_API_KEY,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to delete from BunnyCDN:', error);
    return false;
  }
};