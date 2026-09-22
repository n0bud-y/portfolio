import { cn } from '@/lib/utils';

/**
 * Editorial marquee: two identical groups, one CSS transform animation (no per-item JS),
 * pauses on hover, static under reduced motion. Server component.
 */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const group = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li
          key={item}
          className={cn(
            'flex items-center whitespace-nowrap font-display text-[clamp(1.75rem,4.2vw,3.5rem)] font-semibold uppercase leading-none tracking-[-0.03em]',
            i % 2 ? 'text-outline-strong' : 'text-fg',
          )}
        >
          {item}
          <span aria-hidden className="mx-5 font-normal text-muted md:mx-9">
            //
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee" role="region" aria-label={label}>
      <div className="marquee-track">
        {group(false)}
        {group(true)}
      </div>
    </div>
  );
}
