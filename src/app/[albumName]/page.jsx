// app/[albumName]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PasswordModal from "@/components/gallery/PasswordModal";
import PhotoGrid from "@/components/gallery/PhotoGrid";
import FilterTabs from "@/components/gallery/FilterTabs";
import Image from "next/image";

export default function AlbumGallery() {
  const { albumName } = useParams();
  const [album, setAlbum] = useState(null);
  const [media, setMedia] = useState([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false); // Add this state

  useEffect(() => {
    const checkAccess = async () => {
      const q = query(collection(db, "albums"), where("name", "==", albumName));
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
      const q = query(
        collection(db, "media"),
        where("albumId", "==", album.id)
      );
      const snap = await getDocs(q);
      setMedia(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchMedia();
  }, [album, showPassword]);

  // Scroll listener for sticky filter
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsFilterSticky(scrollTop > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = () => {
    const shareUrl = window.location.href;
    const shareText = `Check out our beautiful ${album?.title} photo gallery!`;

    if (navigator.share) {
      navigator.share({
        title: album?.title,
        text: shareText,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Gallery link copied to clipboard!");
    }
  };

  const handleEnquire = () => {
    const subject = encodeURIComponent(
      `Enquiry about ${album?.title} Photo Gallery`
    );
    const body = encodeURIComponent(
      `Hi,\n\nI would like to enquire about the "${album?.title}" photo gallery.\n\nGallery Link: ${window.location.href}\n\nPlease get back to me with more details.\n\nThank you!`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-20 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-200/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
        </div>

        <div className="relative text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-amber-200/50">
          <div className="flex justify-center mb-8">
            <img
              src="/logo.png"
              alt="Crown Icon"
              className="w-24 h-24 invert animate-pulse"
            />
          </div>
          <h2 className="text-3xl font-serif text-amber-900 mb-4 tracking-wide">
            Unveiling Precious Memories
          </h2>
          <p className="text-amber-700/80 text-lg font-light mb-8">
            Preparing your treasured collection...
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce"></div>
            <div
              className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  // Album not found state
  if (!album) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-yellow-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative text-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-12 max-w-lg w-full border border-amber-200/50">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-300/20 via-orange-300/20 to-yellow-300/20 p-0.5">
            <div className="w-full h-full bg-white/90 rounded-2xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-4xl font-serif text-amber-900 mb-4 tracking-wide">
              Album Not Found
            </h2>
            <p className="text-amber-700/80 text-lg font-light mb-8 leading-relaxed">
              The treasured memories you seek cannot be located in our
              collection.
            </p>

            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r cursor-pointer from-[#F7CD38] to-[#F4C002] text-white px-8 py-4 rounded-xl font-serif text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Return to Gallery
              </span>
            </button>

            <div className="flex justify-center mt-8 space-x-2">
              <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
              <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
              <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Password modal
  if (showPassword) {
    return (
      <PasswordModal
        albumName={albumName}
        password={album.password}
        onUnlock={() => {
          localStorage.setItem(`album-${albumName}`, album.password);
          setShowPassword(false);
        }}
      />
    );
  }

  const filteredMedia =
    category === "all" ? media : media.filter((m) => m.category === category);


  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-yellow-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-10 w-32 h-32 bg-amber-200/15 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-10 w-40 h-40 bg-orange-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-20 right-1/4 w-28 h-28 bg-amber-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Navigation */}
      <header className="relative z-20 bg-white/90 backdrop-blur-md border-b border-amber-200/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Album Name */}
            <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Crown Logo"
                  className="w-10 h-10 sm:w-12 sm:h-12 invert"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-2xl font-serif text-amber-900 font-bold tracking-wide truncate">
                  {album.title}
                </h1>
                <p className="text-xs sm:text-sm text-amber-700/70 font-light hidden sm:block">
                  Treasured Memories Collection
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center cursor-pointer space-x-1 sm:space-x-2 bg-gradient-to-r from-[#F7CD38] to-[#F4C002] text-white px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-serif text-xs sm:text-sm hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Enquire Button */}
              <button
                onClick={handleEnquire}
                className="flex items-center cursor-pointer space-x-1 sm:space-x-2 bg-white/80 backdrop-blur-sm text-amber-900 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-serif text-xs sm:text-sm border-2 border-amber-300 hover:bg-amber-50 hover:border-amber-400 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="hidden sm:inline">Enquire</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cover Image Section */}
      <div className="relative z-10 h-64 sm:h-80 md:h-96 overflow-hidden">
        {filteredMedia[0]?.url ? (
          <div className="relative h-full">
                         <Image
                           src={filteredMedia[0].url}
                           alt="Album Cover"
                           width={400}
                           height={600}
                           className="w-full h-full object-cover"
                           loading={'lazy'}
                           placeholder="blur"
                           blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
                         />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            <div className="absolute inset-0 flex items-end justify-center pb-8 sm:pb-12">
              <div className="text-center text-white px-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-2 sm:mb-4 tracking-wide drop-shadow-2xl">
                  {album.title}
                </h2>
                {album.description && (
                  <p className="text-base sm:text-lg md:text-xl font-light max-w-3xl mx-auto leading-relaxed drop-shadow-lg opacity-90">
                    {album.description}
                  </p>
                )}

                <div className="flex justify-center items-center mt-4 sm:mt-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent w-16 sm:w-32"></div>
                  <div className="mx-4 sm:mx-6 flex space-x-2">
                    <div className="w-2 h-2 bg-white/80 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                    <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent w-16 sm:w-32"></div>
                </div>

                <p className="text-white/80 italic font-light text-sm sm:text-lg mt-2 sm:mt-4 drop-shadow-lg">
                  "Where every picture tells our story"
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-full bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
              <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/25 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white px-4">
                <div className="flex justify-center mb-6 sm:mb-8">
                  <div className="w-20 h-20 sm:w-32 sm:h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl">
                    <img
                      src="/logo.png"
                      alt="Crown Icon"
                      className="w-12 h-12 sm:w-20 sm:h-20 invert"
                    />
                  </div>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-4 sm:mb-6 tracking-wide drop-shadow-2xl">
                  {album.title}
                </h2>

                {album.description && (
                  <p className="text-lg sm:text-xl md:text-2xl font-light max-w-3xl mx-auto leading-relaxed drop-shadow-lg opacity-90 mb-6 sm:mb-8">
                    {album.description}
                  </p>
                )}

                <div className="flex justify-center items-center mb-4 sm:mb-6">
                  <div className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent w-16 sm:w-32"></div>
                  <div className="mx-4 sm:mx-6 flex space-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/80 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/60 rounded-full"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white/40 rounded-full"></div>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent w-16 sm:w-32"></div>
                </div>

                <p className="text-white/80 italic font-light text-base sm:text-xl drop-shadow-lg">
                  "Where every picture tells our story"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Filter Header */}
      {!isLightboxOpen && (
        <div
          className={`sticky top-0 z-20 transition-all duration-300 ${
            isFilterSticky
              ? "bg-white/30 backdrop-blur-md shadow-lg border-b border-amber-200/50"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <FilterTabs
              category={category}
              setCategory={setCategory}
              isSticky={isFilterSticky}
            />
          </div>
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Media Grid or Empty State */}
        {filteredMedia.length > 0 ? (
          <div className="mb-16 z-5">
            <PhotoGrid
              media={filteredMedia}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
              onLightboxToggle={setIsLightboxOpen} // Pass the state setter
            />
          </div>
        ) : (
          <div className="text-center py-16 sm:py-24">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200/50 p-8 sm:p-16 max-w-2xl mx-auto">
              <div className="w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-amber-300/50 to-orange-400/50 rounded-full flex items-center justify-center shadow-lg mb-6 sm:mb-8 mx-auto">
                <svg
                  className="w-10 h-10 sm:w-16 sm:h-16 text-amber-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif text-amber-900 mb-3 sm:mb-4 tracking-wide">
                No Memories Yet
              </h3>
              <p className="text-amber-700/80 font-light text-base sm:text-lg leading-relaxed">
                {category === "all"
                  ? "This album is waiting to be filled with beautiful moments and treasured memories."
                  : `No precious memories found in the "${category}" collection.`}
              </p>

              <div className="flex justify-center mt-6 sm:mt-8 space-x-2">
                <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
                <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 sm:pt-12 border-t border-amber-200/30">
          <div className="bg-white/40 backdrop-blur-sm rounded-xl p-6 sm:p-8 max-w-md mx-auto border border-amber-200/30">
            <div className="flex justify-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>
            <p className="text-amber-700/70 font-light italic text-base sm:text-lg">
              Treasured memories preserved with love
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
