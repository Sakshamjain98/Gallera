'use client';
import { useState } from 'react';

export default function PasswordModal({ 
    albumName, password 
}) {
  const [inputPassword, setInputPassword] = useState('');
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputPassword === password) {
        e.preventDefault();
    if (inputPassword === password) {
      localStorage.setItem(`album-${albumName}`, inputPassword);
      window.location.reload();
    }
    } else {
      setError('Incorrect Password - please try again');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-white via-orange-50 to-yellow-50 flex items-center justify-center p-2">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-yellow-200/20 rounded-full blur-3xl"></div>
      </div>

      <div className={`relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-10 max-w-lg w-full border border-amber-200/50 ${isShaking ? 'animate-pulse' : ''}`}>
        {/* Decorative border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-300/20 via-orange-300/20 to-yellow-300/20 p-0.5">
          <div className="w-full h-full bg-white/90 rounded-2xl"></div>
        </div>

        <div className="relative z-10">
          {/* Crown icon */}
          <div className="flex justify-center">
      <img src="/logo.png" alt="Crown Icon" className="w-48 invert h-full" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-serif text-amber-900 mb-2 tracking-wide">
              {albumName}
            </h2>
            <p className="text-amber-700/80 text-lg font-light">
              Enter the secret phrase to unveil our treasured memories
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="password"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  setError('');
                }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSubmit(e);
                  }
                }}
                placeholder="Enter the password..."
                className="w-full p-5 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-[#F7CD38] focus:border-[#F7CD38] transition-all duration-300 bg-white/50 backdrop-blur-sm text-black placeholder-black text-lg font-light"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {error && (
              <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-[#F7CD38] to-[#F4C002] text-white py-4 rounded-xl font-serif text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Unlock Our Journey
              </span>
            </button>
          </div>

          {/* Decorative elements */}
          <div className="flex justify-center mt-8 space-x-2">
            <div className="w-2 h-2 bg-amber-300 rounded-full"></div>
            <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
          </div>

          <p className="text-center text-amber-600/70 text-sm mt-4 font-light italic">
            "Where every picture tells our story"
          </p>
        </div>
      </div>
    </div>
  );
}