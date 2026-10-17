/**
 * Lightweight className utility — merges class strings,
 * filters falsy values. Drop-in replacement for clsx.
 * Used across all React apps in the monorepo.
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
