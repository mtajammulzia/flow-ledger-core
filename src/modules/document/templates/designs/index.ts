import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { DocumentTemplateData } from '../document.template';
import { DesignA } from './DesignA';
import { DesignB } from './DesignB';
import { DesignC } from './DesignC';
import { DesignD } from './DesignD';
import { DesignE } from './DesignE';

export type DesignKey = 'A' | 'B' | 'C' | 'D' | 'E';

const designMap: Record<DesignKey, (data: DocumentTemplateData) => React.ReactElement> = {
  A: (d) => React.createElement(DesignA, d),
  B: (d) => React.createElement(DesignB, d),
  C: (d) => React.createElement(DesignC, d),
  D: (d) => React.createElement(DesignD, d),
  E: (d) => React.createElement(DesignE, d),
};

export function renderDesign(key: DesignKey, data: DocumentTemplateData): string {
  return '<!DOCTYPE html>' + renderToStaticMarkup(designMap[key](data));
}

export const DESIGNS = Object.keys(designMap) as DesignKey[];
