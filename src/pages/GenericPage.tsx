export function GenericPage({ title }: { title: string }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-6">
      <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-text-main to-text-muted tracking-tight">
        {title}
      </h1>
      <p className="text-text-muted text-lg leading-relaxed">
        This is a placeholder page for {title}. Content will be added here soon as part of the future development updates.
      </p>
    </div>
  );
}
