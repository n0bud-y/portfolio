export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);
