// app/admin/albums/create/page.tsx
'use client';
import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { db } from '../../../../lib/firebase';

export default function CreateAlbum() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newAlbum = {
      name: name.toLowerCase().replace(/\s+/g, '-'),
      title: name,
      password,
      createdAt: new Date(),
      isActive: true
    };

    try {
      const docRef = await addDoc(collection(db, 'albums'), newAlbum);
      router.push(`/admin/albums/${docRef.id}`);
    } catch (error) {
      console.error('Error creating album:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-serif text-gold mb-8">Create New Album</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-deep-purple mb-2">Album Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-deep-purple mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-gold text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition"
        >
          Create Album
        </button>
      </form>
    </div>
  );
}
