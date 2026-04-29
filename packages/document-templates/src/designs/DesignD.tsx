/**
 * Design D — Classic / Formal
 *
 * Traditional invoice aesthetic. Bordered table, top-left logo,
 * subtle diagonal watermark-style document type. Looks like a
 * printed ledger or formal business document.
 */
import React from 'react';
import styled from 'styled-components';
import type { DocumentTemplateData } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined) => (v == null ? '—' : `PKR ${v.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`);

const fmtDate = (d: Date | null | undefined) => (d ? new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'long', year: 'numeric' }).format(d) : '—');

const typeLabel = (t: DocumentTemplateData['type']) => ({ QUOTATION: 'Quotation', INVOICE: 'Invoice', CHALLAN: 'Delivery Challan' })[t] ?? t;

// ─── Styled components ───────────────────────────────────────────────────────

const Page = styled.div`
  font-family: 'Times New Roman', Georgia, serif;
  font-size: 13px;
  color: #1a1a1a;
  padding: 48px 56px;
  max-width: 860px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
`;
const Watermark = styled.div`
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  font-size: 96px;
  font-weight: 900;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.035);
  letter-spacing: 4px;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  font-family: 'Segoe UI', Arial, sans-serif;
`;
const TopTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
`;
const Logo = styled.img`
  height: 48px;
  display: block;
  margin-bottom: 10px;
`;
const CompanyName = styled.div`
  font-size: 20px;
  font-weight: 700;
  font-family: 'Segoe UI', Arial, sans-serif;
`;
const CompanySub = styled.div`
  font-size: 12px;
  color: #555;
  margin-top: 3px;
  font-family: 'Segoe UI', Arial, sans-serif;
`;
const DocTitle = styled.div`
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #1a1a1a;
  font-family: 'Segoe UI', Arial, sans-serif;
  margin-bottom: 12px;
`;
const InfoTable = styled.table`
  border-collapse: collapse;
  margin-left: auto;
  td {
    padding: 3px 0;
    font-size: 12px;
    font-family: 'Segoe UI', Arial, sans-serif;
  }
`;
const InfoLabel = styled.td`
  padding-right: 10px !important;
  color: #666;
  text-align: right;
`;
const InfoVal = styled.td`
  font-weight: 600;
  min-width: 130px;
  text-align: right;
`;
const Rule = styled.hr`
  border: none;
  border-top: 2px solid #1a1a1a;
  margin: 16px 0;
`;
const BillToBox = styled.div`
  display: inline-block;
  min-width: 240px;
  padding: 12px 16px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
`;
const BoxLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #555;
  margin-bottom: 4px;
  font-family: 'Segoe UI', Arial, sans-serif;
`;
const BtName = styled.div`
  font-size: 14px;
  font-weight: 700;
`;
const BtSub = styled.div`
  font-size: 12px;
  color: #555;
  margin-top: 2px;
  font-family: 'Segoe UI', Arial, sans-serif;
`;
const Items = styled.table`
  width: 100%;
  border-collapse: collapse;
  thead tr { background: #1a1a1a; color: #fff; }
  th {
    padding: 9px 10px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: left;
    font-family: 'Segoe UI', Arial, sans-serif;
  }
  td { border: 1px solid #e0e0e0; padding: 9px 10px; vertical-align: top; line-height: 1.4; }
  tfoot td { padding: 8px 10px; font-family: 'Segoe UI', Arial, sans-serif; }
`;
const SupplierName = styled.span`
  font-size: 11px;
  color: #888;
  font-family: 'Segoe UI', Arial, sans-serif;
`;
const SigTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 48px;
`;
const SigLine = styled.div`
  border-bottom: 1px solid #1a1a1a;
  height: 32px;
  margin-bottom: 6px;
`;
const SigLabel = styled.div`
  font-size: 11px;
  color: #666;
  text-align: center;
  font-family: 'Segoe UI', Arial, sans-serif;
`;
const FooterText = styled.div`
  margin-top: 32px;
  font-size: 10.5px;
  color: #aaa;
  text-align: center;
  border-top: 1px solid #e0e0e0;
  padding-top: 12px;
  font-family: 'Segoe UI', Arial, sans-serif;
`;

// ─── Component ───────────────────────────────────────────────────────────────

export function DesignD(data: DocumentTemplateData) {
  const { type, number, issueDate, dueDate, notes, subtotal, totalAmount, tenant, customer, items } = data;
  const addr = [tenant.address, tenant.city, tenant.country].filter(Boolean).join(', ');

  return (
    <Page>
      <Watermark>{typeLabel(type)}</Watermark>

      <TopTable>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top' }}>
              {tenant.logoUrl && <Logo src={tenant.logoUrl} alt={tenant.name} />}
              <CompanyName>{tenant.name}</CompanyName>
              {addr && <CompanySub>{addr}</CompanySub>}
              <CompanySub>
                {tenant.phone} · {tenant.email}
              </CompanySub>
            </td>
            <td style={{ verticalAlign: 'top', textAlign: 'right' }}>
              <DocTitle>{typeLabel(type).toUpperCase()}</DocTitle>
              <InfoTable>
                <tbody>
                  <tr>
                    <InfoLabel>Number</InfoLabel>
                    <InfoVal>{String(number).padStart(4, '0')}</InfoVal>
                  </tr>
                  <tr>
                    <InfoLabel>Date</InfoLabel>
                    <InfoVal>{fmtDate(issueDate)}</InfoVal>
                  </tr>
                  {dueDate && (
                    <tr>
                      <InfoLabel>Due Date</InfoLabel>
                      <InfoVal>{fmtDate(dueDate)}</InfoVal>
                    </tr>
                  )}
                </tbody>
              </InfoTable>
            </td>
          </tr>
        </tbody>
      </TopTable>

      <Rule />

      <BillToBox>
        <BoxLabel>Bill To:</BoxLabel>
        {customer ? (
          <>
            <BtName>{customer.name}</BtName>
            {[customer.phone, customer.email, customer.address].filter(Boolean).map((l, i) => (
              <BtSub key={i}>{l}</BtSub>
            ))}
          </>
        ) : (
          <BtSub>—</BtSub>
        )}
      </BillToBox>

      <Items>
        <thead>
          <tr>
            <th style={{ textAlign: 'center', width: 50 }}>S.No</th>
            <th>Description</th>
            <th style={{ textAlign: 'right' }}>Qty</th>
            <th style={{ textAlign: 'right' }}>Unit Price</th>
            <th style={{ textAlign: 'right' }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={i % 2 !== 0 ? { background: '#f5f5f5' } : {}}>
              <td style={{ textAlign: 'center' }}>{i + 1}</td>
              <td>
                {item.description}
                {item.supplier && <SupplierName> [{item.supplier.name}]</SupplierName>}
              </td>
              <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', fontFamily: 'Courier New, monospace' }}>{fmt(item.unitPrice)}</td>
              <td style={{ textAlign: 'right', fontWeight: 700, fontFamily: 'Courier New, monospace' }}>{fmt(item.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={3} style={{ border: 'none' }} />
            <td style={{ textAlign: 'right', fontSize: 12, color: '#555', borderTop: '1px solid #ccc' }}>Sub-Total</td>
            <td style={{ textAlign: 'right', fontSize: 13, borderTop: '1px solid #ccc', fontFamily: 'Courier New, monospace' }}>{fmt(subtotal)}</td>
          </tr>
          <tr>
            <td colSpan={3} style={{ border: 'none' }} />
            <td style={{ textAlign: 'right', fontSize: 13, fontWeight: 700, borderTop: '2px solid #1a1a1a' }}>TOTAL DUE</td>
            <td style={{ textAlign: 'right', fontSize: 15, fontWeight: 700, borderTop: '2px solid #1a1a1a', fontFamily: 'Courier New, monospace' }}>
              {fmt(totalAmount)}
            </td>
          </tr>
        </tfoot>
      </Items>

      {notes && (
        <div style={{ marginTop: 20, fontSize: 12, color: '#444', fontStyle: 'italic' }}>
          <BoxLabel as="span">Remarks: </BoxLabel>
          {notes}
        </div>
      )}

      <SigTable>
        <tbody>
          <tr>
            <td style={{ width: '33%', padding: '0 8px' }}>
              <SigLine />
              <SigLabel>Authorised Signature</SigLabel>
            </td>
            <td />
            <td style={{ width: '33%', padding: '0 8px' }}>
              <SigLine />
              <SigLabel>Received By</SigLabel>
            </td>
          </tr>
        </tbody>
      </SigTable>

      <FooterText>
        This is a computer-generated document for {tenant.name}. · {tenant.email}
      </FooterText>
    </Page>
  );
}
