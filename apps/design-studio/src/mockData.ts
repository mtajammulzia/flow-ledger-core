import type { DocumentTemplateData } from '@flow-ledger/document-templates';

export const mockData: DocumentTemplateData = {
  type: 'QUOTATION',
  number: 1001,
  issueDate: new Date('2026-04-28'),
  dueDate: new Date('2026-05-28'),
  notes: 'Please review and confirm within 7 working days. Prices valid for 30 days from issue date.',
  subtotal: 1500,
  totalAmount: 1500,
  tenant: {
    name: 'Karachi General Traders',
    email: 'info@kgt.com',
    phone: '+92-300-1111111',
    address: 'Saddar Market',
    city: 'Karachi',
    country: 'Pakistan',
  },
  customer: {
    name: 'Shah Enterprises',
    phone: '+92-333-1000001',
    email: 'shah@enterprises.com',
    address: 'Tower Market, Karachi',
  },
  items: [
    {
      description: 'Mild Steel Rod',
      quantity: 10,
      unitPrice: 100,
      totalPrice: 1000,
      supplier: { name: 'Metro Steel Suppliers' },
    },
    {
      description: 'Copper Wire 2mm',
      quantity: 5,
      unitPrice: 100,
      totalPrice: 500,
      supplier: { name: 'Electro Wholesale' },
    },
  ],
};
