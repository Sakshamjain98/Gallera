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
            href="/admin/create"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-indigo-50 font-medium transition"
          >
            <span>➕</span>
            <span>New Album</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <div style={{ minHeight: '100vh', background: COLORS.white, padding: '3rem 0' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="flex justify-between items-center mb-8">
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
            <input
              className="w-full mb-6 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-200 focus:outline-none"
              placeholder="Search albums..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ background: COLORS.lightGray, color: COLORS.darkGray }}
            />
            <div className="rounded-xl shadow overflow-hidden border border-gray-200">
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
          </div>
        </div>
      </main>
    </div>
  );
}
