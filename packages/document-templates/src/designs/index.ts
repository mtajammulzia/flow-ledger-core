import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import type { DocumentTemplateData } from '../types';
import { designRegistry } from './registry';

export { DesignA } from './DesignA';
export { DesignB } from './DesignB';
export { DesignC } from './DesignC';
export { DesignD } from './DesignD';
export { DesignE } from './DesignE';
export { DesignF } from './DesignF';
export type { DesignEntry, DesignKey } from './registry';
export { designRegistry } from './registry';

/** All registered design keys in order. */
export const DESIGNS = designRegistry.map((e) => e.key);

/** Map of design key → human-readable label. */
export const DESIGN_LABELS = Object.fromEntries(designRegistry.map(({ key, label }) => [key, label])) as Record<string, string>;

const RESET_CSS = '*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{background:#fff}';

/**
 * Renders a design to a complete, self-contained HTML string suitable for
 * Puppeteer PDF generation. Styled-components styles are collected via
 * ServerStyleSheet and injected into <head>.
 */
export function renderDesign(key: string, data: DocumentTemplateData): string {
  const entry = designRegistry.find((e) => e.key === key);
  if (!entry) throw new Error(`Unknown design key: "${key}". Available: ${DESIGNS.join(', ')}`);

  const sheet = new ServerStyleSheet();
  try {
    const bodyHtml = renderToStaticMarkup(sheet.collectStyles(React.createElement(entry.component, data)));
    const styleTags = sheet.getStyleTags();
    return [
      '<!DOCTYPE html>',
      '<html lang="en">',
      `<head><meta charset="UTF-8"><style>${RESET_CSS}</style>${styleTags}</head>`,
      `<body>${bodyHtml}</body>`,
      '</html>',
    ].join('');
  } finally {
    sheet.seal();
  }
}
