// app/admin/login/page.tsx
'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white/80 p-10 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-serif text-gold mb-8">Admin Login</h1>
        <input
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full p-3 border rounded-lg mb-4"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <button
          type="submit"
          className="bg-gold text-white px-6 py-3 rounded-lg w-full hover:bg-opacity-90 transition"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
