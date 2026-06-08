import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Post } from '../lib/content';
import { Calendar, Clock, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { getCoverUrl } from '../lib/youtube';

export function PostCard({ post, featured = false, index = 0, layout = 'horizontal' }: { post: Post; featured?: boolean, index?: number, layout?: 'horizontal' | 'vertical' }) {
  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link to={`/post/${post.slug}`} className="group block h-full">
          <article className="bg-bg-card rounded-3xl overflow-hidden border border-border-strong hover:border-border-subtle transition-colors h-full flex flex-col hover:bg-bg-card-hover group-hover:shadow-[0_0_40px_rgba(240,46,101,0.05)]">
            <div className="flex flex-col lg:flex-row h-full">
              <div className="p-8 lg:w-1/2 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-pink"></span>
                  <span className="text-xs font-semibold tracking-wider text-text-muted uppercase">{post.meta.category || 'General'}</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main group-hover:text-neon-pink group-hover:neon-text-glow transition-all">
                  {post.meta.title}
                </h2>
                <p className="text-text-muted leading-relaxed text-sm lg:text-base line-clamp-3">
                  {post.meta.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-text-muted opacity-80 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={post.meta.date}>{format(new Date(post.meta.date), 'MMM d, yyyy')}</time>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 overflow-hidden bg-[#111] m-2 rounded-2xl relative">
                {post.meta.cover ? (
                  <img src={getCoverUrl(post.meta.cover)} alt={post.meta.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-pink/20 group-hover:scale-105 transition-transform duration-700 ease-out" />
                )}
                <div className="absolute inset-0 ring-1 ring-inset ring-border-strong rounded-2xl pointer-events-none" />
              </div>
            </div>
          </article>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/post/${post.slug}`} className="group block h-full">
        <article className={`bg-bg-card rounded-2xl p-4 md:p-6 flex ${layout === 'vertical' ? 'flex-col gap-4' : 'flex-col sm:flex-row gap-6 lg:gap-8'} border border-border-strong hover:border-neon-pink/30 transition-all duration-300 h-full hover:bg-bg-card-hover shadow-sm hover:shadow-lg relative overflow-hidden`}>
          <div className={`${layout === 'vertical' ? 'w-full aspect-video' : 'w-full sm:w-[240px] md:w-[280px] aspect-[16/10] sm:aspect-square md:aspect-[4/3]'} overflow-hidden rounded-xl bg-border-strong border border-border-strong relative shrink-0`}>
            {post.meta.cover ? (
              <img src={getCoverUrl(post.meta.cover)} alt={post.meta.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-neon-blue/20 to-neon-pink/20 group-hover:scale-105 transition-transform duration-500 ease-out" />
            )}
             <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-xl" />
          </div>
          <div className="flex flex-col justify-center flex-grow py-2">
             <div className="flex items-center gap-2 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-neon-pink"></span>
                <span className="text-[10px] font-semibold tracking-wider text-text-muted uppercase px-2 py-1 flex items-center bg-transparent group-hover:text-text-main transition-colors">{post.meta.category || 'General'}</span>
              </div>
            <h3 className={`${layout === 'vertical' ? 'text-xl' : 'text-2xl'} font-bold tracking-tight text-text-main mb-2 group-hover:text-neon-pink transition-colors line-clamp-2 leading-snug`}>
              {post.meta.title}
            </h3>
            <p className={`text-text-muted ${layout === 'vertical' ? 'text-sm mb-4 line-clamp-2' : 'text-base mb-6 line-clamp-3'} leading-relaxed`}>
              {post.meta.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-text-muted mt-auto pt-4 border-t border-border-strong/50">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.meta.date}>{format(new Date(post.meta.date), 'MMM d, yyyy')}</time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readingTime} min read</span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
