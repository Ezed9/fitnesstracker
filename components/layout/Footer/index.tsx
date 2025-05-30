import React from 'react';
import Link from 'next/link';
import { Instagram, Twitter, Github, Home, BarChart2, Dumbbell, Settings } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#121212] text-[#A1A1AA] py-6 px-4 border-t border-gray-800">
      <div className="container mx-auto">
        {/* Mobile Layout (Stacked) */}
        <div className="flex flex-col items-center space-y-6 md:hidden">
          <div className="text-xl font-semibold text-white">FitTrack</div>
          
          <nav className="flex flex-wrap justify-center gap-6">
            <Link href="/" className="flex items-center gap-1 hover:text-[#4ADE80] transition-colors">
              <Home size={16} />
              <span>Home</span>
            </Link>
            <Link href="/macrotracker" className="flex items-center gap-1 hover:text-[#4ADE80] transition-colors">
              <BarChart2 size={16} />
              <span>Macros</span>
            </Link>
            <Link href="/workout" className="flex items-center gap-1 hover:text-[#4ADE80] transition-colors">
              <Dumbbell size={16} />
              <span>Workout</span>
            </Link>
            <Link href="/settings" className="flex items-center gap-1 hover:text-[#4ADE80] transition-colors">
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </nav>
          
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" 
               className="hover:text-[#60A5FA] transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
               className="hover:text-[#60A5FA] transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
               className="hover:text-[#60A5FA] transition-colors">
              <Github size={20} />
            </a>
          </div>
          
          <div className="text-sm text-center space-y-1">
            <p className="italic text-gray-400">Stay consistent, stay strong.</p>
            <p>© 2025 FitTrack. All rights reserved.</p>
          </div>
        </div>
        
        {/* Desktop Layout (Horizontal) */}
        <div className="hidden md:flex md:flex-row md:justify-between md:items-center">
          <div className="text-xl font-semibold text-white">FitTrack</div>
          
          <nav className="flex gap-8">
            <Link href="/" className="flex items-center gap-1 hover:text-[#4ADE80] transition-colors">
              <Home size={16} />
              <span>Home</span>
            </Link>
            <Link href="/macrotracker" className="flex items-center gap-1 hover:text-[#4ADE80] transition-colors">
              <BarChart2 size={16} />
              <span>Macros</span>
            </Link>
            <Link href="/workout" className="flex items-center gap-1 hover:text-[#4ADE80] transition-colors">
              <Dumbbell size={16} />
              <span>Workout</span>
            </Link>
            <Link href="/settings" className="flex items-center gap-1 hover:text-[#4ADE80] transition-colors">
              <Settings size={16} />
              <span>Settings</span>
            </Link>
          </nav>
          
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" 
               className="hover:text-[#60A5FA] transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
               className="hover:text-[#60A5FA] transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
               className="hover:text-[#60A5FA] transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
        
        {/* Copyright for desktop - at the bottom */}
        <div className="hidden md:flex md:flex-col md:items-center md:mt-6 md:text-sm">
          <p className="italic text-gray-400">Stay consistent, stay strong.</p>
          <p>© 2025 FitTrack. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
