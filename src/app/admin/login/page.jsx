'use client';
import { useState } from 'react';
import Link from 'next/link';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

const COLORS = {
  primaryBlue: '#007BFF',
  deepBlue: '#004B87',
  white: '#FFFFFF',
  lightGray: '#F4F4F4',
  darkGray: '#343A40'
};

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err) {
      setError('Invalid credentials.');
    }
    setLoading(false);
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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-indigo-50 font-medium transition"
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
        <form
          onSubmit={handleSubmit}
          style={{
            background: COLORS.white,
            borderRadius: '1rem',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}
          className="p-10 w-full max-w-md"
        >
          <h1
            style={{ color: COLORS.deepBlue }}
            className="text-3xl font-serif font-bold mb-8 text-center"
          >
            Admin Login
          </h1>
          <input
            className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            style={{ background: COLORS.lightGray, color: COLORS.darkGray }}
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            style={{ background: COLORS.lightGray, color: COLORS.darkGray }}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          {error && <div className="text-red-600 text-sm text-center mb-4">{error}</div>}
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
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </main>
    </div>
  );
}
