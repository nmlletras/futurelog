import { parse } from 'yaml';

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  cover?: string;
  tags?: string[];
  category?: string;
  featured?: boolean;
}

export interface Post {
  slug: string;
  meta: PostMeta;
  content: string;
  readingTime: number;
}

// Helper to estimate reading time
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export async function getPosts(): Promise<Post[]> {
  const postFiles = (import.meta as any).glob('/blog/*.{md,mdx}', { query: '?raw', import: 'default' });
  const posts: Post[] = [];

  for (const path in postFiles) {
    const rawContent = await postFiles[path]() as string;
    
    // Extract frontmatter using a regex
    const yamlRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = rawContent.match(yamlRegex);
    
    let meta: PostMeta = {
      title: 'Untitled',
      description: '',
      date: new Date().toISOString()
    };
    let content = rawContent;

    if (match) {
      const frontmatterStr = match[1];
      content = match[2];
      try {
        const parsedMeta = parse(frontmatterStr);
        meta = { ...meta, ...parsedMeta };
      } catch (e) {
        console.error(`Failed to parse frontmatter for ${path}`, e);
      }
    }

    const slug = path.split('/').pop()?.replace(/\.mdx?$/, '') || 'unknown';
    
    posts.push({
      slug,
      meta,
      content,
      readingTime: calculateReadingTime(content)
    });
  }

  // Sort by date descending
  return posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await getPosts();
  return posts.find((p) => p.slug === slug);
}
