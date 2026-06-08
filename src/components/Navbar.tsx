import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { Search, Sun, Moon, Waves, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

interface NavbarProps {
  theme: string;
  toggleTheme: () => void;
  onOpenSearch: () => void;
}

export function Navbar({ theme, toggleTheme, onOpenSearch }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { text: 'Features', to: '/features' },
    { text: 'Style Guide', to: '/style-guide' },
    { text: 'Tags', to: '/tags' },
    { text: 'Authors', to: '/authors' },
    { text: 'API Status', to: '/api' },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-5xl z-50 px-4"
    >
      <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-2xl relative z-20">
        <NavLink to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
          <Waves className="w-6 h-6 text-text-main group-hover:text-neon-pink transition-colors" />
          <span className="font-bold text-lg tracking-tight text-text-main">Futurelog</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-6 text-sm text-text-muted font-medium">
          {navLinks.map((link) => (
             <NavLink key={link.text} to={link.to} className={({ isActive }) => cn("hover:text-text-main transition-colors", isActive && "text-text-main")}>{link.text}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={onOpenSearch} className="text-text-muted hover:text-text-main transition-colors p-1" aria-label="Search">
            <Search className="w-5 h-5 md:w-4 md:h-4" />
          </button>
          <button onClick={toggleTheme} className="text-text-muted hover:text-text-main transition-colors p-1 text-xl" aria-label="Toggle Theme">
            {theme === 'dark' ? <Sun className="w-5 h-5 md:w-4 md:h-4" /> : <Moon className="w-5 h-5 md:w-4 md:h-4" />}
          </button>
          <div className="w-px h-5 bg-border-strong md:hidden block"></div>
          <button 
            className="md:hidden text-text-muted hover:text-text-main transition-colors flex items-center justify-center p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Menu"
          >
             {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-4 right-4 mt-2 p-6 glass rounded-2xl flex flex-col gap-5 shadow-2xl overflow-hidden md:hidden z-10"
          >
             {navLinks.map((link) => (
                <NavLink 
                  key={link.text} 
                  to={link.to} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => cn(
                    "text-xl font-medium text-text-muted hover:text-text-main transition-all flex items-center justify-between", 
                    isActive && "text-text-main text-neon-pink"
                  )}
                >
                  {link.text}
                </NavLink>
             ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
