import { useEffect, useState } from 'react';
import { getPosts } from '../lib/content';
import { motion } from 'motion/react';
import { Hash } from 'lucide-react';

export function Tags() {
  const [tags, setTags] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then((data) => {
      const counts: { [key: string]: number } = {};
      data.forEach(post => {
        post.meta.tags?.forEach(tag => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      });
      setTags(counts);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto space-y-12"
    >
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-main tracking-tight mb-4">
          Explore Tags
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto">
          Browse articles by topics. Here is a visual map of all tags used across Futurelog.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedTags.map(([tagName, count], index) => (
          <motion.div
            key={tagName}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group block p-4 bg-bg-card border border-border-strong rounded-2xl hover:border-neon-pink hover:shadow-[0_0_20px_rgba(240,46,101,0.15)] hover:bg-bg-card-hover transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-text-main font-medium group-hover:text-neon-pink transition-colors">
                <Hash className="w-4 h-4 text-text-muted group-hover:text-neon-pink transition-colors" />
                {tagName}
              </div>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-border-subtle text-xs text-text-muted font-mono group-hover:text-neon-pink group-hover:bg-neon-pink/10 transition-colors">
                {count}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
