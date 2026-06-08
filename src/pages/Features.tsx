import { useEffect, useState } from 'react';
import { Post, getPosts } from '../lib/content';
import { PostCard } from '../components/PostCard';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const POSTS_PER_PAGE = 12;

export function Features() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const indexOfLastPost = currentPage * POSTS_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POSTS_PER_PAGE;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-12"
    >
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-main tracking-tight mb-4">
          All Articles
        </h1>
        <p className="text-text-muted text-lg">
          Explore our complete archive of thoughts and guides.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentPosts.map((post, i) => (
          <PostCard key={post.slug} post={post} index={i} layout="vertical" />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16 pb-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full border border-border-strong text-text-muted hover:text-text-main hover:bg-border-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {getPageNumbers().map((num, i) => (
            <button
              key={i}
              onClick={() => typeof num === 'number' ? handlePageChange(num) : undefined}
              disabled={num === '...'}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                num === currentPage
                  ? 'bg-text-main text-bg-base'
                  : num === '...'
                  ? 'text-text-muted cursor-default'
                  : 'text-text-muted hover:text-text-main hover:bg-border-subtle border border-transparent hover:border-border-strong'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full border border-border-strong text-text-muted hover:text-text-main hover:bg-border-subtle disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </motion.div>
  );
}
