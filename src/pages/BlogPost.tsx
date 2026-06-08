import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post, getPostBySlug, getPosts } from '../lib/content';
import { motion, useScroll, useSpring } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Calendar, Clock, ArrowLeft, Check, Copy, Share2, Info, CheckCircle2, AlertTriangle, XCircle, Lightbulb, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import React from 'react';
import { getYouTubeId, getCoverUrl } from '../lib/youtube';
import { PostCard } from '../components/PostCard';

const CodeBlock = ({ inline, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  const [copied, setCopied] = useState(false);
  const language = match ? match[1] : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(String(children).replace(/\n$/, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!inline && match) {
    return (
      <div className="relative rounded-xl border border-border-strong my-6 overflow-hidden bg-[#0d0d0d]">
        <div className="flex items-center justify-between px-4 py-2 border-b border-border-strong bg-[#1a1a1a]">
          <span className="text-xs font-mono text-text-muted uppercase tracking-wider">{language}</span>
          <button 
            onClick={handleCopy} 
            className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-white transition-colors p-1"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? <span className="text-green-400">Copied</span> : <span>Copy</span>}
          </button>
        </div>
        <SyntaxHighlighter
          {...props}
          style={vscDarkPlus}
          language={language}
          PreTag="div"
          customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    );
  }
  return <code className={className} {...props}>{children}</code>;
};

const CustomBlockquote = ({ children, ...props }: any) => {
  let type: string | null = null;
  let firstStringFound = false;

  const processChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (typeof child === 'string') {
        if (!firstStringFound) {
          const match = child.match(/^\n?\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|DANGER|SUCCESS|QUESTION)\]\s*\n?/i);
          if (match) {
            type = match[1].toLowerCase();
            firstStringFound = true;
            return child.replace(/^\n?\s*\[!.*?\]\s*\n?/i, '');
          }
        }
        return child;
      }
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<any>;
        return React.cloneElement(element, {
          ...element.props,
          children: processChildren(element.props.children)
        });
      }
      return child;
    });
  };

  const processedChildren = processChildren(children);

  if (type) {
    const config: Record<string, any> = {
      note: { icon: Info, bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', title: 'Note' },
      tip: { icon: Lightbulb, bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', title: 'Tip' },
      important: { icon: AlertTriangle, bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', title: 'Important' },
      warning: { icon: AlertTriangle, bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', title: 'Warning' },
      caution: { icon: AlertTriangle, bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', title: 'Caution' },
      danger: { icon: XCircle, bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', title: 'Danger' },
      success: { icon: CheckCircle2, bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', title: 'Success' },
      question: { icon: HelpCircle, bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', title: 'Question' },
    };
    
    const styleObj = config[type] || config.note;
    const Icon = styleObj.icon;

    return (
      <div className={`my-8 px-5 py-5 rounded-2xl border ${styleObj.bg} ${styleObj.border}`}>
        <div className={`flex items-center gap-2 mb-3.5 font-bold ${styleObj.text} uppercase tracking-wider text-xs`}>
          <Icon className="w-4 h-4" />
          <span>{styleObj.title}</span>
        </div>
        <div className="text-text-main text-base leading-relaxed opacity-90 [&>p:last-child]:mb-0 [&>p:first-child]:mt-0 [&>p]:mb-4">
          {processedChildren}
        </div>
      </div>
    );
  }

  return (
    <blockquote className="border-l-4 border-neon-pink/50 pl-6 py-2 italic bg-bg-card/50 my-8 rounded-r-xl" {...props}>
      {children}
    </blockquote>
  );
};


export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      Promise.all([getPostBySlug(slug), getPosts()]).then(([data, allPosts]) => {
        setPost(data || null);
        
        if (data) {
          const related = allPosts
            .filter(p => p.slug !== slug && p.meta.tags?.some(tag => data.meta.tags?.includes(tag)))
            .slice(0, 3);
          setRelatedPosts(related);
        }
        
        setLoading(false);
      });
    }
  }, [slug]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.meta.title,
          text: post?.meta.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) return null;

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl text-text-main font-bold mb-4">Post not found</h1>
        <Link to="/" className="text-neon-pink hover:underline">Return home</Link>
      </div>
    );
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-neon-blue to-neon-pink z-[9999] origin-left"
        style={{ scaleX }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <article className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to articles
        </Link>
      
      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
           <span className="px-3 py-1 rounded-full bg-border-subtle border border-border-strong text-xs text-neon-blue font-mono uppercase tracking-wider">{post.meta.category || 'General'}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-main tracking-tight mb-8 leading-tight">
          {post.meta.title}
        </h1>
        
        <div className="flex items-center justify-center gap-4 md:gap-6 text-sm text-text-muted flex-wrap">
          <div className="flex items-center gap-2">
             <img src="https://github.com/nmlletras.png" alt="NML LETRAS" className="w-8 h-8 rounded-full border border-border-strong object-cover" />
             <span className="font-medium text-text-main">NML LETRAS</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-border-strong hidden md:block" />
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.meta.date}>{format(new Date(post.meta.date), 'MMMM d, yyyy')}</time>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-border-strong" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </header>

      {post.meta.cover && (
        <div className="w-full aspect-[16/9] mb-12 rounded-3xl overflow-hidden bg-[#111] relative border border-border-strong">
          {getYouTubeId(post.meta.cover) ? (
            <iframe 
               src={`https://www.youtube.com/embed/${getYouTubeId(post.meta.cover)}`} 
               title={post.meta.title} 
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen 
               className="w-full h-full"
            ></iframe>
          ) : (
             <img src={getCoverUrl(post.meta.cover)} alt={post.meta.title} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base to-transparent opacity-50 pointer-events-none" />
        </div>
      )}

      <div className="prose prose-invert prose-lg md:prose-xl max-w-none">
        <ReactMarkdown 
           remarkPlugins={[remarkGfm]}
           rehypePlugins={[rehypeRaw]}
           components={{
            img: ({node, ...props}: any) => <img {...props} className="w-full rounded-2xl border border-border-strong my-8 shadow-xl" loading="lazy" />,
            code: CodeBlock,
            blockquote: CustomBlockquote
          }}
        >
          {post.content
            .replace(/<(Note|Tip|Important|Warning|Caution|Danger|Success|Question)>\s*([\s\S]*?)\s*<\/\1>/gi, (match, type, content) => {
              return `> [!${type.toUpperCase()}]\n${content.split('\n').map((line: string) => `> ${line}`).join('\n')}`;
            })
            .replace(/<YouTube\s+id=["']([^"']+)["']\s*\/?>(?:<\/YouTube>)?/gi, (match, id) => {
              return `<iframe src="https://www.youtube.com/embed/${id}" title="YouTube Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full aspect-video rounded-3xl border border-border-strong my-10 shadow-2xl"></iframe>`;
            })}
        </ReactMarkdown>
      </div>
      
      <div className="mt-16 pt-8 border-t border-border-strong">
         <div className="flex flex-wrap gap-2">
           <span className="text-sm text-text-muted mr-2 flex items-center">Tagged in:</span>
           {post.meta.tags?.map(tag => (
              <span key={tag} className="text-xs text-text-muted font-medium px-2 py-1 bg-border-subtle rounded border border-border-strong hover:bg-border-strong transition-colors cursor-pointer">#{tag}</span>
           ))}
         </div>
      </div>
      
      {relatedPosts.length > 0 && (
        <div className="mt-20">
          <h3 className="text-2xl font-bold tracking-tight text-text-main mb-8 border-b border-border-strong pb-4">
            Related Posts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost, i) => (
              <PostCard key={relatedPost.slug} post={relatedPost} index={i} layout="vertical" />
            ))}
          </div>
        </div>
      )}
      
      <motion.button
        onClick={handleShare}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 p-4 bg-neon-pink text-white rounded-full shadow-[0_0_25px_rgba(240,46,101,0.5)] z-50 transition-colors hover:bg-white hover:text-neon-pink"
        title="Share article"
      >
        <Share2 className="w-5 h-5" />
      </motion.button>
    </article>
    </motion.div>
    </>
  );
}
