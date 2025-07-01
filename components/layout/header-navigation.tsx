'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSidebar } from '../../contexts/sidebar-context';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  HamburgerIcon,
  XMarkIcon,
} from '../ui/icons';
import Logo from '../../lib/logo';

export function HeaderNavigation() {
  const { headerConfig, isMobileMenuOpen, toggleMobileMenu } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const {
    searchPlaceholder = "Search through over 70 million podcasts and episodes...",
    searchValue,
    onSearchChange,
    onSearchKeyPress,
    episodeCount,
    hideSearchBar = false,
    onBackClick
  } = headerConfig;

  const effectiveSearchValue = searchValue !== undefined ? searchValue : localSearchTerm;
  const effectiveOnChange = onSearchChange || setLocalSearchTerm;

  const effectivePlaceholder = episodeCount 
    ? `Search through ${episodeCount} episodes...`
    : searchPlaceholder;

  const handleBackClick = () => {
    if (onBackClick) {
      // Use custom back handler if provided
      onBackClick();
    } else if (pathname === '/' && (searchValue || localSearchTerm)) {
      // On home page with search active, clear search instead of going back
      if (onSearchChange) {
        onSearchChange('');
      } else {
        setLocalSearchTerm('');
      }
    } else {
      // Default browser back behavior
      router.back();
    }
  };

  return (
    <div className="flex items-center justify-between px-4 md:px-6 py-4 bg-slate-900/80 backdrop-blur-sm border-b border-slate-700">
      {/* Mobile hamburger menu and navigation */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <XMarkIcon className="w-5 h-5" />
          ) : (
            <HamburgerIcon className="w-5 h-5" />
          )}
        </button>
        
        {/* Mobile navigation buttons */}
        <div className="md:hidden flex items-center space-x-2">
          <button 
            onClick={handleBackClick}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => router.forward()}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
            aria-label="Go forward"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
        
        {/* Desktop navigation buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <button 
            onClick={handleBackClick}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          <button 
            onClick={() => router.forward()}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search bar - hidden on mobile */}
      {!hideSearchBar && (
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={effectivePlaceholder}
              value={effectiveSearchValue}
              onChange={(e) => effectiveOnChange(e.target.value)}
              onKeyDown={onSearchKeyPress}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      {/* Desktop auth buttons */}
      <div className="hidden md:flex items-center space-x-3">
        <button className="px-4 py-2 bg-[#3ADEE6] hover:bg-[#2BC5CE] rounded-lg transition-colors text-sm text-slate-900">
          Log in
        </button>
        <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm">
          Sign up
        </button>
      </div>

      {/* Mobile logo - shown when sidebar is closed */}
      <div className="md:hidden">
        <Logo />
      </div>
    </div>
  );
} 