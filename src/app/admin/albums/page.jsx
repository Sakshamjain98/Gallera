// app/admin/albums/page.tsx
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

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
    a.title?.toLowerCase().includes(search.toLowerCase()) || a.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-cream p-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif text-gold">Albums</h1>
          <Link href="/admin/albums/create" className="bg-gold text-white px-4 py-2 rounded-lg hover:bg-opacity-90">New Album</Link>
        </div>
        <input
          className="w-full mb-6 p-3 border rounded-lg"
          placeholder="Search albums..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <table className="w-full bg-white/80 rounded-xl shadow overflow-hidden">
          <thead>
            <tr className="bg-gold/10 text-deep-purple">
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Slug</th>
              <th className="p-4 text-left">Active</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(album => (
              <tr key={album.id} className="border-b hover:bg-cream/40">
                <td className="p-4">{album.title}</td>
                <td className="p-4">{album.name}</td>
                <td className="p-4">{album.isActive ? 'Yes' : 'No'}</td>
                <td className="p-4">{album.createdAt?.toDate?.().toLocaleDateString?.() || ''}</td>
                <td className="p-4">
                  <Link href={`/admin/albums/${album.id}`} className="text-gold hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">No albums found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
