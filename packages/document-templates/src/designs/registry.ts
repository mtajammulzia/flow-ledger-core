import React from 'react';
import type { DocumentTemplateData } from '../types';
import { DesignA } from './DesignA';
import { DesignB } from './DesignB';
import { DesignC } from './DesignC';
import { DesignD } from './DesignD';
import { DesignE } from './DesignE';
import { DesignF } from './DesignF';

export type DesignKey = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

/** A single registered design entry. */
export interface DesignEntry {
  key: DesignKey;
  /** Human-readable name shown in the Design Studio. */
  label: string;
  /** React component that renders the document body. Must accept DocumentTemplateData as props. */
  component: (data: DocumentTemplateData) => React.ReactElement;
}

/**
 * Design Registry — the single source of truth for all available designs.
 *
 * ─── How to add a new design ───────────────────────────────────────────────
 *  1. Create `src/designs/DesignF.tsx`
 *     • Export a named function `DesignF(data: DocumentTemplateData): ReactElement`
 *     • Use styled-components for styling (body content only — no <html>/<head>)
 *  2. Import it below and add ONE entry to the array.
 *  3. Extend `DesignKey` above to include the new key.
 *  4. Run `pnpm build` in this package to update the compiled output.
 * ────────────────────────────────────────────────────────────────────────────
 */
export const designRegistry: DesignEntry[] = [
  { key: 'A', label: 'Minimal & Clean', component: DesignA },
  { key: 'B', label: 'Corporate', component: DesignB },
  { key: 'C', label: 'Modern Sidebar', component: DesignC },
  { key: 'D', label: 'Classic Formal', component: DesignD },
  { key: 'E', label: 'Compact B&W', component: DesignE },
  { key: 'F', label: 'New Design F', component: DesignF },
];
