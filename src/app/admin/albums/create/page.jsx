'use client';
import { useState } from 'react';
import Link from 'next/link';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { db } from '../../../../lib/firebase';

const COLORS = {
  primaryBlue: '#007BFF',
  deepBlue: '#004B87',
  white: '#FFFFFF',
  lightGray: '#F4F4F4',
  darkGray: '#343A40'
};

export default function CreateAlbum() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
      setError('Failed to create album. Please try again.');
      console.error('Error creating album:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col py-8 px-6 fixed inset-y-0 left-0 z-30">
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <span className="text-2xl bg-indigo-600 text-white rounded-lg p-2">📸</span>
            <span className="font-bold text-lg text-slate-800">Admin Panel</span>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-indigo-50 font-medium transition"
          >
            <span>🏠</span>
            <span>Admin</span>
          </Link>
          <Link
            href="/admin/albums/create"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 bg-indigo-50 font-medium transition"
          >
            <span>➕</span>
            <span>New Album</span>
          </Link>
          <Link
            href="/admin/albums"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-indigo-50 font-medium transition"
          >
            <span>📚</span>
            <span>All Albums</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex items-center justify-center">
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            background: COLORS.white,
            borderRadius: '1rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}
          className="p-8 w-full"
        >
          <h1
            style={{ color: COLORS.deepBlue }}
            className="text-3xl font-serif font-bold mb-8 text-center"
          >
            Create New Album
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="block mb-2 font-medium"
                style={{ color: COLORS.deepBlue }}
              >
                Album Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
                style={{ background: COLORS.lightGray, color: COLORS.darkGray }}
                placeholder="e.g. John & Jane Wedding"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label
                className="block mb-2 font-medium"
                style={{ color: COLORS.deepBlue }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
                style={{ background: COLORS.lightGray, color: COLORS.darkGray }}
                placeholder="Set a password for this album"
                required
                disabled={loading}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm text-center">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: COLORS.primaryBlue,
                color: COLORS.white,
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                width: '100%',
                boxShadow: '0 2px 6px rgba(0,123,255,0.08)',
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              className="hover:opacity-90 transition"
            >
              {loading ? 'Creating...' : 'Create Album'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
