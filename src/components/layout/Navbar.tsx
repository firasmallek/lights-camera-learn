"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);



  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <Image 
                src="/assets/logos/LCL_LOGO.png" 
                alt="Lights Camera Learn" 
                width={80} 
                height={80} 
                className="object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-black text-sm font-fjalla uppercase tracking-widest">
              About
            </Link>
            
            {/* Internship Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('internship')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="/directors" className="text-gray-600 hover:text-black text-sm font-fjalla uppercase tracking-widest flex items-center py-2">
                Internship
              </Link>
              {activeDropdown === 'internship' && (
                <div className="absolute left-0 mt-0 w-56 bg-white border border-gray-100 shadow-lg py-2 z-50">
                  <Link href="/overview" className="block px-4 py-2 text-xs font-libre text-gray-600 hover:text-black hover:bg-gray-50">Travel</Link>
                  <Link href="/sawarly" className="block px-4 py-2 text-xs font-libre text-gray-600 hover:text-black hover:bg-gray-50">Sawarly</Link>
                  <Link href="/intenpositions" className="block px-4 py-2 text-xs font-libre text-gray-600 hover:text-black hover:bg-gray-50">Positions</Link>
                  <Link href="/updates" className="block px-4 py-2 text-xs font-libre text-gray-600 hover:text-black hover:bg-gray-50">Journal Entries</Link>
                  <Link href="/new-page-2" className="block px-4 py-2 text-xs font-libre text-gray-600 hover:text-black hover:bg-gray-50">Photographer&apos;s Spotlight</Link>
                  <Link href="/photo-gallery-1" className="block px-4 py-2 text-xs font-libre text-gray-600 hover:text-black hover:bg-gray-50">Gallery</Link>
                </div>
              )}
            </div>

            <Link href="/new-index-1" className="text-gray-600 hover:text-black text-sm font-fjalla uppercase tracking-widest">
              Stars
            </Link>
            <Link href="/partner-1" className="text-gray-600 hover:text-black text-sm font-fjalla uppercase tracking-widest">
              Partner
            </Link>

            {/* Apply Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveDropdown('apply')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link href="/apply" className="text-gray-600 hover:text-black text-sm font-fjalla uppercase tracking-widest flex items-center py-2">
                Apply
              </Link>
              {activeDropdown === 'apply' && (
                <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-100 shadow-lg py-2 z-50">
                  <Link href="/internship-application" className="block px-4 py-2 text-xs font-libre text-gray-600 hover:text-black hover:bg-gray-50">Apply to Intern</Link>
                  <Link href="/inscription" className="block px-4 py-2 text-xs font-libre text-gray-600 hover:text-black hover:bg-gray-50">Apply to Star</Link>
                  <Link href="/schools" className="block px-4 py-2 text-xs font-libre text-gray-600 hover:text-black hover:bg-gray-50">Schools</Link>
                </div>
              )}
            </div>

            <Link href="/faq" className="text-gray-600 hover:text-black text-sm font-fjalla uppercase tracking-widest">
              FAQ
            </Link>
          </nav>

          {/* Social Icons & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex space-x-3 text-gray-400">
              <a href="https://www.facebook.com/10216339393254344" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">FB</a>
              <a href="https://www.instagram.com/lights_camera_learn/" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">IG</a>
              <a href="https://www.youtube.com/channel/UCOgAxjSAZHaPE2UNngCoQFQ" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">YT</a>
            </div>

            <button 
              className="lg:hidden text-gray-600 hover:text-black focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100">
          <nav className="flex flex-col px-4 pt-2 pb-6 space-y-2">
            <Link href="/" className="text-gray-600 block py-2 text-sm font-fjalla uppercase tracking-widest">About</Link>
            
            <div className="py-2">
              <div className="text-gray-600 text-sm font-fjalla uppercase tracking-widest">Internship</div>
              <div className="pl-4 mt-2 space-y-2">
                <Link href="/overview" className="block text-xs font-libre text-gray-500">Travel</Link>
                <Link href="/sawarly" className="block text-xs font-libre text-gray-500">Sawarly</Link>
                <Link href="/intenpositions" className="block text-xs font-libre text-gray-500">Positions</Link>
                <Link href="/updates" className="block text-xs font-libre text-gray-500">Journal Entries</Link>
                <Link href="/new-page-2" className="block text-xs font-libre text-gray-500">Photographer&apos;s Spotlight</Link>
                <Link href="/photo-gallery-1" className="block text-xs font-libre text-gray-500">Gallery</Link>
              </div>
            </div>

            <Link href="/new-index-1" className="text-gray-600 block py-2 text-sm font-fjalla uppercase tracking-widest">Stars</Link>
            <Link href="/partner-1" className="text-gray-600 block py-2 text-sm font-fjalla uppercase tracking-widest">Partner</Link>

            <div className="py-2">
              <div className="text-gray-600 text-sm font-fjalla uppercase tracking-widest">Apply</div>
              <div className="pl-4 mt-2 space-y-2">
                <Link href="/internship-application" className="block text-xs font-libre text-gray-500">Apply to Intern</Link>
                <Link href="/inscription" className="block text-xs font-libre text-gray-500">Apply to Star</Link>
                <Link href="/schools" className="block text-xs font-libre text-gray-500">Schools</Link>
              </div>
            </div>

            <Link href="/faq" className="text-gray-600 block py-2 text-sm font-fjalla uppercase tracking-widest">FAQ</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
