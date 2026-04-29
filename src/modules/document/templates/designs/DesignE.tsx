/**
 * Design E — Compact B&W
 *
 * - Black and white only, tight spacing
 * - Two bordered boxes at the top: From (tenant) | To (customer)
 * - Compact items table
 * - T&C + signature block pinned to the bottom of the first page;
 *   naturally flows to the next page if items overflow
 */
import React from 'react';
import type { DocumentTemplateData } from '../document.template';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined) => (v == null ? '—' : `PKR ${v.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`);

const fmtDate = (d: Date | null | undefined) => (d ? new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }).format(d) : '—');

const typeLabel = (t: DocumentTemplateData['type']) => ({ QUOTATION: 'Quotation', INVOICE: 'Invoice', CHALLAN: 'Delivery Challan' })[t] ?? t;

// ─── Component ───────────────────────────────────────────────────────────────

export function DesignE(data: DocumentTemplateData) {
  const { type, number, issueDate, dueDate, notes, subtotal, totalAmount, tenant, customer, items } = data;

  const tenantAddr = [tenant.address, tenant.city, tenant.country].filter(Boolean).join(', ');

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>
          {typeLabel(type)} #{number}
        </title>
        <style>{css}</style>
      </head>
      <body>
        {/* Outer flex column that fills the A4 page height */}
        <div className="page">
          {/* ── Document title row ── */}
          <div className="title-row">
            <span className="doc-type">{typeLabel(type).toUpperCase()}</span>
            <span className="doc-meta">
              No.&nbsp;<strong>{String(number).padStart(4, '0')}</strong>
              &nbsp;&nbsp;|&nbsp;&nbsp; Date:&nbsp;<strong>{fmtDate(issueDate)}</strong>
              {dueDate && (
                <>
                  &nbsp;&nbsp;|&nbsp;&nbsp;Due:&nbsp;<strong>{fmtDate(dueDate)}</strong>
                </>
              )}
            </span>
          </div>

          {/* ── Top two boxes ── */}
          <div className="top-boxes">
            {/* From box */}
            <div className="info-box">
              <div className="box-heading">From</div>
              {tenant.logoUrl && <img src={tenant.logoUrl} alt={tenant.name} className="logo" />}
              <div className="info-name">{tenant.name}</div>
              {tenantAddr && <div className="info-line">{tenantAddr}</div>}
              <div className="info-line">{tenant.phone}</div>
              <div className="info-line">{tenant.email}</div>
            </div>

            {/* To box */}
            <div className="info-box">
              <div className="box-heading">To</div>
              {customer ? (
                <>
                  <div className="info-name">{customer.name}</div>
                  {customer.address && <div className="info-line">{customer.address}</div>}
                  {customer.phone && <div className="info-line">{customer.phone}</div>}
                  {customer.email && <div className="info-line">{customer.email}</div>}
                </>
              ) : (
                <div className="info-line">—</div>
              )}
            </div>
          </div>

          {/* ── Content: grows to push footer down ── */}
          <div className="content">
            {/* Items table */}
            <table className="items-table">
              <thead>
                <tr>
                  <th className="th th-c">#</th>
                  <th className="th">Description</th>
                  <th className="th th-r">Qty</th>
                  <th className="th th-r">Unit Price</th>
                  <th className="th th-r">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? '' : 'alt-row'}>
                    <td className="td td-c muted">{i + 1}</td>
                    <td className="td">
                      {item.description}
                      {item.supplier && <span className="supplier"> · {item.supplier.name}</span>}
                    </td>
                    <td className="td td-r">{item.quantity}</td>
                    <td className="td td-r">{fmt(item.unitPrice)}</td>
                    <td className="td td-r td-bold">{fmt(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="totals">
              <div className="tot-row">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="tot-row tot-final">
                <span>Total Due</span>
                <span>{fmt(totalAmount)}</span>
              </div>
            </div>

            {notes && (
              <div className="notes">
                <span className="notes-label">Notes: </span>
                {notes}
              </div>
            )}
          </div>

          {/* ── Bottom section: T&C + Signatures — pinned to page bottom ── */}
          <div className="bottom-section">
            <div className="tc-block">
              <div className="bottom-heading">Terms &amp; Conditions</div>
              <ol className="tc-list">
                <li>Payment is due within 30 days of the invoice date unless otherwise agreed in writing.</li>
                <li>Goods remain the property of the seller until full payment is received.</li>
                <li>Any disputes must be raised within 7 days of receipt of goods or services.</li>
                <li>Late payments may attract an interest charge of 2% per month on the outstanding amount.</li>
              </ol>
            </div>

            <div className="sig-row">
              <div className="sig-block">
                <div className="sig-line" />
                <div className="sig-label">Authorised Signature</div>
                <div className="sig-name">{tenant.name}</div>
              </div>
              <div className="sig-block">
                <div className="sig-line" />
                <div className="sig-label">Received / Accepted By</div>
                <div className="sig-name">{customer?.name ?? ''}</div>
              </div>
              <div className="sig-block">
                <div className="sig-line" />
                <div className="sig-label">Date</div>
                <div className="sig-name">&nbsp;</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 12px;
    color: #000;
    background: #fff;
  }

  /* A4 page — flex column so bottom section pins to bottom */
  .page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    padding: 14mm 16mm;
    display: flex;
    flex-direction: column;
  }

  /* Title row */
  .title-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 2px solid #000;
    padding-bottom: 6px;
    margin-bottom: 10px;
  }
  .doc-type {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: 1.5px;
  }
  .doc-meta {
    font-size: 11px;
    color: #333;
  }

  /* Top two boxes */
  .top-boxes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
  }
  .info-box {
    border: 1px solid #000;
    padding: 10px 12px;
  }
  .box-heading {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid #000;
    padding-bottom: 4px;
    margin-bottom: 6px;
  }
  .logo {
    height: 32px;
    display: block;
    margin-bottom: 6px;
  }
  .info-name {
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 3px;
  }
  .info-line {
    font-size: 11px;
    color: #333;
    margin-top: 2px;
    line-height: 1.4;
  }

  /* Content grows to fill space */
  .content {
    flex: 1;
  }

  /* Items table */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 8px;
  }
  .items-table thead tr {
    background: #000;
    color: #fff;
  }
  .th {
    padding: 6px 8px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: left;
  }
  .th-r { text-align: right; }
  .th-c { text-align: center; width: 32px; }
  .td {
    padding: 6px 8px;
    border-bottom: 1px solid #ddd;
    vertical-align: top;
    line-height: 1.4;
  }
  .alt-row td { background: #f5f5f5; }
  .td-r { text-align: right; }
  .td-c { text-align: center; }
  .td-bold { font-weight: 600; }
  .muted { color: #777; font-size: 11px; }
  .supplier { font-size: 10px; color: #555; }

  /* Totals */
  .totals {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
    margin-bottom: 12px;
  }
  .tot-row {
    display: flex;
    gap: 32px;
    font-size: 12px;
    color: #444;
    padding: 2px 0;
  }
  .tot-row span:last-child { min-width: 120px; text-align: right; }
  .tot-final {
    font-size: 13px;
    font-weight: 700;
    color: #000;
    border-top: 2px solid #000;
    padding-top: 4px;
    margin-top: 2px;
  }

  /* Notes */
  .notes {
    font-size: 11px;
    color: #444;
    margin-bottom: 12px;
    padding: 6px 10px;
    border-left: 2px solid #000;
  }
  .notes-label { font-weight: 700; }

  /* Bottom section — always at page bottom */
  .bottom-section {
    margin-top: auto;
    padding-top: 12px;
    border-top: 2px solid #000;
    page-break-inside: avoid;
  }

  /* T&C */
  .bottom-heading {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
  .tc-list {
    list-style: decimal;
    padding-left: 16px;
    margin-bottom: 16px;
  }
  .tc-list li {
    font-size: 9px;
    color: #444;
    line-height: 1.5;
    margin-bottom: 2px;
  }

  /* Signature row */
  .sig-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 24px;
  }
  .sig-block {}
  .sig-line {
    border-bottom: 1px solid #000;
    height: 28px;
    margin-bottom: 5px;
  }
  .sig-label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #555;
    font-weight: 600;
  }
  .sig-name {
    font-size: 10px;
    color: #333;
    margin-top: 2px;
  }

  @media print {
    .page { margin: 0; padding: 14mm 16mm; }
  }
`;
