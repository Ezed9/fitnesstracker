import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Navbar = () => {
  const router = useRouter();
  
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Macros', path: '/macros' },
    { name: 'Workouts', path: '/workout' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">FitTrack</div>
        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${router.pathname === item.path ? 'text-blue-400' : 'text-gray-300 hover:text-white'}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <DarkModeToggle />
      </div>
    </nav>
  );
};

const DarkModeToggle = () => {
  // Implementation for dark mode toggle
  return (
    <button className="p-2 rounded-full bg-gray-800">
      <span className="text-sm">🌓</span>
    </button>
  );
};
