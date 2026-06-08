import { motion } from 'motion/react';
import { Github, Twitter, MessageSquare, Mail, Terminal, Coffee, Code2, Rocket, Sparkles, Palette, Zap, Globe } from 'lucide-react';

export function Authors() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-12"
    >
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text-main to-text-muted tracking-tight mb-4">
          Meet the Author
        </h1>
        <p className="text-text-muted text-lg">
          The mind behind the code and design.
        </p>
      </header>

      <div className="bg-bg-card border border-border-strong rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
        {/* Decorative blur */}
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-neon-blue/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-neon-pink/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
          <div className="shrink-0 mx-auto md:mx-0">
             <div className="w-40 h-40 rounded-full bg-border-subtle border-2 border-border-strong overflow-hidden relative shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center justify-center">
                 <img src="https://github.com/nmlletras.png" alt="NML LETRAS" className="w-full h-full object-cover relative z-10" />
                 <div className="absolute inset-0 bg-gradient-to-tr from-neon-blue/20 to-neon-pink/20 mix-blend-overlay z-20 pointer-events-none" />
             </div>
          </div>
          
          <div className="text-center md:text-left space-y-6 flex-grow">
            <div>
              <h2 className="text-4xl font-black text-text-main mb-2 tracking-tight">NML LETRAS</h2>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                 <span className="px-3 py-1 bg-border-subtle border border-border-strong rounded-full text-xs font-mono text-neon-blue uppercase tracking-wider">Developer</span>
                 <span className="px-3 py-1 bg-border-subtle border border-border-strong rounded-full text-xs font-mono text-neon-pink uppercase tracking-wider">Writer</span>
                 <span className="px-3 py-1 bg-border-subtle border border-border-strong rounded-full text-xs font-mono text-text-muted hover:text-white transition-colors uppercase tracking-wider">Builder</span>
              </div>
            </div>

            <p className="text-text-muted text-lg leading-relaxed">
              I build web and mobile applications for Android and iOS, specialize in debugging and fixing complex systems, and develop comprehensive software solutions. I am highly passionate about crafting premium, lightning-fast interfaces and robust backend architectures.
            </p>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-border-strong">
               <div className="flex items-center gap-3">
                 <Code2 className="w-5 h-5 text-neon-blue" />
                 <span className="text-sm font-medium text-text-main">Web & Mobile</span>
               </div>
               <div className="flex items-center gap-3">
                 <Rocket className="w-5 h-5 text-neon-pink" />
                 <span className="text-sm font-medium text-text-main">High Performance</span>
               </div>
               <div className="flex items-center gap-3">
                 <Terminal className="w-5 h-5 text-gray-400" />
                 <span className="text-sm font-medium text-text-main">Bug Hunter</span>
               </div>
               <div className="flex items-center gap-3">
                 <Coffee className="w-5 h-5 text-orange-400" />
                 <span className="text-sm font-medium text-text-main">Constant Builder</span>
               </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <a href="https://github.com/nmlletras" target="_blank" rel="noopener noreferrer" className="p-3 bg-border-subtle border border-border-strong rounded-xl text-text-main hover:bg-white hover:text-black hover:border-white transition-all shadow-sm group">
                <Github className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-3 bg-border-subtle border border-border-strong rounded-xl text-text-main hover:bg-white hover:text-black hover:border-white transition-all shadow-sm group">
                <Twitter className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://discord.gg/u9XfHZN8K9" target="_blank" rel="noopener noreferrer" className="p-3 bg-border-subtle border border-border-strong rounded-xl text-text-main hover:bg-[#5865F2] hover:text-white hover:border-[#5865F2] transition-all shadow-sm group">
                <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
              <a href="mailto:#" className="p-3 bg-border-subtle border border-border-strong rounded-xl text-text-main hover:bg-neon-pink hover:text-white hover:border-neon-pink transition-all shadow-sm group">
                <Mail className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
