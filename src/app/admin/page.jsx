'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, where, orderBy, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLORS = {
  primaryBlue: '#007BFF',
  deepBlue: '#004B87',
  white: '#FFFFFF',
  lightGray: '#F4F4F4',
  darkGray: '#343A40'
};

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [albums, setAlbums] = useState([]);
  const [loadingAlbums, setLoadingAlbums] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalAlbums: 0,
    activeAlbums: 0,
    totalMedia: 0
  });

  useEffect(() => {
    if (user) {
      fetchAlbums();
    }
  }, [user]);

  const fetchAlbums = async () => {
    try {
      setLoadingAlbums(true);
      const albumsQuery = query(
        collection(db, 'albums'),
        orderBy('createdAt', 'desc')
      );
      const albumsSnapshot = await getDocs(albumsQuery);

      const albumsData = [];
      let totalMedia = 0;
      for (const albumDoc of albumsSnapshot.docs) {
        const albumData = { id: albumDoc.id, ...albumDoc.data() };
        const mediaQuery = query(
          collection(db, 'media'),
          where('albumId', '==', albumDoc.id)
        );
        const mediaSnapshot = await getDocs(mediaQuery);
        albumData.mediaCount = mediaSnapshot.size;
        totalMedia += mediaSnapshot.size;
        albumsData.push(albumData);
      }
      setAlbums(albumsData);
      setStats({
        totalAlbums: albumsData.length,
        activeAlbums: albumsData.filter(album => album.isActive).length,
        totalMedia
      });
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoadingAlbums(false);
    }
  };

  const toggleAlbumStatus = async (albumId, currentStatus) => {
    try {
      await updateDoc(doc(db, 'albums', albumId), {
        isActive: !currentStatus
      });
      setAlbums(albums.map(album =>
        album.id === albumId
          ? { ...album, isActive: !currentStatus }
          : album
      ));
      setStats(prev => ({
        ...prev,
        activeAlbums: prev.activeAlbums + (currentStatus ? -1 : 1)
      }));
    } catch (error) {
      console.error('Error updating album status:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        {/* Mobile Sidebar */}
        <aside className={`
          w-64 bg-white border-r border-slate-200 flex flex-col py-8 px-6 
          fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          -translate-x-full lg:translate-x-0 lg:static lg:z-30
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
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 bg-indigo-50 font-medium transition"
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
        {/* Loading Content */}
        <main className="flex-1 lg:ml-64 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    router.push('/admin/login');
    return null;
  }

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
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-indigo-50 font-medium transition"
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
          <h1 style={{ color: COLORS.deepBlue }} className="text-xl font-serif font-bold">Dashboard</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        <div style={{ minHeight: '100vh', background: COLORS.white }} className="p-4 lg:p-12">
          <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Desktop Header */}
            <div className="hidden lg:block mb-8">
              <h1 style={{ color: COLORS.deepBlue }} className="text-3xl font-serif font-bold">Admin Dashboard</h1>
              <p style={{ color: COLORS.darkGray }} className="mt-2">Welcome back! Here's what's happening with your wedding albums.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
              <div style={{ background: COLORS.lightGray, borderColor: COLORS.primaryBlue }} className="rounded-xl p-4 lg:p-6 border shadow-sm">
                <div className="flex items-center">
                  <div style={{ background: COLORS.primaryBlue }} className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                    <span style={{ color: COLORS.white }} className="text-lg lg:text-xl">📚</span>
                  </div>
                  <div>
                    <p style={{ color: COLORS.darkGray }} className="text-xs lg:text-sm font-medium">Total Albums</p>
                    <p style={{ color: COLORS.darkGray }} className="text-xl lg:text-2xl font-bold">{stats.totalAlbums}</p>
                  </div>
                </div>
              </div>
              <div style={{ background: COLORS.lightGray, borderColor: COLORS.primaryBlue }} className="rounded-xl p-4 lg:p-6 border shadow-sm">
                <div className="flex items-center">
                  <div style={{ background: COLORS.primaryBlue }} className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                    <span style={{ color: COLORS.white }} className="text-lg lg:text-xl">✅</span>
                  </div>
                  <div>
                    <p style={{ color: COLORS.darkGray }} className="text-xs lg:text-sm font-medium">Active Albums</p>
                    <p style={{ color: COLORS.darkGray }} className="text-xl lg:text-2xl font-bold">{stats.activeAlbums}</p>
                  </div>
                </div>
              </div>
              <div style={{ background: COLORS.lightGray, borderColor: COLORS.primaryBlue }} className="rounded-xl p-4 lg:p-6 border shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="flex items-center">
                  <div style={{ background: COLORS.primaryBlue }} className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center mr-3 lg:mr-4">
                    <span style={{ color: COLORS.white }} className="text-lg lg:text-xl">📸</span>
                  </div>
                  <div>
                    <p style={{ color: COLORS.darkGray }} className="text-xs lg:text-sm font-medium">Total Media</p>
                    <p style={{ color: COLORS.darkGray }} className="text-xl lg:text-2xl font-bold">{stats.totalMedia}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-6 lg:mb-8">
              <h2 style={{ color: COLORS.deepBlue }} className="text-lg lg:text-xl font-serif mb-4">Quick Actions</h2>
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <Link
                  href="/admin/albums/create"
                  style={{ background: COLORS.primaryBlue, color: COLORS.white }}
                  className="px-4 lg:px-6 py-3 rounded-lg font-medium shadow-sm hover:opacity-90 flex items-center justify-center space-x-2"
                >
                  <span>➕</span>
                  <span>Create New Album</span>
                </Link>
                <button
                  onClick={fetchAlbums}
                  style={{ background: COLORS.white, color: COLORS.primaryBlue, border: `1px solid ${COLORS.primaryBlue}` }}
                  className="px-4 lg:px-6 py-3 rounded-lg font-medium hover:bg-blue-50 shadow-sm flex items-center justify-center space-x-2"
                >
                  <span>🔄</span>
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Albums Section */}
            <div style={{ background: COLORS.white, borderColor: COLORS.primaryBlue }} className="rounded-xl border shadow-sm">
              <div style={{ borderBottom: `1px solid ${COLORS.primaryBlue}` }} className="p-4 lg:p-6">
                <h2 style={{ color: COLORS.deepBlue }} className="text-lg lg:text-xl font-serif">Wedding Albums</h2>
                <p style={{ color: COLORS.darkGray }} className="text-sm mt-1">Manage all your wedding photo collections</p>
              </div>
              <div className="p-4 lg:p-6">
                {loadingAlbums ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4" style={{ borderColor: COLORS.primaryBlue }}></div>
                    <p style={{ color: COLORS.darkGray }}>Loading albums...</p>
                  </div>
                ) : albums.length === 0 ? (
                  <div className="text-center py-12">
                    <div style={{ background: COLORS.primaryBlue }} className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span style={{ color: COLORS.white }} className="text-2xl">📚</span>
                    </div>
                    <h3 style={{ color: COLORS.deepBlue }} className="text-lg font-medium mb-2">No albums yet</h3>
                    <p style={{ color: COLORS.darkGray }} className="mb-4 text-sm lg:text-base">Create your first wedding album to get started</p>
                    <Link
                      href="/admin/albums/create"
                      style={{ background: COLORS.primaryBlue, color: COLORS.white }}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg hover:opacity-90"
                    >
                      <span>➕</span>
                      <span>Create Album</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                    {albums.map((album) => (
                      <div
                        key={album.id}
                        style={{ background: COLORS.lightGray, borderColor: COLORS.primaryBlue }}
                        className="rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                      >
                        <div className="p-4 lg:p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1 min-w-0">
                              <h3 style={{ color: COLORS.deepBlue }} className="font-semibold mb-1 text-sm lg:text-base truncate">{album.title}</h3>
                              <p style={{ color: COLORS.darkGray }} className="text-xs lg:text-sm truncate">{album.name}</p>
                            </div>
                            <div
                              style={{
                                background: album.isActive ? COLORS.primaryBlue : COLORS.lightGray,
                                color: album.isActive ? COLORS.white : COLORS.primaryBlue
                              }}
                              className="px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0"
                            >
                              {album.isActive ? '✅ Active' : '⏸️ Inactive'}
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-xs lg:text-sm" style={{ color: COLORS.darkGray }}>
                              <span className="mr-2">📸</span>
                              <span>{album.mediaCount || 0} photos/videos</span>
                            </div>
                            <div className="flex items-center text-xs lg:text-sm" style={{ color: COLORS.darkGray }}>
                              <span className="mr-2">📅</span>
                              <span>Created {formatDate(album.createdAt)}</span>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Link
                              href={`/admin/albums/${album.id}`}
                              style={{ background: COLORS.primaryBlue, color: COLORS.white }}
                              className="flex-1 text-center py-2 px-3 rounded-lg text-sm font-medium hover:opacity-90"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/admin/albums/${album.id}/media`}
                              style={{ background: COLORS.deepBlue, color: COLORS.white }}
                              className="flex-1 text-center py-2 px-3 rounded-lg text-sm font-medium hover:opacity-90"
                            >
                              Media
                            </Link>
                            <button
                              onClick={() => toggleAlbumStatus(album.id, album.isActive)}
                              style={{
                                background: album.isActive ? COLORS.white : COLORS.primaryBlue,
                                color: album.isActive ? COLORS.primaryBlue : COLORS.white,
                                border: `1px solid ${COLORS.primaryBlue}`
                              }}
                              className="px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 sm:flex-shrink-0"
                            >
                              {album.isActive ? '⏸️' : '▶️'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer style={{ background: COLORS.primaryBlue, color: COLORS.white }} className="py-4 mt-6 lg:mt-10">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="font-serif text-base lg:text-lg">© 2025 Wedding Gallery</span>
            <span style={{ color: COLORS.white }} className="text-sm lg:text-base">Made with ♥ by Admin</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
