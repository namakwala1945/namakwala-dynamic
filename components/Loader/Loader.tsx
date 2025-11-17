// components/Loader.tsx
import React from "react";

interface LoaderProps {
  show?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ show = true }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
      <div className="flex flex-col items-center p-6 rounded-xl bg-white/20 backdrop-blur-lg shadow-xl animate-fadeIn">
        {/* Logo */}
        <img
          src="/namakwala-white-logo.png"
          alt="Logo"
          className="w-32 h-32 mb-4 animate-bounce-slow"
        />

        {/* Running dots */}
        {/* <div className="flex space-x-2 mb-4">
          <div className="w-3 h-3 bg-white rounded-full animate-dotBounce"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-dotBounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-white rounded-full animate-dotBounce animation-delay-400"></div>
        </div> */}

        {/* Animated loading text */}
        <p className="text-white text-lg font-semibold animate-pulse">
          Loading your experience...
        </p>

        {/* Optional progress shimmer */}
        <div className="mt-4 w-40 h-1 bg-white/30 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 w-20 h-1 bg-white animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
