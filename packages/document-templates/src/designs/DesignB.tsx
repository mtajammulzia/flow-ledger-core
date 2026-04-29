/**
 * Design B — Corporate / Dark Header
 *
 * Full-bleed dark navy header band with white text, bold colour-coded
 * document type pill, striped table rows. Authoritative and professional.
 */
import React from 'react';
import styled from 'styled-components';
import type { DocumentTemplateData } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined) => (v == null ? '—' : `PKR ${v.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`);

const fmtDate = (d: Date | null | undefined) => (d ? new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }).format(d) : '—');

const typeLabel = (t: DocumentTemplateData['type']) => ({ QUOTATION: 'Quotation', INVOICE: 'Invoice', CHALLAN: 'Delivery Challan' })[t] ?? t;

const typeColor: Record<DocumentTemplateData['type'], string> = {
  QUOTATION: '#f59e0b',
  INVOICE: '#3b82f6',
  CHALLAN: '#10b981',
};

// ─── Styled components ───────────────────────────────────────────────────────

const TopBand = styled.div`
  background: #0f172a;
  padding: 28px 48px;
`;
const TopBandInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 760px;
  margin: 0 auto;
`;
const TopLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;
const Logo = styled.img`
  height: 44px;
  border-radius: 4px;
`;
const CompanyAbbr = styled.span`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  background: #334155;
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const CompanyName = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
`;
const CompanyMeta = styled.div`
  font-size: 11.5px;
  color: #94a3b8;
  margin-top: 2px;
`;
const TopRight = styled.div`
  text-align: right;
`;
const TypePill = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #fff;
  background: ${({ $color }) => $color};
`;
const DocNumber = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin-top: 6px;
`;
const Page = styled.div`
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 13px;
  color: #1e293b;
  padding: 36px 48px;
  max-width: 860px;
  margin: 0 auto;
`;
const MetaStrip = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0 28px;
  border-bottom: 2px solid #f1f5f9;
`;
const MetaBlock = styled.div<{ $right?: boolean }>`
  ${({ $right }) => $right && 'text-align: right;'}
`;
const MetaLabel = styled.div`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #94a3b8;
  font-weight: 600;
  margin-bottom: 4px;
`;
const MetaValue = styled.div<{ $accent?: string }>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ $accent }) => $accent ?? '#0f172a'};
`;
const MetaSub = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 24px;
  th {
    padding: 10px 12px;
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    font-weight: 600;
    color: #94a3b8;
    text-align: left;
  }
  td {
    padding: 11px 12px;
    border-bottom: 1px solid #f1f5f9;
    vertical-align: top;
  }
`;
const ItemName = styled.span`
  font-weight: 500;
`;
const ItemSupplier = styled.span`
  font-size: 11px;
  color: #94a3b8;
`;
const TotalsWrap = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
`;
const TotalsTable = styled.table`
  border-collapse: collapse;
  min-width: 260px;
  td { padding: 8px 0; }
`;
const TotalsLabel = styled.td`
  padding-right: 16px !important;
  font-size: 13px;
  color: #64748b;
`;
const TotalsAmount = styled.td`
  font-size: 13px;
  text-align: right;
`;
const TotalsFinalRow = styled.tr<{ $accent: string }>`
  color: ${({ $accent }) => $accent};
  td {
    padding-top: 12px !important;
    border-top: 2px solid #e2e8f0;
    font-size: 16px;
    font-weight: 700;
  }
`;
const Notes = styled.div`
  margin-top: 28px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 12px;
  color: #475569;
`;
const FooterBand = styled.div`
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 14px 48px;
  text-align: center;
  font-size: 11px;
  color: #94a3b8;
  margin-top: 40px;
`;

// ─── Component ───────────────────────────────────────────────────────────────

export function DesignB(data: DocumentTemplateData) {
  const { type, number, issueDate, dueDate, notes, subtotal, totalAmount, tenant, customer, items } = data;
  const addr = [tenant.address, tenant.city, tenant.country].filter(Boolean).join(', ');
  const accent = typeColor[type];

  return (
    <>
      <TopBand>
        <TopBandInner>
          <TopLeft>
            {tenant.logoUrl ? <Logo src={tenant.logoUrl} alt={tenant.name} /> : <CompanyAbbr>{tenant.name.charAt(0)}</CompanyAbbr>}
            <div>
              <CompanyName>{tenant.name}</CompanyName>
              <CompanyMeta>{addr}</CompanyMeta>
              <CompanyMeta>
                {tenant.phone} · {tenant.email}
              </CompanyMeta>
            </div>
          </TopLeft>
          <TopRight>
            <TypePill $color={accent}>{typeLabel(type)}</TypePill>
            <DocNumber>#{String(number).padStart(4, '0')}</DocNumber>
          </TopRight>
        </TopBandInner>
      </TopBand>

      <Page>
        <MetaStrip>
          <MetaBlock>
            <MetaLabel>Bill To</MetaLabel>
            {customer ? (
              <>
                <MetaValue>{customer.name}</MetaValue>
                {[customer.phone, customer.email, customer.address].filter(Boolean).map((l, i) => (
                  <MetaSub key={i}>{l}</MetaSub>
                ))}
              </>
            ) : (
              <MetaSub>—</MetaSub>
            )}
          </MetaBlock>
          <MetaBlock $right>
            <MetaLabel>Issue Date</MetaLabel>
            <MetaValue>{fmtDate(issueDate)}</MetaValue>
            {dueDate && (
              <>
                <MetaLabel style={{ marginTop: 10 }}>Due Date</MetaLabel>
                <MetaValue $accent={accent}>{fmtDate(dueDate)}</MetaValue>
              </>
            )}
          </MetaBlock>
        </MetaStrip>

        <Table>
          <thead>
            <tr style={{ background: '#1e293b' }}>
              <th style={{ textAlign: 'center', width: 40, color: '#94a3b8' }}>#</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Unit Price</th>
              <th style={{ textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ textAlign: 'center', color: '#94a3b8' }}>{i + 1}</td>
                <td>
                  <ItemName>{item.description}</ItemName>
                  {item.supplier && <ItemSupplier> · {item.supplier.name}</ItemSupplier>}
                </td>
                <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{fmt(item.unitPrice)}</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>{fmt(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <TotalsWrap>
          <TotalsTable>
            <tbody>
              <tr>
                <TotalsLabel>Subtotal</TotalsLabel>
                <TotalsAmount>{fmt(subtotal)}</TotalsAmount>
              </tr>
              <TotalsFinalRow $accent={accent}>
                <TotalsLabel>Total Due</TotalsLabel>
                <TotalsAmount>{fmt(totalAmount)}</TotalsAmount>
              </TotalsFinalRow>
            </tbody>
          </TotalsTable>
        </TotalsWrap>

        {notes && (
          <Notes>
            <strong>Notes: </strong>
            {notes}
          </Notes>
        )}
      </Page>

      <FooterBand>
        {tenant.name} · {tenant.email} · {tenant.phone}
      </FooterBand>
    </>
  );
}
