'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const COLORS = {
  primaryBlue: '#007BFF',
  deepBlue: '#004B87',
  white: '#FFFFFF',
  lightGray: '#F4F4F4',
  darkGray: '#343A40'
};

export default function AlbumsPage() {
  const { user, loading } = useAuth();
  const [albums, setAlbums] = useState([]);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) router.push('/admin/login');
    const fetchAlbums = async () => {
      const q = query(collection(db, 'albums'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setAlbums(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchAlbums();
  }, [user, loading, router]);

  const filtered = albums.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.name?.toLowerCase().includes(search.toLowerCase())
  );

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
            href="/admin/create"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-indigo-50 font-medium transition"
            onClick={() => setSidebarOpen(false)}
          >
            <span>➕</span>
            <span>New Album</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ">
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
          <h1 style={{ color: COLORS.deepBlue }} className="text-xl font-serif font-bold">Albums</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div style={{ minHeight: '100vh', background: COLORS.white, padding: '1.5rem' }} className="lg:p-12">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Desktop Header */}
            <div className="hidden lg:flex justify-between items-center mb-8">
              <h1 style={{ color: COLORS.deepBlue }} className="text-3xl font-serif font-bold">Albums</h1>
              <Link
                href="/admin/albums/create"
                style={{
                  background: COLORS.primaryBlue,
                  color: COLORS.white,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0,123,255,0.08)'
                }}
                className="hover:opacity-90 transition"
              >
                + New Album
              </Link>
            </div>

            {/* Mobile New Album Button */}
            <div className="lg:hidden mb-6">
              <Link
                href="/admin/albums/create"
                style={{
                  background: COLORS.primaryBlue,
                  color: COLORS.white,
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0,123,255,0.08)'
                }}
                className="hover:opacity-90 transition inline-block w-full text-center"
              >
                + New Album
              </Link>
            </div>

            <input
              className="w-full mb-6 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="Search albums..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: COLORS.lightGray, color: COLORS.darkGray }}
            />

            {/* Desktop Table */}
            <div className="hidden md:block rounded-xl shadow overflow-hidden border border-gray-200">
              <table className="w-full" style={{ background: COLORS.white }}>
                <thead>
                  <tr style={{ background: COLORS.primaryBlue + '10', color: COLORS.deepBlue }}>
                    <th className="p-4 text-left font-semibold">Title</th>
                    <th className="p-4 text-left font-semibold">Slug</th>
                    <th className="p-4 text-left font-semibold">Active</th>
                    <th className="p-4 text-left font-semibold">Created</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((album, idx) => (
                    <tr
                      key={album.id}
                      style={{
                        background: idx % 2 === 0 ? COLORS.lightGray : COLORS.white,
                        transition: 'background 0.2s'
                      }}
                      className="hover:bg-blue-50"
                    >
                      <td className="p-4 font-medium" style={{ color: COLORS.darkGray }}>{album.title}</td>
                      <td className="p-4" style={{ color: COLORS.darkGray }}>{album.name}</td>
                      <td className="p-4" style={{ color: album.isActive ? COLORS.primaryBlue : COLORS.darkGray, fontWeight: 500 }}>
                        {album.isActive ? 'Yes' : 'No'}
                      </td>
                      <td className="p-4" style={{ color: COLORS.darkGray }}>
                        {album.createdAt?.toDate?.().toLocaleDateString?.() || ''}
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/admin/albums/${album.id}`}
                          style={{ color: COLORS.primaryBlue, fontWeight: 500 }}
                          className="hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center" style={{ color: '#888' }}>
                        No albums found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filtered.map((album) => (
                <div
                  key={album.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg" style={{ color: COLORS.darkGray }}>
                      {album.title}
                    </h3>
                    <span
                      className="px-2 py-1 rounded text-sm font-medium"
                      style={{
                        background: album.isActive ? COLORS.primaryBlue + '20' : COLORS.lightGray,
                        color: album.isActive ? COLORS.primaryBlue : COLORS.darkGray
                      }}
                    >
                      {album.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm" style={{ color: COLORS.darkGray }}>
                    <div>
                      <span className="font-medium">Slug: </span>
                      <span>{album.name}</span>
                    </div>
                    <div>
                      <span className="font-medium">Created: </span>
                      <span>{album.createdAt?.toDate?.().toLocaleDateString?.() || ''}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Link
                      href={`/admin/albums/${album.id}`}
                      style={{ color: COLORS.primaryBlue, fontWeight: 500 }}
                      className="hover:underline"
                    >
                      Edit Album →
                    </Link>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center" style={{ color: '#888' }}>
                  No albums found.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
