/**
 * Design D — Classic / Formal
 *
 * Traditional invoice aesthetic. Bordered table, top-left logo,
 * subtle diagonal watermark-style document type. Looks like a
 * printed ledger or formal business document.
 */
import React from 'react';
import type { DocumentTemplateData } from '../document.template';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined) => (v == null ? '—' : `PKR ${v.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`);

const fmtDate = (d: Date | null | undefined) => (d ? new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'long', year: 'numeric' }).format(d) : '—');

const typeLabel = (t: DocumentTemplateData['type']) => ({ QUOTATION: 'Quotation', INVOICE: 'Invoice', CHALLAN: 'Delivery Challan' })[t] ?? t;

// ─── Component ───────────────────────────────────────────────────────────────

export function DesignD(data: DocumentTemplateData) {
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
          {/* ── Watermark ── */}
          <div className="watermark">{typeLabel(type)}</div>

          {/* ── Top: logo + company + doc info ── */}
          <table className="top-table">
            <tbody>
              <tr>
                <td className="top-left">
                  {tenant.logoUrl && <img src={tenant.logoUrl} alt={tenant.name} className="logo" />}
                  <div className="company-name">{tenant.name}</div>
                  {addr && <div className="company-sub">{addr}</div>}
                  <div className="company-sub">
                    {tenant.phone} · {tenant.email}
                  </div>
                </td>
                <td className="top-right">
                  <div className="doc-title">{typeLabel(type).toUpperCase()}</div>
                  <table className="info-table">
                    <tbody>
                      <tr>
                        <td className="info-label">Number</td>
                        <td className="info-val">{String(number).padStart(4, '0')}</td>
                      </tr>
                      <tr>
                        <td className="info-label">Date</td>
                        <td className="info-val">{fmtDate(issueDate)}</td>
                      </tr>
                      {dueDate && (
                        <tr>
                          <td className="info-label">Due Date</td>
                          <td className="info-val">{fmtDate(dueDate)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <hr className="rule" />

          {/* ── Bill To ── */}
          <div className="bill-to-wrap">
            <div className="bill-to-box">
              <div className="box-label">Bill To:</div>
              {customer ? (
                <>
                  <div className="bt-name">{customer.name}</div>
                  {[customer.phone, customer.email, customer.address].filter(Boolean).map((l, i) => (
                    <div key={i} className="bt-sub">
                      {l}
                    </div>
                  ))}
                </>
              ) : (
                <div className="bt-sub">—</div>
              )}
            </div>
          </div>

          {/* ── Items ── */}
          <table className="items">
            <thead>
              <tr className="items-head">
                <th className="ih ih-c">S.No</th>
                <th className="ih">Description</th>
                <th className="ih ih-r">Qty</th>
                <th className="ih ih-r">Unit Price</th>
                <th className="ih ih-r">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className={i % 2 === 0 ? 'item-row' : 'item-row item-row-alt'}>
                  <td className="it it-c">{i + 1}</td>
                  <td className="it">
                    {item.description}
                    {item.supplier && <span className="supplier-name"> [{item.supplier.name}]</span>}
                  </td>
                  <td className="it it-r">{item.quantity}</td>
                  <td className="it it-r">{fmt(item.unitPrice)}</td>
                  <td className="it it-r it-total">{fmt(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} />
                <td className="tf-label">Sub-Total</td>
                <td className="tf-val">{fmt(subtotal)}</td>
              </tr>
              <tr className="tf-final">
                <td colSpan={3} />
                <td className="tf-label tf-total-label">TOTAL DUE</td>
                <td className="tf-val tf-total-val">{fmt(totalAmount)}</td>
              </tr>
            </tfoot>
          </table>

          {notes && (
            <div className="notes-wrap">
              <span className="box-label">Remarks: </span>
              <span className="notes-text">{notes}</span>
            </div>
          )}

          {/* ── Signature area ── */}
          <table className="sig-table">
            <tbody>
              <tr>
                <td className="sig-cell">
                  <div className="sig-line" />
                  <div className="sig-label">Authorised Signature</div>
                </td>
                <td />
                <td className="sig-cell">
                  <div className="sig-line" />
                  <div className="sig-label">Received By</div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="footer">
            This is a computer-generated document for {tenant.name}. · {tenant.email}
          </div>
        </div>
      </body>
    </html>
  );
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Times New Roman', Georgia, serif; font-size: 13px; color: #1a1a1a; background: #fff; }

  .page { padding: 48px 56px; max-width: 860px; margin: 0 auto; position: relative; overflow: hidden; }

  /* Watermark */
  .watermark {
    position: absolute; top: 42%; left: 50%;
    transform: translate(-50%, -50%) rotate(-30deg);
    font-size: 96px; font-weight: 900; text-transform: uppercase;
    color: rgba(0,0,0,0.035); letter-spacing: 4px;
    pointer-events: none; user-select: none; white-space: nowrap;
    font-family: 'Segoe UI', Arial, sans-serif;
  }

  /* Top table */
  .top-table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  .top-left { vertical-align: top; }
  .top-right { vertical-align: top; text-align: right; }
  .logo { height: 48px; display: block; margin-bottom: 10px; }
  .company-name { font-size: 20px; font-weight: 700; font-family: 'Segoe UI', Arial, sans-serif; }
  .company-sub { font-size: 12px; color: #555; margin-top: 3px; font-family: 'Segoe UI', Arial, sans-serif; }

  .doc-title { font-size: 26px; font-weight: 700; letter-spacing: 2px; color: #1a1a1a; font-family: 'Segoe UI', Arial, sans-serif; margin-bottom: 12px; }
  .info-table { border-collapse: collapse; margin-left: auto; }
  .info-label { padding: 3px 10px 3px 0; font-size: 12px; color: #666; text-align: right; font-family: 'Segoe UI', Arial, sans-serif; }
  .info-val { padding: 3px 0; font-size: 12px; font-weight: 600; min-width: 130px; text-align: right; font-family: 'Segoe UI', Arial, sans-serif; }

  /* Rule */
  .rule { border: none; border-top: 2px solid #1a1a1a; margin: 16px 0; }

  /* Bill To */
  .bill-to-wrap { margin-bottom: 20px; }
  .bill-to-box { display: inline-block; min-width: 240px; padding: 12px 16px; border: 1px solid #ccc; }
  .box-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #555; margin-bottom: 4px; font-family: 'Segoe UI', Arial, sans-serif; }
  .bt-name { font-size: 14px; font-weight: 700; }
  .bt-sub { font-size: 12px; color: #555; margin-top: 2px; font-family: 'Segoe UI', Arial, sans-serif; }

  /* Items table */
  .items { width: 100%; border-collapse: collapse; }
  .items-head { background: #1a1a1a; color: #fff; }
  .ih { padding: 9px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; font-family: 'Segoe UI', Arial, sans-serif; }
  .ih-r { text-align: right; }
  .ih-c { text-align: center; width: 50px; }
  .item-row td { border: 1px solid #e0e0e0; }
  .item-row-alt { background: #f5f5f5; }
  .it { padding: 9px 10px; vertical-align: top; line-height: 1.4; }
  .it-r { text-align: right; font-family: 'Courier New', monospace; }
  .it-c { text-align: center; }
  .it-total { font-weight: 700; }
  .supplier-name { font-size: 11px; color: #888; font-family: 'Segoe UI', Arial, sans-serif; }

  /* Tfoot */
  tfoot td { padding: 8px 10px; font-family: 'Segoe UI', Arial, sans-serif; }
  .tf-label { text-align: right; font-size: 12px; color: #555; border-top: 1px solid #ccc; }
  .tf-val   { text-align: right; font-size: 13px; border-top: 1px solid #ccc; font-family: 'Courier New', monospace; }
  .tf-final td { border-top: 2px solid #1a1a1a !important; }
  .tf-total-label { font-size: 13px; font-weight: 700; color: #1a1a1a; }
  .tf-total-val { font-size: 15px; font-weight: 700; }

  /* Notes */
  .notes-wrap { margin-top: 20px; font-size: 12px; color: #444; font-style: italic; font-family: 'Segoe UI', Arial, sans-serif; }
  .notes-text {}

  /* Signature */
  .sig-table { width: 100%; border-collapse: collapse; margin-top: 48px; }
  .sig-cell { width: 33%; padding: 0 8px; }
  .sig-line { border-bottom: 1px solid #1a1a1a; margin-bottom: 6px; height: 32px; }
  .sig-label { font-size: 11px; color: #666; text-align: center; font-family: 'Segoe UI', Arial, sans-serif; }

  /* Footer */
  .footer { margin-top: 32px; font-size: 10.5px; color: #aaa; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 12px; font-family: 'Segoe UI', Arial, sans-serif; }
`;
