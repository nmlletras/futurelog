import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getPosts, Post } from '../lib/content';

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      getPosts().then(setPosts);
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  const filteredPosts = posts.filter(p => 
    p.meta.title.toLowerCase().includes(query.toLowerCase()) ||
    p.meta.category?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: -20, x: "-50%" }}
            className="fixed top-[15%] left-1/2 w-[90%] max-w-2xl bg-bg-card border border-border-strong rounded-2xl shadow-2xl z-[101] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-4 border-b border-border-strong">
              <Search className="w-5 h-5 text-text-muted" />
              <input
                autoFocus
                type="text"
                placeholder="Search articles... (Cmd + K)"
                className="flex-1 bg-transparent border-none text-text-main focus:outline-none placeholder:text-text-muted text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button onClick={onClose} className="p-1.5 rounded-md text-text-muted hover:bg-bg-card-hover transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                  <button
                    key={post.slug}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-bg-card-hover text-left group transition-colors"
                    onClick={() => {
                      navigate(`/post/${post.slug}`);
                      onClose();
                    }}
                  >
                    <div>
                      <h4 className="text-text-main font-medium group-hover:text-neon-pink transition-colors">{post.meta.title}</h4>
                      <span className="text-xs text-text-muted">{post.meta.category}</span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-text-muted">
                  No results found for "{query}"
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
