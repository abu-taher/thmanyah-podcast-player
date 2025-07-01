export interface HeaderConfig {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchKeyPress?: (e: React.KeyboardEvent) => void;
  episodeCount?: number;
  hideSearchBar?: boolean;
  onBackClick?: () => void;
}

export interface SidebarContextType {
  navigateToHome: () => void;
  navigateToDiscover: () => void;
  headerConfig: HeaderConfig;
  setHeaderConfig: (config: HeaderConfig) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
} 