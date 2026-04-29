/**
 * Design B — Corporate / Dark Header
 *
 * Full-bleed dark navy header band with white text, bold colour-coded
 * document type pill, striped table rows. Authoritative and professional.
 */
import React from 'react';
import type { DocumentTemplateData } from '../document.template';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined) => (v == null ? '—' : `PKR ${v.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`);

const fmtDate = (d: Date | null | undefined) => (d ? new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }).format(d) : '—');

const typeLabel = (t: DocumentTemplateData['type']) => ({ QUOTATION: 'Quotation', INVOICE: 'Invoice', CHALLAN: 'Delivery Challan' })[t] ?? t;

const typeColor: Record<DocumentTemplateData['type'], string> = {
  QUOTATION: '#f59e0b',
  INVOICE: '#3b82f6',
  CHALLAN: '#10b981',
};

// ─── Component ───────────────────────────────────────────────────────────────

export function DesignB(data: DocumentTemplateData) {
  const { type, number, issueDate, dueDate, notes, subtotal, totalAmount, tenant, customer, items } = data;
  const addr = [tenant.address, tenant.city, tenant.country].filter(Boolean).join(', ');
  const accent = typeColor[type];

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
        {/* ── Dark header band ── */}
        <div className="top-band">
          <div className="top-band-inner">
            <div className="top-left">
              {tenant.logoUrl ? <img src={tenant.logoUrl} alt={tenant.name} className="logo" /> : <span className="company-abbr">{tenant.name.charAt(0)}</span>}
              <div>
                <div className="company-name">{tenant.name}</div>
                <div className="company-meta">{addr}</div>
                <div className="company-meta">
                  {tenant.phone} · {tenant.email}
                </div>
              </div>
            </div>
            <div className="top-right">
              <span className="type-pill" style={{ background: accent }}>
                {typeLabel(type)}
              </span>
              <div className="doc-number">#{String(number).padStart(4, '0')}</div>
            </div>
          </div>
        </div>

        <div className="page">
          {/* ── Meta strip ── */}
          <div className="meta-strip">
            <div className="meta-block">
              <div className="meta-label">Bill To</div>
              {customer ? (
                <>
                  <div className="meta-value">{customer.name}</div>
                  {[customer.phone, customer.email, customer.address].filter(Boolean).map((l, i) => (
                    <div key={i} className="meta-sub">
                      {l}
                    </div>
                  ))}
                </>
              ) : (
                <div className="meta-sub">—</div>
              )}
            </div>
            <div className="meta-block meta-block-right">
              <div className="meta-label">Issue Date</div>
              <div className="meta-value">{fmtDate(issueDate)}</div>
              {dueDate && (
                <>
                  <div className="meta-label" style={{ marginTop: 10 }}>
                    Due Date
                  </div>
                  <div className="meta-value due" style={{ color: accent }}>
                    {fmtDate(dueDate)}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Items ── */}
          <table className="table">
            <thead>
              <tr style={{ background: '#1e293b' }}>
                <th className="th th-c">#</th>
                <th className="th">Description</th>
                <th className="th th-r">Qty</th>
                <th className="th th-r">Unit Price</th>
                <th className="th th-r">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? 'tr-even' : 'tr-odd'}>
                  <td className="td td-c muted">{i + 1}</td>
                  <td className="td">
                    <span className="item-name">{item.description}</span>
                    {item.supplier && <span className="item-supplier"> · {item.supplier.name}</span>}
                  </td>
                  <td className="td td-r">{item.quantity}</td>
                  <td className="td td-r">{fmt(item.unitPrice)}</td>
                  <td className="td td-r bold">{fmt(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── Totals ── */}
          <div className="totals-wrap">
            <table className="totals-table">
              <tbody>
                <tr>
                  <td className="totals-label">Subtotal</td>
                  <td className="totals-amount">{fmt(subtotal)}</td>
                </tr>
                <tr className="totals-final-row" style={{ color: accent }}>
                  <td className="totals-label">Total Due</td>
                  <td className="totals-amount">{fmt(totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {notes && (
            <div className="notes">
              <strong>Notes: </strong>
              {notes}
            </div>
          )}
        </div>

        {/* ── Footer band ── */}
        <div className="footer-band">
          {tenant.name} · {tenant.email} · {tenant.phone}
        </div>
      </body>
    </html>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; color: #1e293b; background: #fff; }

  /* Header band */
  .top-band { background: #0f172a; padding: 28px 48px; }
  .top-band-inner { display: flex; justify-content: space-between; align-items: center; max-width: 760px; margin: 0 auto; }
  .top-left { display: flex; align-items: center; gap: 16px; }
  .logo { height: 44px; border-radius: 4px; }
  .company-abbr { width: 44px; height: 44px; border-radius: 8px; background: #334155; color: #fff; font-size: 22px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
  .company-name { font-size: 18px; font-weight: 700; color: #fff; }
  .company-meta { font-size: 11.5px; color: #94a3b8; margin-top: 2px; }
  .top-right { text-align: right; }
  .type-pill { display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #fff; }
  .doc-number { font-size: 22px; font-weight: 700; color: #fff; margin-top: 6px; }

  /* Page area */
  .page { padding: 36px 48px; max-width: 860px; margin: 0 auto; }

  /* Meta strip */
  .meta-strip { display: flex; justify-content: space-between; padding: 20px 0 28px; border-bottom: 2px solid #f1f5f9; }
  .meta-block {}
  .meta-block-right { text-align: right; }
  .meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.8px; color: #94a3b8; font-weight: 600; margin-bottom: 4px; }
  .meta-value { font-size: 14px; font-weight: 600; color: #0f172a; }
  .meta-sub { font-size: 12px; color: #64748b; margin-top: 2px; }

  /* Table */
  .table { width: 100%; border-collapse: collapse; margin-top: 24px; }
  .th { padding: 10px 12px; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.6px; font-weight: 600; color: #94a3b8; text-align: left; }
  .th-r { text-align: right; }
  .th-c { text-align: center; }
  .td { padding: 11px 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
  .td-r { text-align: right; }
  .td-c { text-align: center; }
  .tr-even { background: #fff; }
  .tr-odd  { background: #f8fafc; }
  .item-name { font-weight: 500; }
  .item-supplier { font-size: 11px; color: #94a3b8; }
  .muted { color: #94a3b8; }
  .bold { font-weight: 700; }

  /* Totals */
  .totals-wrap { display: flex; justify-content: flex-end; margin-top: 20px; }
  .totals-table { border-collapse: collapse; min-width: 260px; }
  .totals-label { padding: 8px 16px 8px 0; font-size: 13px; color: #64748b; }
  .totals-amount { padding: 8px 0; font-size: 13px; text-align: right; }
  .totals-final-row td { padding-top: 12px; border-top: 2px solid #e2e8f0; font-size: 16px; font-weight: 700; }

  /* Notes */
  .notes { margin-top: 28px; padding: 12px 16px; background: #f8fafc; border-radius: 6px; font-size: 12px; color: #475569; }

  /* Footer band */
  .footer-band { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 48px; text-align: center; font-size: 11px; color: #94a3b8; margin-top: 40px; }
`;
