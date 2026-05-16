/**
 * Utility to parse responsive attributes into Tailwind classes.
 * Supports both scalar values and responsive objects.
 */

export interface ResponsiveValue<T> {
  desktop?: T;
  tablet?: T;
  mobile?: T;
}

export type ResponsiveProp<T> = T | ResponsiveValue<T>;

/**
 * Normalizes a responsive prop into a ResponsiveValue object.
 */
export function normalizeResponsive<T>(prop: ResponsiveProp<T>, defaultValue: T): ResponsiveValue<T> {
  if (prop === null || prop === undefined) {
    return { desktop: defaultValue };
  }
  if (typeof prop !== 'object') {
    return { desktop: prop };
  }
  return prop as ResponsiveValue<T>;
}

/**
 * Generates responsive grid column classes.
 */
export function getResponsiveGridCols(gridCols: ResponsiveProp<number>): string {
  const normalized = normalizeResponsive(gridCols, 1);
  const classes = [];

  if (normalized.mobile !== undefined) classes.push(`grid-cols-${normalized.mobile}`);
  else if (normalized.desktop !== undefined) classes.push(`grid-cols-${normalized.desktop}`);

  if (normalized.tablet !== undefined) classes.push(`md:grid-cols-${normalized.tablet}`);
  if (normalized.desktop !== undefined) classes.push(`lg:grid-cols-${normalized.desktop}`);

  return classes.join(' ');
}

/**
 * Generates responsive spacing classes (padding/margin).
 */
export function getResponsiveSpacing(prop: ResponsiveProp<string>, prefix: string): string {
  const normalized = normalizeResponsive(prop, '');
  const classes = [];

  if (normalized.mobile) classes.push(`${prefix}-${normalized.mobile}`);
  else if (normalized.desktop) classes.push(`${prefix}-${normalized.desktop}`);

  if (normalized.tablet) classes.push(`md:${prefix}-${normalized.tablet}`);
  if (normalized.desktop) classes.push(`lg:${prefix}-${normalized.desktop}`);

  return classes.join(' ');
}
