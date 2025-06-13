// lib/bunny.ts
import axios from 'axios';

export const bunnyUpload = async (files, albumId) => {
  const uploadPromises = files.map(file => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axios.put(`https://storage.bunnycdn.com/testvbv/testvbv/${file.name}`, formData, {
      headers: {
        AccessKey: '52b604a8-c97c-463b-8b10a2eca067-ded7-4171',
        'Content-Type': 'application/octet-stream'
      }
    });
  });

  return Promise.all(uploadPromises);
};
