import { Copy, Check } from 'lucide-react';
import { useEffect } from 'react';

// Language detection mapping
const languageMap: Record<string, string> = {
  js: 'JavaScript',
  jsx: 'React',
  ts: 'TypeScript',
  tsx: 'React TypeScript',
  python: 'Python',
  py: 'Python',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  cs: 'C#',
  php: 'PHP',
  rb: 'Ruby',
  go: 'Go',
  rust: 'Rust',
  rs: 'Rust',
  swift: 'Swift',
  kotlin: 'Kotlin',
  sql: 'SQL',
  bash: 'Bash',
  sh: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  xml: 'XML',
  html: 'HTML',
  css: 'CSS',
  scss: 'SCSS',
  sass: 'Sass',
  markdown: 'Markdown',
  md: 'Markdown',
};

function detectLanguage(pre: Element): string {
  // Check for class attributes like "language-javascript"
  const codeElement = pre.querySelector('code');
  if (codeElement) {
    const classList = Array.from(codeElement.classList);
    for (const className of classList) {
      if (className.startsWith('language-')) {
        const lang = className.replace('language-', '');
        return languageMap[lang] || lang.toUpperCase();
      }
    }
  }

  // Check pre element classes
  const preClasses = Array.from(pre.classList);
  for (const className of preClasses) {
    if (className.startsWith('language-')) {
      const lang = className.replace('language-', '');
      return languageMap[lang] || lang.toUpperCase();
    }
  }

  // Try to detect from code content (basic heuristics)
  const code = codeElement?.textContent || '';
  if (code.includes('function') && code.includes('{')) return 'JavaScript';
  if (code.includes('def ') && code.includes(':')) return 'Python';
  if (code.includes('<?php')) return 'PHP';
  if (code.includes('import React')) return 'React';

  return 'Code';
}

export default function CodeCopyButtons() {
  useEffect(() => {
    // Find all pre elements in the prose content
    const preElements = document.querySelectorAll('.prose pre');

    preElements.forEach((pre) => {
      // Skip if already wrapped
      if (pre.parentElement?.classList.contains('code-block-wrapper')) return;

      // Detect language
      const language = detectLanguage(pre);

      // Create wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper border border-border rounded-xl overflow-hidden shadow-sm my-6';

      // Create header
      const header = document.createElement('div');
      header.className = 'code-header flex items-center justify-between px-4 py-2.5 bg-muted/30 border-b border-border';

      // Language label
      const languageLabel = document.createElement('div');
      languageLabel.className = 'text-xs font-semibold text-muted-foreground uppercase tracking-wide';
      languageLabel.textContent = language;

      // Copy button
      const button = document.createElement('button');
      button.className = `copy-button flex items-center gap-1.5 px-2.5 py-1 rounded-md
                          text-xs font-medium text-muted-foreground
                          hover:bg-muted/50 hover:text-foreground
                          transition-colors duration-200`;
      button.setAttribute('aria-label', 'Copy code');

      // Button content
      button.innerHTML = `
        <svg class="copy-icon w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <span class="copy-text">Copy</span>
        <svg class="check-icon hidden w-3.5 h-3.5 text-green-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;

      // Add click handler
      button.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        if (!code) return;

        try {
          await navigator.clipboard.writeText(code.textContent || '');
          
          // Show check icon
          const copyIcon = button.querySelector('.copy-icon') as HTMLElement;
          const copyText = button.querySelector('.copy-text') as HTMLElement;
          const checkIcon = button.querySelector('.check-icon') as HTMLElement;
          
          if (copyIcon && checkIcon && copyText) {
            copyIcon.classList.add('hidden');
            copyText.textContent = 'Copied';
            checkIcon.classList.remove('hidden');
            
            setTimeout(() => {
              copyIcon.classList.remove('hidden');
              copyText.textContent = 'Copy';
              checkIcon.classList.add('hidden');
            }, 2000);
          }
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });

      // Assemble header
      header.appendChild(languageLabel);
      header.appendChild(button);

      // Wrap the pre element
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      // Remove margin from pre (wrapper has it now)
      pre.classList.add('!my-0', '!rounded-none', '!border-0', '!shadow-none');
    });

    // Cleanup function
    return () => {
      document.querySelectorAll('.code-block-wrapper').forEach(wrapper => {
        const pre = wrapper.querySelector('pre');
        if (pre) {
          wrapper.parentNode?.insertBefore(pre, wrapper);
          pre.classList.remove('!my-0', '!rounded-none', '!border-0', '!shadow-none');
        }
        wrapper.remove();
      });
    };
  }, []);

  return null;
}
