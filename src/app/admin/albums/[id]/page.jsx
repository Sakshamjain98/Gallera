"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import UploadZone from "@/components/admin/UploadZone";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const CATEGORIES = [
  { value: "all", label: "All Events", icon: "🎉", color: "bg-purple-500" },
  {
    value: "haldi",
    label: "Haldi Ceremony",
    icon: "🌻",
    color: "bg-yellow-500",
  },
  {
    value: "mehandi",
    label: "Mehndi Night",
    icon: "🎨",
    color: "bg-orange-500",
  },
  { value: "wedding", label: "Wedding Day", icon: "👰", color: "bg-pink-500" },
  { value: "reception", label: "Reception", icon: "🥂", color: "bg-green-500" },
  {
    value: "engagement",
    label: "Engagement",
    icon: "💍",
    color: "bg-blue-500",
  },
];

export default function EditAlbum() {
  const { user, loading } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [album, setAlbum] = useState(null);
  const [media, setMedia] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: "",
    name: "",
    password: "",
    isActive: true,
  });
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [replaceMode, setReplaceMode] = useState(false);

  useEffect(() => {
    if (!user && !loading) router.push("/admin/login");
    const fetchAlbum = async () => {
      const docRef = doc(db, "albums", id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setAlbum({ id: snap.id, ...snap.data() });
        setForm({
          title: snap.data().title,
          name: snap.data().name,
          password: snap.data().password,
          isActive: snap.data().isActive,
        });
      }
    };
    fetchAlbum();
  }, [id, user, loading, router]);

  useEffect(() => {
    const fetchMedia = async () => {
      if (!album) return;
      const q = query(
        collection(db, "media"),
        where("albumId", "==", album.id)
      );
      const snap = await getDocs(q);
      setMedia(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchMedia();
  }, [album]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setEditing(true);
    try {
      await updateDoc(doc(db, "albums", album.id), { ...form });
      alert("Album updated!");
    } catch (err) {
      alert("Error updating: " + err.message);
    }
    setEditing(false);
  };

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm("Delete this file?")) return;
    await deleteDoc(doc(db, "media", mediaId));
    setMedia(media.filter((m) => m.id !== mediaId));
  };

  // Called after successful upload(s) from UploadZone
  const handleUploadComplete = async (uploadedFiles) => {
    if (!album) return;
    if (replaceMode && selectedCategory !== "all") {
      const q = query(
        collection(db, "media"),
        where("albumId", "==", album.id),
        where("category", "==", selectedCategory)
      );
      const snap = await getDocs(q);
      for (const docRef of snap.docs) {
        await deleteDoc(doc(db, "media", docRef.id));
      }
      setMedia(media.filter((m) => m.category !== selectedCategory));
    }
    const newMedia = [];
    for (const file of uploadedFiles) {
      const newDoc = {
        albumId: album.id,
        url: file.url,
        filename: file.filename,
        type: file.type.startsWith("video") ? "video" : "photo",
        category: selectedCategory,
        uploadedAt: new Date(),
        fileSize: file.size,
      };
      const docRef = await addDoc(collection(db, "media"), newDoc);
      newMedia.push({ ...newDoc, id: docRef.id });
    }
    setMedia((prev) => [...prev, ...newMedia]);
  };

  const filteredMedia =
    selectedCategory === "all"
      ? media
      : media.filter((m) => m.category === selectedCategory);

  const getMediaCount = (cat) =>
    cat === "all"
      ? media.length
      : media.filter((m) => m.category === cat).length;

  if (!album)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading album...</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col py-8 px-6 fixed inset-y-0 left-0 z-30">
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <span className="text-2xl bg-indigo-600 text-white rounded-lg p-2">
              📸
            </span>
            <span className="font-bold text-lg text-slate-800">
              Admin Panel
            </span>
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
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                  📸
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    {album.title}
                  </h1>
                  <p className="text-slate-500 text-sm">
                    Album ID: {album.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    album.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {album.isActive ? "Active" : "Inactive"}
                </div>
                <div className="text-slate-500 text-sm">
                  {media.length} total files
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.value}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center text-white text-lg`}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-2xl font-bold text-slate-800">
                    {getMediaCount(cat.value)}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-600">
                  {cat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Settings & Upload */}
            <div className="lg:col-span-1 space-y-6">
              {/* Album Settings Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                      ⚙️
                    </div>
                    Album Settings
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Album Title
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        required
                        placeholder="Enter album title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Slug
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        required
                        placeholder="album-slug"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        value={form.password}
                        onChange={(e) =>
                          setForm({ ...form, password: e.target.value })
                        }
                        required
                        placeholder="Enter password"
                      />
                    </div>
                    <div className="flex items-center space-x-3 pt-2">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) =>
                          setForm({ ...form, isActive: e.target.checked })
                        }
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        id="active-checkbox"
                      />
                      <label
                        htmlFor="active-checkbox"
                        className="text-sm font-medium text-slate-700"
                      >
                        Album is active
                      </label>
                    </div>
                  </div>
                  <button
                    onClick={handleUpdate}
                    className="w-full mt-6 bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    disabled={editing}
                  >
                    {editing ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>

              {/* Upload Card */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      📤
                    </div>
                    Upload Media
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      >
                        {CATEGORIES.filter((c) => c.value !== "all").map(
                          (cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={replaceMode}
                        onChange={(e) => setReplaceMode(e.target.checked)}
                        className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        id="replace-checkbox"
                      />
                      <label
                        htmlFor="replace-checkbox"
                        className="text-sm text-slate-600"
                      >
                        Replace existing media in category
                      </label>
                    </div>
                  </div>
                  <div className="mt-6">
                    <UploadZone
                      albumId={album.id}
                      category={selectedCategory}
                      replaceMode={replaceMode}
                      onUploadComplete={handleUploadComplete}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Media Gallery */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                        🖼️
                      </div>
                      Media Gallery
                    </h2>
                    <div className="text-sm text-slate-500">
                      {filteredMedia.length} files
                    </div>
                  </div>
                </div>
                {/* Category Filter Tabs */}
                <div className="p-6 border-b border-slate-200">
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedCategory === cat.value
                            ? "bg-indigo-100 text-indigo-700 border-2 border-indigo-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-2 border-transparent"
                        }`}
                        type="button"
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            selectedCategory === cat.value
                              ? "bg-indigo-200 text-indigo-800"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {getMediaCount(cat.value)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media Grid */}
                <div className="p-6">
                  {filteredMedia.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredMedia.map((m) => (
                        <div key={m.id} className="relative  group">
                          <div className="">
                            {m.type === "photo" ? (
                              <Image
                                src={m.url}
                                alt={m.filename}
                                width={400}
                                height={600}
                                className="w-full h-auto object-cover"
                                loading={"lazy"}
                                placeholder="blur"
                                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
                              />
                            ) : (
                              <video
                                src={m.url}
                                controls
                                className="w-full"
                              />
                            )}
                            {/* Overlay */}
                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                              <button
                                className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-full p-2 transition-all duration-200 transform scale-90 group-hover:scale-100"
                                onClick={() => handleDeleteMedia(m.id)}
                                title="Delete file"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                          {/* File Info */}
                          <div className="mt-2 px-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 truncate flex-1 mr-2">
                                {m.filename}
                              </span>
                              <div className="flex items-center space-x-1 flex-shrink-0">
                                <span
                                  className={`w-2 h-2 rounded-full ${
                                    CATEGORIES.find(
                                      (c) => c.value === m.category
                                    )?.color || "bg-gray-400"
                                  }`}
                                ></span>
                                <span className="text-slate-400">
                                  {
                                    CATEGORIES.find(
                                      (c) => c.value === m.category
                                    )?.icon
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-slate-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-lg font-medium">
                        No media files
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        Upload some files to get started
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
