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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        w-64 bg-white border-r border-slate-200 flex flex-col py-8 px-6 
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-30
      `}>
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
            onClick={() => setSidebarOpen(false)}
          >
            <span>🏠</span>
            <span>Admin</span>
          </Link>
          <Link
            href="/admin/albums/create"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 bg-indigo-50 font-medium transition"
            onClick={() => setSidebarOpen(false)}
          >
            <span>➕</span>
            <span>New Album</span>
          </Link>
          <Link
            href="/admin/albums"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-indigo-50 font-medium transition"
            onClick={() => setSidebarOpen(false)}
          >
            <span>📚</span>
            <span>All Albums</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 style={{ color: COLORS.deepBlue }} className="text-xl font-serif font-bold">Create Album</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Form Container */}
        <div className="flex items-center justify-center min-h-screen lg:min-h-auto p-4 lg:p-8">
          <div
            style={{
              maxWidth: '480px',
              margin: '0 auto',
              background: COLORS.white,
              borderRadius: '1rem',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
            }}
            className="p-6 lg:p-8 w-full"
          >
            {/* Desktop Header */}
            <h1
              style={{ color: COLORS.deepBlue }}
              className="hidden lg:block text-3xl font-serif font-bold mb-8 text-center"
            >
              Create New Album
            </h1>

            {/* Mobile Header */}
            <h1
              style={{ color: COLORS.deepBlue }}
              className="lg:hidden text-2xl font-serif font-bold mb-6 text-center"
            >
              New Album
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  className="block mb-2 font-medium text-sm lg:text-base"
                  style={{ color: COLORS.deepBlue }}
                >
                  Album Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 lg:p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm lg:text-base"
                  style={{ background: COLORS.lightGray, color: COLORS.darkGray }}
                  placeholder="e.g. John & Jane Wedding"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be displayed as the album title
                </p>
              </div>

              <div>
                <label
                  className="block mb-2 font-medium text-sm lg:text-base"
                  style={{ color: COLORS.deepBlue }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 lg:p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm lg:text-base"
                  style={{ background: COLORS.lightGray, color: COLORS.darkGray }}
                  placeholder="Set a password for this album"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Guests will need this password to view the album
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-lg text-center">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: COLORS.primaryBlue,
                    color: COLORS.white,
                    padding: '0.875rem 1.5rem',
                    borderRadius: '0.5rem',
                    fontWeight: 600,
                    width: '100%',
                    boxShadow: '0 2px 6px rgba(0,123,255,0.08)',
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  className="hover:opacity-90 transition text-sm lg:text-base"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    'Create Album'
                  )}
                </button>

                <Link
                  href="/admin/albums"
                  className="block w-full text-center py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition text-sm lg:text-base"
                >
                  Cancel
                </Link>
              </div>
            </form>

            {/* Mobile Helper Text */}
            <div className="lg:hidden mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700 text-center">
                💡 Tip: Choose a memorable name and password that you can easily share with your guests
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
