import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Menu, X, Sun, Moon, Lock, UserCheck, ChevronDown } from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  isClientAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  onLogoutClient: () => void;
  onLogoutAdmin: () => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  theme,
  toggleTheme,
  isClientAuthenticated,
  isAdminAuthenticated,
  onLogoutClient,
  onLogoutAdmin,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "portfolio", label: "Portfolio" },
    { id: "services", label: "Services" },
    { id: "booking", label: "Booking" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <nav
      id="main-nav"
      className={`sticky top-0 z-50 transition-colors duration-300 border-b ${
        theme === "dark"
          ? "bg-black/95 border-neutral-900 text-white"
          : "bg-white/95 border-neutral-200 text-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div
            id="logo-container"
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <Camera className="w-6 h-6 text-gold-500 transition-transform duration-500 group-hover:rotate-45" />
            <span className="font-serif text-lg tracking-widest font-semibold uppercase">
              VS PHOTOGRAPHY
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-1 py-2 font-sans text-xs tracking-widest uppercase transition-colors duration-300 ${
                  activeTab === item.id
                    ? "text-gold-500"
                    : theme === "dark"
                    ? "text-neutral-300 hover:text-white"
                    : "text-neutral-600 hover:text-black"
                }`}
              >
                {item.label}
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Portal / Theme Action Bar */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark/Light mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors duration-300 ${
                theme === "dark" ? "hover:bg-neutral-900" : "hover:bg-neutral-100"
              }`}
              title="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-gold-500" />
              ) : (
                <Moon className="w-4 h-4 text-gold-500" />
              )}
            </button>

            {/* Unified Authentication & Portal Access */}
            {isClientAuthenticated || isAdminAuthenticated ? (
              <div className="flex items-center space-x-3">
                {isClientAuthenticated && (
                  <button
                    id="client-portal-active-btn"
                    onClick={() => handleNavClick("client-portal")}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 border border-gold-500/50 hover:bg-gold-500 hover:text-black rounded text-[10px] tracking-widest uppercase font-sans text-gold-500 transition-all cursor-pointer font-bold"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Client Portal
                  </button>
                )}
                {isAdminAuthenticated && (
                  <button
                    id="admin-portal-active-btn"
                    onClick={() => handleNavClick("admin-portal")}
                    className="px-3.5 py-1.5 bg-gold-500 hover:bg-gold-400 text-black rounded text-[10px] tracking-widest uppercase font-sans font-bold transition-all cursor-pointer"
                  >
                    Dashboard
                  </button>
                )}
              </div>
            ) : (
              <button
                id="nav-portal-login-btn"
                onClick={() => handleNavClick("client-portal")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded text-[10px] tracking-widest uppercase font-sans font-semibold border transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-neutral-900 text-neutral-200 hover:text-white border-neutral-800"
                    : "bg-neutral-100 text-neutral-700 hover:text-black border-neutral-200"
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-gold-500" />
                <span>Portal Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              id="mobile-theme-toggle"
              onClick={toggleTheme}
              className="p-1.5 rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-gold-500" />
              ) : (
                <Moon className="w-4 h-4 text-gold-500" />
              )}
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 text-gold-500"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${
              theme === "dark"
                ? "bg-black border-neutral-900"
                : "bg-white border-neutral-200"
            }`}
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  id={`mobile-nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left px-3 py-3 text-sm tracking-widest uppercase font-sans border-b ${
                    activeTab === item.id
                      ? "text-gold-500 border-gold-500"
                      : "text-neutral-400 border-neutral-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 border-t border-neutral-950/20 space-y-3">
                <span className="text-[9px] font-mono tracking-widest uppercase text-neutral-500 block px-3">
                  Secure Access Portal
                </span>
                {isClientAuthenticated || isAdminAuthenticated ? (
                  <div className="grid grid-cols-1 gap-2 px-3">
                    {isClientAuthenticated && (
                      <button
                        id="mobile-client-portal-btn"
                        onClick={() => handleNavClick("client-portal")}
                        className={`flex items-center justify-center gap-1.5 py-3 rounded text-[10px] tracking-widest uppercase font-sans border transition-colors cursor-pointer ${
                          theme === "dark"
                            ? "border-gold-500 text-gold-500 font-bold bg-gold-950/10"
                            : "border-gold-500 text-gold-500 font-bold bg-gold-50"
                        }`}
                      >
                        <UserCheck className="w-4 h-4 text-gold-500" />
                        <span>Client Portal</span>
                      </button>
                    )}
                    {isAdminAuthenticated && (
                      <button
                        id="mobile-admin-portal-btn"
                        onClick={() => handleNavClick("admin-portal")}
                        className="flex items-center justify-center gap-1.5 py-3 rounded text-[10px] tracking-widest uppercase font-sans bg-gold-500 text-black border border-gold-500 font-bold transition-colors cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="px-3">
                    <button
                      id="mobile-portal-login-btn"
                      onClick={() => handleNavClick("client-portal")}
                      className={`w-full flex items-center justify-center gap-1.5 py-3 rounded text-[10px] tracking-widest uppercase font-sans border transition-colors cursor-pointer ${
                        theme === "dark"
                          ? "border-neutral-800 text-neutral-300 hover:text-white bg-neutral-950"
                          : "border-neutral-200 text-neutral-700 hover:text-black bg-neutral-50"
                      }`}
                    >
                      <Lock className="w-4 h-4 text-gold-500" />
                      <span>Portal Login</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
