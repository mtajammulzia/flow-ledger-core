import type { DocumentType } from '@generated/prisma/enums';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { DocumentPdf } from './DocumentPdf';

export type DocumentTemplateData = {
  type: DocumentType;
  number: number;
  issueDate: Date | null;
  dueDate?: Date | null;
  notes?: string | null;
  subtotal: number | null;
  totalAmount: number | null;

  tenant: {
    name: string;
    email: string;
    phone: string;
    address?: string | null;
    city?: string | null;
    country?: string | null;
    logoUrl?: string | null;
  };

  customer?: {
    name: string;
    phone?: string | null;
    email?: string | null;
    address?: string | null;
  } | null;

  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    supplier?: { name: string } | null;
  }[];
};

export function renderDocumentHtml(data: DocumentTemplateData): string {
  return '<!DOCTYPE html>' + renderToStaticMarkup(React.createElement(DocumentPdf, data));
}
