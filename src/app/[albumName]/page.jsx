// app/[albumName]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import PasswordModal from '@/components/gallery/PasswordModal';
import PhotoGrid from '@/components/gallery/PhotoGrid';
import FilterTabs from '@/components/gallery/FilterTabs';

export default function AlbumGallery() {
  const { albumName } = useParams();
  const [album, setAlbum] = useState(null);
  const [media, setMedia] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkAccess = async () => {
      const q = query(collection(db, 'albums'), where('name', '==', albumName));
      const snap = await getDocs(q);
      if (snap.empty) {
        setAlbum(null);
        setLoading(false);
        return;
      }
      const albumDoc = snap.docs[0];
      setAlbum({ id: albumDoc.id, ...albumDoc.data() });
      // Password check
      const stored = localStorage.getItem(`album-${albumName}`);
      if (!stored || stored !== albumDoc.data().password) {
        setShowPassword(true);
      }
      setLoading(false);
    };
    checkAccess();
  }, [albumName]);

  useEffect(() => {
    if (!album || showPassword) return;
    const fetchMedia = async () => {
      const q = query(collection(db, 'media'), where('albumId', '==', album.id));
      const snap = await getDocs(q);
      setMedia(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMedia();
  }, [album, showPassword]);

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!album) return <div className="p-12 text-center text-red-500">Album not found.</div>;
  if (showPassword) return <PasswordModal albumName={albumName} password={album.password} />;

  const filteredMedia = category === 'all' ? media : media.filter(m => m.category === category);

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-serif text-gold mb-2">{album.title}</h1>
        <FilterTabs category={category} setCategory={setCategory} />
        <PhotoGrid media={filteredMedia} />
      </div>
    </div>
  );
}
