'use client';

import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { exploring } from '@/data/content';

/**
 * The one easter egg: press the backtick key ( ` ) to open a tiny developer console.
 * Try: help · whoami · stack · focus · contact · clear · exit
 */
const commands: Record<string, () => string[]> = {
  help: () => ['commands: whoami, stack, focus, contact, clear, exit'],
  whoami: () => [siteConfig.name, siteConfig.role, siteConfig.location],
  stack: () => ['WordPress · PHP · JavaScript · React · Next.js · GSAP'],
  focus: () => ['currently exploring:', ...exploring.map((e) => `  → ${e}`)],
  contact: () => [siteConfig.email || 'email: (not set yet)', siteConfig.linkedin],
};

export function DevConsole() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<string[]>(['> type "help" to begin']);
  const [value, setValue] = useState('');
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement | null)?.closest('input, textarea, [contenteditable]');
      if (e.key === '`' && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);

  if (!open) return null;

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (cmd === 'clear') return setLines([]);
    if (cmd === 'exit') return setOpen(false);
    const out = commands[cmd]?.() ?? [`command not found: ${cmd}`];
    setLines((l) => [...l, `$ ${raw}`, ...out]);
  };

  return (
    <div
      role="dialog"
      aria-label="Developer console"
      className="fixed bottom-4 right-4 z-[120] w-[min(92vw,26rem)] border border-white/15 bg-surface/95 font-mono text-xs text-fg2 shadow-2xl backdrop-blur"
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="micro">console</span>
        <button onClick={() => setOpen(false)} className="micro hover:text-fg" aria-label="Close console">
          esc
        </button>
      </div>
      <div className="max-h-60 space-y-1 overflow-y-auto p-3" aria-live="polite">
        {lines.map((l, i) => (
          <p key={i} className="whitespace-pre-wrap">
            {l}
          </p>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(value);
          setValue('');
        }}
        className="flex items-center gap-2 border-t border-line px-3 py-2"
      >
        <span className="text-mint">$</span>
        <input
          ref={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Console command"
          spellCheck={false}
          autoComplete="off"
          className="w-full bg-transparent text-fg outline-none"
        />
      </form>
    </div>
  );
}
