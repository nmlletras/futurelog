import { motion } from 'motion/react';

export function StyleGuide() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-main tracking-tight mb-4">
          Style Guide & Publishing
        </h1>
        <p className="text-text-muted text-lg">
          Learn how to write and publish articles directly from GitHub using Markdown and MDX.
        </p>
      </header>

      <div className="prose prose-invert prose-lg max-w-none">
        <h2>How It Works</h2>
        <p>
          Futurelog operates seamlessly without a traditional CMS. All content is driven by standard <code>.md</code> and <code>.mdx</code> files securely stored in the repository's <code>/blog</code> directory. When you push to GitHub, the site automagically rebuilds and deploys in seconds.
        </p>

        <h2>The Frontmatter Format</h2>
        <p>
          Every article must start with a YAML frontmatter block. This block tells the engine about the post's metadata: title, publish date, category, and tags.
        </p>
        <pre><code className="language-yaml">{`---
title: "Your Awesome Article Title"
description: "A short summary of what this article covers."
date: "2026-06-15"
cover: "https://images.unsplash.com/photo-example"
tags:
  - React
  - Next.js
category: "Engineering"
featured: true
---

# Your Content Begins Here

Once the frontmatter is closed, you can begin writing in standard Markdown...`}</code></pre>

        <h2>Markdown Formatting</h2>
        <p>You can use all standard Markdown features seamlessly. Here are a few examples of how they render:</p>
        
        <h3>Text Emphasis</h3>
        <p>You can use <strong>bold text</strong>, <em>italic text</em>, and <code>inline code</code> drops anywhere.</p>

        <h3>Blockquotes</h3>
        <blockquote>
          "The best way to predict the future is to invent it."
        </blockquote>

        <h3>Lists</h3>
        <ul>
          <li>First bullet point in a list</li>
          <li>Second bullet point</li>
          <li>Third bullet point for ultimate scaling</li>
        </ul>

        <h2>Using Local Images & Assets</h2>
        <p>
          To include images within your body content, use the standard Markdown format: <code>![Alt text](/images/my-image.png)</code>. 
        </p>
        <p>
          For local assets, place your images inside the <code>/public/images/</code> directory in your repository. Everything in the <code>/public</code> folder is served at the root path, so you can reference them directly!
        </p>
      </div>
    </motion.div>
  );
}
