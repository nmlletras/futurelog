import { ReactNode, useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { CommandPalette } from './CommandPalette';

export function Layout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleCmdK = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleCmdK);
    return () => window.removeEventListener('keydown', handleCmdK);
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-neon-pink selection:text-white">
      {/* Ambient background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-pink/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-neon-blue/10 blur-[120px] rounded-full pointer-events-none" />
      
      <Navbar theme={theme} toggleTheme={toggleTheme} onOpenSearch={() => setIsSearchOpen(true)} />
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      <main className="flex-grow pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10">
        {children}
      </main>

      <footer className="py-8 text-center text-text-muted text-sm z-10 border-t border-border-strong">
        <p>&copy; {new Date().getFullYear()} Futurelog.</p>
      </footer>
    </div>
  );
}
