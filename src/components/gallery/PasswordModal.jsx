// components/gallery/PasswordModal.tsx
'use client';
import { useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function PasswordModal({ albumName }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const albumRef = doc(db, 'albums', albumName);
    const albumSnap = await getDoc(albumRef);

    if (albumSnap.exists() && albumSnap.data().password === password) {
      localStorage.setItem(`album-${albumName}`, password);
      window.location.reload();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="fixed inset-0 bg-cream/90 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-serif text-gold mb-4">Enter Album Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Password"
          required
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="bg-gold text-white px-6 py-3 rounded-lg w-full hover:bg-opacity-90 transition"
        >
          Access Gallery
        </button>
      </form>
    </div>
  );
}
