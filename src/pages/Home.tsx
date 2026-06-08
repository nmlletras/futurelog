import { useEffect, useState, useMemo } from 'react';
import { Post, getPosts } from '../lib/content';
import { PostCard } from '../components/PostCard';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Clock, ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { getCoverUrl } from '../lib/youtube';

const TAG_COLORS = [
  'bg-neon-pink', 'bg-neon-blue', 'bg-green-400', 
  'bg-purple-400', 'bg-yellow-400', 'bg-orange-400'
];

export function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [[page, direction], setPage] = useState([0, 0]);

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  const topTags = useMemo(() => {
    const tagCounts = posts.flatMap(p => p.meta.tags || []).reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(entry => entry[0]);
  }, [posts]);

  if (loading) return null;

  const featuredPosts = posts.filter(p => p.meta.featured);
  const sliderPosts = featuredPosts.length > 0 ? featuredPosts : posts.slice(0, 3);
  const regularPosts = posts.filter(p => !sliderPosts.includes(p));

  const imageIndex = Math.abs(page % sliderPosts.length);
  const activePost = sliderPosts.length > 0 ? sliderPosts[imageIndex] : null;

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  const getTagColor = (index: number) => TAG_COLORS[index % TAG_COLORS.length];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-20 overflow-hidden pt-8"
    >
      {/* Hero / Slider Section */}
      {activePost && (
        <section className="mb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction < 0 ? 50 : -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col lg:flex-row gap-12 items-center"
            >
              <div className="lg:w-5/12 flex flex-col justify-center gap-6 md:pl-4">
                <Link to={`/post/${activePost.slug}`} className="group block">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-neon-pink"></span>
                    <span className="text-xs font-semibold tracking-wider text-text-muted uppercase px-3 py-1 bg-border-subtle rounded-full border border-border-strong">
                      {activePost.meta.category || 'General'}
                    </span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-text-main group-hover:text-neon-pink transition-all leading-[1.15] mb-6">
                    {activePost.meta.title}
                  </h2>
                  <p className="text-text-muted leading-relaxed text-lg line-clamp-3 mb-6">
                    {activePost.meta.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-text-muted opacity-80">
                    <div className="flex items-center gap-2">
                       <Calendar className="w-4 h-4" />
                       <time dateTime={activePost.meta.date}>{format(new Date(activePost.meta.date), 'MMM d, yyyy')}</time>
                    </div>
                    <div className="flex items-center gap-2">
                       <Clock className="w-4 h-4" />
                       <span>{activePost.readingTime} min read</span>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="lg:w-7/12 relative w-full">
                <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl bg-border-strong border border-border-strong group shadow-lg">
                  {activePost.meta.cover ? (
                    <img src={activePost.meta.cover} alt={activePost.meta.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-pink/20 group-hover:scale-105 transition-transform duration-700 ease-out" />
                  )}
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-2xl" />
                </div>
                
                {/* Controls */}
                {sliderPosts.length > 1 && (
                  <div className="flex justify-end gap-3 mt-4 mr-2">
                    <button 
                      onClick={() => paginate(-1)}
                      className="text-text-muted hover:text-white transition-colors"
                      aria-label="Previous"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => paginate(1)}
                      className="text-text-muted hover:text-white transition-colors"
                      aria-label="Next"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      )}

      {/* Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {regularPosts.map((post, i) => (
             <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
        
        {/* Sidebar */}
        <aside className="lg:col-span-1">
           <div className="bg-bg-card rounded-2xl p-6 border border-border-strong shadow-lg space-y-12 sticky top-32">
             {/* Featured Posts */}
             <div className="space-y-6">
                <h3 className="text-lg text-text-main font-bold">
                   Featured posts
                </h3>
                <div className="space-y-6">
                   {sliderPosts.slice(0, 3).map(post => (
                     <Link key={post.slug} to={`/post/${post.slug}`} className="flex gap-4 group">
                        <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl bg-border-strong overflow-hidden shrink-0 border border-border-strong relative">
                           {post.meta.cover && <img src={getCoverUrl(post.meta.cover)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="text-[13px] text-text-main font-semibold group-hover:text-neon-pink transition-colors line-clamp-2 leading-tight mb-2">{post.meta.title}</h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{post.readingTime} min read</span>
                          </div>
                        </div>
                     </Link>
                   ))}
                </div>
             </div>

             {/* Tags */}
             <div className="space-y-6">
                <h3 className="text-lg text-text-main font-bold">Tags</h3>
                <div className="flex flex-wrap gap-2.5">
                   {topTags.map((tag, idx) => (
                     <Link key={tag} to={`/tags`} className="px-3 py-1.5 bg-bg-base hover:bg-border-subtle border border-border-strong rounded-full text-xs text-text-muted hover:text-text-main font-medium transition-colors flex items-center gap-2">
                       <span className={`w-1.5 h-1.5 rounded-full ${getTagColor(idx)}`}></span>
                       {tag}
                     </Link>
                   ))}
                </div>
             </div>

             {/* Latest posts */}
             <div className="space-y-6">
                <h3 className="text-lg text-text-main font-bold">
                   Latest posts
                </h3>
                <div className="space-y-6">
                   {regularPosts.slice(0, 3).map(post => (
                     <Link key={post.slug} to={`/post/${post.slug}`} className="flex gap-4 group">
                        <div className="w-20 h-14 sm:w-24 sm:h-16 rounded-xl bg-border-strong overflow-hidden shrink-0 border border-border-strong relative">
                           {post.meta.cover && <img src={getCoverUrl(post.meta.cover)} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                        </div>
                        <div className="flex flex-col justify-center">
                          <h4 className="text-[13px] text-text-main font-semibold group-hover:text-neon-pink transition-colors line-clamp-2 leading-tight mb-2">{post.meta.title}</h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{post.readingTime} min read</span>
                          </div>
                        </div>
                     </Link>
                   ))}
                </div>
             </div>
           </div>
        </aside>
      </div>
    </motion.div>
  );
}
