// components/gallery/FilterTabs.jsx
'use client';
import { motion } from 'framer-motion';

const categories = [
  { value: 'all', label: 'All', icon: '✨' },
  { value: 'haldi', label: 'Haldi', icon: '🌼' },
  { value: 'mehandi', label: 'Mehandi', icon: '🎨' },
  { value: 'wedding', label: 'Wedding', icon: '💒' },
  { value: 'reception', label: 'Reception', icon: '🥂' },
  { value: 'engagement', label: 'Engagement', icon: '💍' }
];

export default function FilterTabs({ category, setCategory, isSticky = false }) {
  return (
    <div className="relative z-50">
      {/* Glassmorphism container */}
      <div className={`  rounded-2xl p-1 ${
        isSticky 
          ? 'bg-transparent' 
          : 'bg-white/10 '
      }`}>
        {/* Mobile: Horizontal scroll container */}
        <div className="overflow-x-auto overflow-y-hidden  scrollbar-hide">
          <div className="flex  gap-4 min-w-max md:min-w-0 md:justify-center">
            {categories.map((cat) => (
              <motion.button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`relative flex cursor-pointer items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                  category === cat.value 
                    ? 'bg-gradient-to-r from-[#F7CD38] to-[#F4C002] text-white shadow-lg backdrop-blur-sm' 
                    : 'text-amber-800 hover:bg-white/50 hover:backdrop-blur-sm hover:text-amber-900'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.label}</span>
                
                {/* Subtle glow for active state */}
                {category === cat.value && (
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/10 to-orange-400/10"
                    layoutId="activeGlow"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
