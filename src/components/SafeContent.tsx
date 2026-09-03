import React from 'react';

interface SafeContentProps {
  content: string;
  className?: string;
}

export const SafeContent: React.FC<SafeContentProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const renderBlocks = () => {
    return content.split('\n\n').map((block, index) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      // Header 3
      if (trimmed.startsWith('### ')) {
        return (
          <h3 
            key={index} 
            className="font-sans font-bold text-2xl text-on-background dark:text-zinc-100 mt-8 mb-4 tracking-tight"
          >
            {trimmed.slice(4)}
          </h3>
        );
      }

      // Header 2
      if (trimmed.startsWith('## ')) {
        return (
          <h2 
            key={index} 
            className="font-sans font-bold text-3xl text-on-background dark:text-zinc-100 mt-10 mb-5 tracking-tight border-b border-outline-variant/30 dark:border-zinc-800/40 pb-2"
          >
            {trimmed.slice(3)}
          </h2>
        );
      }

      // Blockquote
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote 
            key={index} 
            className="border-l-4 border-primary pl-5 py-2 my-6 font-serif italic text-lg text-on-surface-variant dark:text-zinc-300 bg-surface-container/20 dark:bg-zinc-900/30 rounded-r-lg"
          >
            {trimmed.slice(2)}
          </blockquote>
        );
      }

      // Unordered List
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').map(item => item.replace(/^[-*]\s+/, '').trim()).filter(Boolean);
        return (
          <ul key={index} className="list-disc pl-6 space-y-2.5 my-5 font-serif text-lg leading-relaxed text-on-surface-variant dark:text-zinc-300">
            {items.map((item, idx) => (
              <li key={idx}>
                {item}
              </li>
            ))}
          </ul>
        );
      }

      // Ordered List
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split('\n').map(item => item.replace(/^\d+\.\s+/, '').trim()).filter(Boolean);
        return (
          <ol key={index} className="list-decimal pl-6 space-y-2.5 my-5 font-serif text-lg leading-relaxed text-on-surface-variant dark:text-zinc-300">
            {items.map((item, idx) => (
              <li key={idx}>
                {item}
              </li>
            ))}
          </ol>
        );
      }

      // Regular Paragraph
      return (
        <p 
          key={index} 
          className="font-serif text-lg md:text-xl text-on-surface-variant dark:text-zinc-300 leading-relaxed mb-6"
        >
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      {renderBlocks()}
    </div>
  );
};
