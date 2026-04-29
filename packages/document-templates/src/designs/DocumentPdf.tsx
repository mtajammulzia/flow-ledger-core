import React from 'react';
import type { DocumentTemplateData } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return '—';
  return `PKR ${value.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(date: Date | null | undefined): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function docTypeLabel(type: DocumentTemplateData['type']): string {
  return { QUOTATION: 'Quotation', INVOICE: 'Invoice', CHALLAN: 'Delivery Challan' }[type] ?? type;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function Header({ tenant, type, number }: Pick<DocumentTemplateData, 'tenant' | 'type' | 'number'>) {
  const address = [tenant.address, tenant.city, tenant.country].filter(Boolean).join(', ');
  return (
    <div style={styles.header}>
      <div>
        {tenant.logoUrl && <img src={tenant.logoUrl} alt={tenant.name} style={styles.logo} />}
        <div style={styles.companyName}>{tenant.name}</div>
        <div style={styles.companyMeta}>
          {address && (
            <span>
              {address}
              <br />
            </span>
          )}
          {tenant.phone} &bull; {tenant.email}
        </div>
      </div>
      <div style={styles.docBadge}>
        <div style={styles.docType}>{docTypeLabel(type)}</div>
        <div style={styles.docNumber}># {String(number).padStart(4, '0')}</div>
      </div>
    </div>
  );
}

function MetaGrid({ customer, issueDate, dueDate, type }: Pick<DocumentTemplateData, 'customer' | 'issueDate' | 'dueDate' | 'type'>) {
  return (
    <div style={styles.metaGrid}>
      {/* Bill To */}
      <div style={styles.metaBox}>
        <div style={styles.metaLabel}>Bill To</div>
        {customer ? (
          <>
            <div style={styles.metaName}>{customer.name}</div>
            <div style={styles.metaDetail}>
              {[customer.phone, customer.email, customer.address].filter(Boolean).map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </div>
          </>
        ) : (
          <div style={styles.metaDetail}>—</div>
        )}
      </div>

      {/* Dates */}
      <div style={{ ...styles.metaBox, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <DateRow label="Issue Date" value={formatDate(issueDate)} />
        {dueDate && <DateRow label="Due Date" value={formatDate(dueDate)} />}
        <DateRow label="Document Type" value={docTypeLabel(type)} />
      </div>
    </div>
  );
}

function DateRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={styles.dateRow}>
      <span style={styles.dateLabel}>{label}</span>
      <span style={styles.dateValue}>{value}</span>
    </div>
  );
}

function ItemsTable({ items }: Pick<DocumentTemplateData, 'items'>) {
  return (
    <div>
      <div style={styles.sectionHeading}>Line Items</div>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHead}>
            <th style={{ ...styles.th, width: 40, textAlign: 'center' }}>#</th>
            <th style={styles.th}>Description</th>
            <th style={{ ...styles.th, width: 80, textAlign: 'right' }}>Qty</th>
            <th style={{ ...styles.th, width: 130, textAlign: 'right' }}>Unit Price</th>
            <th style={{ ...styles.th, width: 130, textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} style={idx % 2 === 0 ? styles.trOdd : styles.trEven}>
              <td style={{ ...styles.td, textAlign: 'center', color: '#6b7280' }}>{idx + 1}</td>
              <td style={styles.td}>
                {item.description}
                {item.supplier && (
                  <span style={styles.supplierTag}>
                    <br />
                    Supplier: {item.supplier.name}
                  </span>
                )}
              </td>
              <td style={{ ...styles.td, textAlign: 'right' }}>{item.quantity}</td>
              <td style={{ ...styles.td, textAlign: 'right' }}>{formatCurrency(item.unitPrice)}</td>
              <td style={{ ...styles.td, textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Totals({ subtotal, totalAmount }: Pick<DocumentTemplateData, 'subtotal' | 'totalAmount'>) {
  return (
    <div style={styles.totalsOuter}>
      <div style={styles.totalsBox}>
        <div style={styles.totalsRow}>
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div style={{ ...styles.totalsRow, ...styles.totalsRowFinal }}>
          <span>Total</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Root component ──────────────────────────────────────────────────────────

export function DocumentPdf(data: DocumentTemplateData) {
  const { type, number, issueDate, dueDate, notes, subtotal, totalAmount, tenant, customer, items } = data;

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>
          {docTypeLabel(type)} #{number}
        </title>
        <style>{globalCss}</style>
      </head>
      <body>
        <div style={styles.page}>
          <Header tenant={tenant} type={type} number={number} />
          <MetaGrid customer={customer} issueDate={issueDate} dueDate={dueDate} type={type} />
          <ItemsTable items={items} />
          <Totals subtotal={subtotal} totalAmount={totalAmount} />

          {notes && (
            <div style={styles.notes}>
              <strong>Notes</strong>
              <span style={{ marginTop: 4, display: 'block' }}>{notes}</span>
            </div>
          )}

          <div style={styles.footer}>Thank you for your business &mdash; {tenant.name}</div>
        </div>
      </body>
    </html>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
// Using inline styles (puppeteer renders them reliably).
// Only truly global resets go in the <style> tag below.

const globalCss = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1a1a2e; background: #fff; }
  table { border-collapse: collapse; width: 100%; }
`;

const styles = {
  page: {
    padding: '48px 56px',
    maxWidth: 860,
    margin: '0 auto',
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    paddingBottom: 24,
    borderBottom: '2px solid #e5e7eb',
  } as React.CSSProperties,
  logo: { height: 48, marginBottom: 8, display: 'block' } as React.CSSProperties,
  companyName: { fontSize: 22, fontWeight: 700, color: '#111827' },
  companyMeta: { marginTop: 4, fontSize: 12, color: '#6b7280', lineHeight: '1.6' },
  docBadge: { textAlign: 'right' } as React.CSSProperties,
  docType: { fontSize: 28, fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1 } as React.CSSProperties,
  docNumber: { fontSize: 14, color: '#6b7280', marginTop: 4 },

  // Meta grid
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 32,
  } as React.CSSProperties,
  metaBox: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '16px 20px',
  } as React.CSSProperties,
  metaLabel: { fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#9ca3af', marginBottom: 8 } as React.CSSProperties,
  metaName: { fontSize: 15, fontWeight: 600, color: '#111827' },
  metaDetail: { fontSize: 12, color: '#6b7280', lineHeight: '1.7', marginTop: 2 },
  dateRow: { display: 'flex', justifyContent: 'space-between', fontSize: 12 } as React.CSSProperties,
  dateLabel: { color: '#6b7280' },
  dateValue: { fontWeight: 600, color: '#111827' },

  // Items table
  sectionHeading: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: '#9ca3af',
    marginBottom: 12,
  } as React.CSSProperties,
  table: {},
  tableHead: { background: '#1e3a5f', color: '#fff' } as React.CSSProperties,
  th: { padding: '10px 12px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' } as React.CSSProperties,
  trOdd: { background: '#ffffff' } as React.CSSProperties,
  trEven: { background: '#f9fafb' } as React.CSSProperties,
  td: { padding: '10px 12px', verticalAlign: 'top', borderBottom: '1px solid #f3f4f6', lineHeight: '1.5' } as React.CSSProperties,
  supplierTag: { fontSize: 11, color: '#6b7280' },

  // Totals
  totalsOuter: { marginTop: 24, display: 'flex', justifyContent: 'flex-end' } as React.CSSProperties,
  totalsBox: { width: 280, border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' } as React.CSSProperties,
  totalsRow: { display: 'flex', justifyContent: 'space-between', padding: '10px 16px', fontSize: 13, borderBottom: '1px solid #f3f4f6' } as React.CSSProperties,
  totalsRowFinal: { background: '#1e3a5f', color: '#fff', fontWeight: 700, fontSize: 14, borderBottom: 'none' } as React.CSSProperties,

  // Notes
  notes: {
    marginTop: 32,
    padding: '16px 20px',
    background: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: 8,
    fontSize: 12,
    color: '#92400e',
  } as React.CSSProperties,

  // Footer
  footer: { marginTop: 40, paddingTop: 16, borderTop: '1px solid #e5e7eb', textAlign: 'center', fontSize: 11, color: '#9ca3af' } as React.CSSProperties,
} as const;
