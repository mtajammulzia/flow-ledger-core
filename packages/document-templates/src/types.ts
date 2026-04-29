// DocumentType is defined here as a plain string union so the package has
// no dependency on Prisma. The values match the Prisma enum exactly.
export type DocumentType = 'QUOTATION' | 'CHALLAN' | 'INVOICE';

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

  /** Per-render feature flags — every section defaults to visible */
  config?: DesignConfig;
};

export type DesignConfig = {
  showSignatures?: boolean;
  showTerms?: boolean;
  showDueDate?: boolean;
  showNotes?: boolean;
  /** Override the default T&C lines */
  terms?: string[];
};
