import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

export default function CodeBlock({ children, language, className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative group my-6">
      {/* Language label */}
      {language && (
        <div className="absolute top-3 left-4 text-xs text-muted-foreground/70 
                        bg-background/50 px-2 py-1 rounded uppercase tracking-wider">
          {language}
        </div>
      )}

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg
                   bg-background/50 hover:bg-background
                   border border-border/50 hover:border-primary/50
                   transition-all duration-200
                   opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground hover:text-foreground" />
        )}
      </button>

      {/* Code block */}
      <pre className={`${className} !mt-0`}>
        <code>{children}</code>
      </pre>
    </div>
  );
}
