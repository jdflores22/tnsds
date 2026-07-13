import { cn } from '@/utils/cn';

/** Prose styles that preserve intentional blank lines / empty paragraphs in rich HTML. */
export const richTextContentClass = cn(
  'prose prose-slate max-w-none prose-headings:text-primary-900 prose-p:text-slate-700',
  '[&_p:empty]:min-h-[1.25em] [&_p:empty]:before:inline-block [&_p:empty]:before:content-["\u00a0"]',
  '[&_p:has(>br:only-child)]:min-h-[1.25em]',
);

export const richTextEditorClass = cn(
  'prose prose-sm max-w-none min-h-[12rem] px-4 py-3 focus:outline-none prose-headings:text-primary-900 prose-p:text-slate-700',
  '[&_p:empty]:min-h-[1.25em] [&_p:empty]:before:inline-block [&_p:empty]:before:content-["\u00a0"]',
  '[&_p:has(>br:only-child)]:min-h-[1.25em]',
);
