import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white p-6 mt-8">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} FitTrack. All rights reserved.</p>
        <div className="mt-2 text-sm text-gray-400">
          Made with ❤️ for fitness enthusiasts
        </div>
      </div>
    </footer>
  );
};
