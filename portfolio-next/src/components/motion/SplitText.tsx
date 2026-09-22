import { Fragment } from 'react';
import { cn } from '@/lib/utils';

/**
 * Lightweight line splitter (server-safe, no DOM mutation).
 *  - "\n" starts a new line; each line is clipped by `.line-mask` and moved by `.line-inner`
 *  - wrap a word in *asterisks* to colour it with the mint accent
 *  - `lineClassName[i]` styles an individual line (e.g. an editorial indent)
 */
export function SplitText({ text, lineClassName }: { text: string; lineClassName?: string[] }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <span key={i} className="line-mask block">
          <span className={cn('line-inner', lineClassName?.[i])}>
            {line.split(' ').map((raw, wi, arr) => {
              const accent = raw.length > 2 && raw.startsWith('*') && raw.endsWith('*');
              return (
                <Fragment key={wi}>
                  {accent ? <span className="text-mint">{raw.slice(1, -1)}</span> : raw}
                  {wi < arr.length - 1 && ' '}
                </Fragment>
              );
            })}
          </span>
        </span>
      ))}
    </>
  );
}
