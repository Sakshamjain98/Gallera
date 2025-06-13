// app/admin/albums/[id]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import UploadZone from '@/components/admin/UploadZone';
import { useAuth } from '@/hooks/useAuth';

const categories = ['all', 'haldi', 'mehandi', 'wedding', 'reception', 'engagement'];

export default function EditAlbum() {
  const { user, loading } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [album, setAlbum] = useState(null);
  const [media, setMedia] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ title: '', name: '', password: '', isActive: true });

  useEffect(() => {
    if (!user && !loading) router.push('/admin/login');
    const fetchAlbum = async () => {
      const docRef = doc(db, 'albums', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setAlbum({ id: snap.id, ...snap.data() });
        setForm({
          title: snap.data().title,
          name: snap.data().name,
          password: snap.data().password,
          isActive: snap.data().isActive
        });
      }
    };
    fetchAlbum();
  }, [id, user, loading, router]);

  useEffect(() => {
    const fetchMedia = async () => {
      if (!album) return;
      const q = query(collection(db, 'media'), where('albumId', '==', album.id));
      const snap = await getDocs(q);
      setMedia(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMedia();
  }, [album]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditing(true);
    try {
      await updateDoc(doc(db, 'albums', album.id), {
        ...form
      });
      alert('Album updated!');
    } catch (err) {
      alert('Error updating: ' + err.message);
    }
    setEditing(false);
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm('Delete this file?')) return;
    await deleteDoc(doc(db, 'media', mediaId));
    setMedia(media.filter(m => m.id !== mediaId));
  };

  if (!album) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-serif text-gold mb-6">Edit Album: {album.title}</h1>
        <form onSubmit={handleUpdate} className="bg-white/80 rounded-xl p-6 mb-8 shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-deep-purple mb-1">Title</label>
              <input
                className="w-full p-2 border rounded-lg"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-deep-purple mb-1">Slug</label>
              <input
                className="w-full p-2 border rounded-lg"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-deep-purple mb-1">Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded-lg"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm({ ...form, isActive: e.target.checked })}
              />
              <label className="text-deep-purple">Active</label>
            </div>
          </div>
          <button className="mt-6 bg-gold text-white px-6 py-2 rounded-lg hover:bg-opacity-90" disabled={editing}>
            {editing ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <h2 className="text-xl font-serif text-deep-purple mb-4">Upload Media</h2>
        <UploadZone albumId={album.id} />

        <h2 className="text-xl font-serif text-deep-purple mt-10 mb-4">Media Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {media.map(m => (
            <div key={m.id} className="relative group bg-white/70 rounded-lg shadow p-2">
              {m.type === 'photo' ? (
                <img src={m.url} alt={m.filename} className="rounded-lg w-full object-cover h-32" />
              ) : (
                <video src={m.url} controls className="rounded-lg w-full h-32" />
              )}
              <button
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                onClick={() => handleDeleteMedia(m.id)}
                title="Delete"
              >
                &times;
              </button>
              <div className="text-xs text-gold mt-1">{m.category}</div>
            </div>
          ))}
        </div>
        {media.length === 0 && <div className="text-gray-500 mt-6">No media yet.</div>}
      </div>
    </div>
  );
}
