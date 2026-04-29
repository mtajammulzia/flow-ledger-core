/**
 * Design C — Modern / Left Sidebar
 *
 * Dark coloured left sidebar holding company info & document meta.
 * Clean white content area on the right. Bold and visually distinctive.
 */
import React from 'react';
import type { DocumentTemplateData } from '../document.template';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined) => (v == null ? '—' : `PKR ${v.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`);

const fmtDate = (d: Date | null | undefined) => (d ? new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }).format(d) : '—');

const typeLabel = (t: DocumentTemplateData['type']) => ({ QUOTATION: 'Quotation', INVOICE: 'Invoice', CHALLAN: 'Delivery Challan' })[t] ?? t;

// ─── Component ───────────────────────────────────────────────────────────────

export function DesignC(data: DocumentTemplateData) {
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
        <div className="layout">
          {/* ── Left sidebar ── */}
          <aside className="sidebar">
            <div className="sidebar-top">
              {tenant.logoUrl ? (
                <img src={tenant.logoUrl} alt={tenant.name} className="logo" />
              ) : (
                <div className="logo-placeholder">{tenant.name.slice(0, 2).toUpperCase()}</div>
              )}
              <h2 className="s-company">{tenant.name}</h2>
              {addr && <p className="s-meta">{addr}</p>}
              <p className="s-meta">{tenant.phone}</p>
              <p className="s-meta">{tenant.email}</p>
            </div>

            <div className="sidebar-divider" />

            <div className="s-section">
              <div className="s-label">Document</div>
              <div className="s-value">{typeLabel(type)}</div>
              <div className="s-value s-number">#{String(number).padStart(4, '0')}</div>
            </div>

            <div className="s-section">
              <div className="s-label">Issued</div>
              <div className="s-value">{fmtDate(issueDate)}</div>
            </div>

            {dueDate && (
              <div className="s-section">
                <div className="s-label">Due</div>
                <div className="s-value s-due">{fmtDate(dueDate)}</div>
              </div>
            )}

            <div className="sidebar-bottom">
              <div className="s-section">
                <div className="s-label">Bill To</div>
                {customer ? (
                  <>
                    <div className="s-value">{customer.name}</div>
                    {[customer.phone, customer.email, customer.address].filter(Boolean).map((l, i) => (
                      <div key={i} className="s-meta">
                        {l}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="s-value">—</div>
                )}
              </div>
            </div>
          </aside>

          {/* ── Main content ── */}
          <main className="main">
            <div className="main-heading">
              <span className="doc-type-tag">{typeLabel(type)}</span>
            </div>

            {/* Items */}
            <table className="table">
              <thead>
                <tr className="t-head">
                  <th className="th th-c">#</th>
                  <th className="th">Item</th>
                  <th className="th th-r">Qty</th>
                  <th className="th th-r">Rate</th>
                  <th className="th th-r">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="t-row">
                    <td className="td td-c idx">{i + 1}</td>
                    <td className="td">
                      <span className="i-name">{item.description}</span>
                      {item.supplier && <div className="i-supplier">{item.supplier.name}</div>}
                    </td>
                    <td className="td td-r">{item.quantity}</td>
                    <td className="td td-r">{fmt(item.unitPrice)}</td>
                    <td className="td td-r i-total">{fmt(item.totalPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="totals">
              <div className="tot-row">
                <span className="tot-label">Subtotal</span>
                <span className="tot-val">{fmt(subtotal)}</span>
              </div>
              <div className="tot-row tot-final">
                <span className="tot-label">Total</span>
                <span className="tot-val-final">{fmt(totalAmount)}</span>
              </div>
            </div>

            {notes && (
              <div className="notes">
                <strong>Notes: </strong>
                {notes}
              </div>
            )}

            <div className="footer">Thank you for your business.</div>
          </main>
        </div>
      </body>
    </html>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #111827; background: #fff; }

  /* Layout */
  .layout { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sidebar { width: 220px; min-width: 220px; background: #1e293b; color: #fff; padding: 36px 24px; display: flex; flex-direction: column; }
  .sidebar-top { margin-bottom: 8px; }
  .logo { height: 40px; border-radius: 6px; margin-bottom: 14px; display: block; }
  .logo-placeholder { width: 48px; height: 48px; border-radius: 10px; background: #334155; color: #94a3b8; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .s-company { font-size: 15px; font-weight: 700; color: #f8fafc; line-height: 1.3; }
  .s-meta { font-size: 11px; color: #94a3b8; margin-top: 3px; line-height: 1.5; }

  .sidebar-divider { border: none; border-top: 1px solid #334155; margin: 20px 0; }

  .s-section { margin-bottom: 18px; }
  .s-label { font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; font-weight: 600; margin-bottom: 4px; }
  .s-value { font-size: 13px; font-weight: 600; color: #e2e8f0; }
  .s-number { font-size: 18px; color: #7dd3fc; margin-top: 2px; }
  .s-due { color: #fbbf24; }

  .sidebar-bottom { margin-top: auto; padding-top: 20px; border-top: 1px solid #334155; }

  /* Main */
  .main { flex: 1; padding: 40px 44px; background: #fff; }

  .main-heading { margin-bottom: 28px; }
  .doc-type-tag { display: inline-block; background: #eff6ff; color: #1d4ed8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 5px 14px; border-radius: 20px; border: 1px solid #bfdbfe; }

  /* Table */
  .table { width: 100%; border-collapse: collapse; }
  .t-head { }
  .th { padding: 9px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.7px; color: #6b7280; font-weight: 600; border-bottom: 2px solid #e5e7eb; text-align: left; }
  .th-r { text-align: right; }
  .th-c { text-align: center; width: 36px; }
  .t-row:hover { background: #f9fafb; }
  .td { padding: 11px 10px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  .td-r { text-align: right; }
  .td-c { text-align: center; }
  .idx { color: #d1d5db; font-size: 12px; }
  .i-name { font-weight: 500; }
  .i-supplier { font-size: 11px; color: #9ca3af; margin-top: 2px; }
  .i-total { font-weight: 600; color: #111827; }

  /* Totals */
  .totals { display: flex; flex-direction: column; align-items: flex-end; margin-top: 20px; gap: 6px; }
  .tot-row { display: flex; gap: 40px; font-size: 13px; color: #6b7280; }
  .tot-val { font-weight: 500; color: #374151; min-width: 130px; text-align: right; }
  .tot-final { margin-top: 8px; padding-top: 10px; border-top: 2px solid #e5e7eb; font-size: 15px; font-weight: 700; color: #111827; }
  .tot-val-final { font-size: 18px; font-weight: 800; color: #1d4ed8; min-width: 130px; text-align: right; }

  /* Notes */
  .notes { margin-top: 28px; font-size: 12px; color: #6b7280; padding: 12px 14px; background: #f9fafb; border-radius: 6px; }

  /* Footer */
  .footer { margin-top: 48px; font-size: 11px; color: #d1d5db; text-align: right; }
`;
