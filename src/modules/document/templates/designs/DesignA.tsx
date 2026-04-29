/**
 * Design A — Minimal & Clean
 *
 * Lots of white space, hairline dividers, single emerald accent.
 * Very readable, works well for quotations and invoices alike.
 */
import React from 'react';
import type { DocumentTemplateData } from '../document.template';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined) => (v == null ? '—' : `PKR ${v.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`);

const fmtDate = (d: Date | null | undefined) => (d ? new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }).format(d) : '—');

const typeLabel = (t: DocumentTemplateData['type']) => ({ QUOTATION: 'Quotation', INVOICE: 'Invoice', CHALLAN: 'Delivery Challan' })[t] ?? t;

// ─── Component ───────────────────────────────────────────────────────────────

export function DesignA(data: DocumentTemplateData) {
  const { type, number, issueDate, dueDate, notes, subtotal, totalAmount, tenant, customer, items } = data;
  const addr = [tenant.address, tenant.city, tenant.country].filter(Boolean).join(', ');

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
        <div className="page">
          {/* ── Header ── */}
          <header className="header">
            <div className="brand">
              {tenant.logoUrl && <img src={tenant.logoUrl} alt={tenant.name} className="logo" />}
              <h1 className="company">{tenant.name}</h1>
              <p className="company-sub">{addr}</p>
              <p className="company-sub">
                {tenant.phone} · {tenant.email}
              </p>
            </div>
            <div className="badge">
              <span className="badge-type">{typeLabel(type)}</span>
              <span className="badge-num">#{String(number).padStart(4, '0')}</span>
            </div>
          </header>

          <hr className="divider" />

          {/* ── Meta ── */}
          <section className="meta">
            <div className="meta-col">
              <p className="label">Bill To</p>
              {customer ? (
                <>
                  <p className="meta-name">{customer.name}</p>
                  {[customer.phone, customer.email, customer.address].filter(Boolean).map((l, i) => (
                    <p key={i} className="meta-sub">
                      {l}
                    </p>
                  ))}
                </>
              ) : (
                <p className="meta-sub">—</p>
              )}
            </div>
            <div className="meta-col meta-col-right">
              <div className="meta-row">
                <span className="label">Issue Date</span>
                <span>{fmtDate(issueDate)}</span>
              </div>
              {dueDate && (
                <div className="meta-row">
                  <span className="label">Due Date</span>
                  <span>{fmtDate(dueDate)}</span>
                </div>
              )}
              <div className="meta-row">
                <span className="label">Type</span>
                <span>{typeLabel(type)}</span>
              </div>
            </div>
          </section>

          <hr className="divider" />

          {/* ── Items ── */}
          <table className="items-table">
            <thead>
              <tr>
                <th className="col-num">#</th>
                <th>Description</th>
                <th className="col-r">Qty</th>
                <th className="col-r">Unit Price</th>
                <th className="col-r">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? '' : 'row-alt'}>
                  <td className="col-num muted">{i + 1}</td>
                  <td>
                    {item.description}
                    {item.supplier && <span className="tag">· {item.supplier.name}</span>}
                  </td>
                  <td className="col-r">{item.quantity}</td>
                  <td className="col-r">{fmt(item.unitPrice)}</td>
                  <td className="col-r strong">{fmt(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr className="divider" />

          {/* ── Totals ── */}
          <div className="totals">
            <div className="totals-row">
              <span className="muted">Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="totals-row totals-final">
              <span>Total Due</span>
              <span className="accent">{fmt(totalAmount)}</span>
            </div>
          </div>

          {notes && (
            <div className="notes">
              <span className="label">Notes — </span>
              {notes}
            </div>
          )}

          <footer className="footer">{tenant.name} · Thank you for your business</footer>
        </div>
      </body>
    </html>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #111; background: #fff; }

  .page { padding: 56px 64px; max-width: 820px; margin: 0 auto; }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
  .logo { height: 44px; display: block; margin-bottom: 10px; }
  .company { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; }
  .company-sub { font-size: 11.5px; color: #666; margin-top: 2px; }
  .badge { text-align: right; }
  .badge-type { display: block; font-size: 24px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 1px; }
  .badge-num { display: block; font-size: 13px; color: #999; margin-top: 4px; }

  /* Divider */
  .divider { border: none; border-top: 1px solid #e8e8e8; margin: 24px 0; }

  /* Meta */
  .meta { display: flex; justify-content: space-between; gap: 32px; }
  .meta-col {}
  .meta-col-right { text-align: right; min-width: 220px; }
  .meta-name { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
  .meta-sub { font-size: 12px; color: #666; margin-top: 2px; }
  .meta-row { display: flex; justify-content: space-between; gap: 24px; font-size: 12px; margin-bottom: 6px; }
  .label { font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.6px; color: #999; font-weight: 600; }

  /* Items */
  .items-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  .items-table thead tr { border-bottom: 1px solid #111; }
  .items-table th { padding: 6px 8px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.6px; color: #666; font-weight: 600; text-align: left; }
  .items-table td { padding: 10px 8px; font-size: 13px; }
  .row-alt td { background: #fafafa; }
  .col-num { width: 36px; text-align: center; }
  .col-r { text-align: right; width: 120px; }
  .tag { font-size: 11px; color: #999; margin-left: 6px; }
  .muted { color: #999; }
  .strong { font-weight: 600; }

  /* Totals */
  .totals { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; margin-top: 8px; }
  .totals-row { display: flex; gap: 40px; font-size: 13px; }
  .totals-final { font-size: 15px; font-weight: 700; padding-top: 8px; border-top: 1px solid #e8e8e8; margin-top: 2px; }
  .accent { color: #059669; }

  /* Notes */
  .notes { margin-top: 32px; font-size: 12px; color: #555; border-left: 3px solid #059669; padding-left: 12px; }

  /* Footer */
  .footer { margin-top: 48px; padding-top: 16px; border-top: 1px solid #f0f0f0; text-align: center; font-size: 11px; color: #bbb; }
`;
