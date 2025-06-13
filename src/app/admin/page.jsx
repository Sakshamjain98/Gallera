// app/admin/page.tsx
'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div className="p-12 text-center">Loading...</div>;
  if (!user) {
    router.push('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-cream flex">
      <aside className="w-64 bg-white/70 shadow-lg p-6 flex flex-col gap-4">
        <h2 className="text-2xl font-serif text-gold mb-6">Admin Panel</h2>
        <Link href="/admin/albums" className="hover:text-gold">Albums</Link>
        <Link href="/admin/albums/create" className="hover:text-gold">Create Album</Link>
      </aside>
      <main className="flex-1 p-12">
        <h1 className="text-4xl font-serif text-deep-purple mb-8">Welcome, Admin!</h1>
        <p className="text-lg">Use the sidebar to manage albums and uploads.</p>
      </main>
    </div>
  );
}
