/**
 * Design A — Minimal & Clean
 *
 * Lots of white space, hairline dividers, single emerald accent.
 * Very readable, works well for quotations and invoices alike.
 */
import React from 'react';
import styled from 'styled-components';
import type { DocumentTemplateData } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined) => (v == null ? '—' : `PKR ${v.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`);

const fmtDate = (d: Date | null | undefined) => (d ? new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }).format(d) : '—');

const typeLabel = (t: DocumentTemplateData['type']) => ({ QUOTATION: 'Quotation', INVOICE: 'Invoice', CHALLAN: 'Delivery Challan' })[t] ?? t;

// ─── Styled components ───────────────────────────────────────────────────────

const Page = styled.div`
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  color: #111;
  padding: 56px 64px;
  max-width: 820px;
  margin: 0 auto;
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
`;
const Brand = styled.div``;
const Logo = styled.img`
  height: 44px;
  display: block;
  margin-bottom: 10px;
`;
const Company = styled.h1`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.3px;
`;
const CompanySub = styled.p`
  font-size: 11.5px;
  color: #666;
  margin-top: 2px;
`;
const BadgeWrap = styled.div`
  text-align: right;
`;
const BadgeType = styled.span`
  display: block;
  font-size: 24px;
  font-weight: 800;
  color: #059669;
  text-transform: uppercase;
  letter-spacing: 1px;
`;
const BadgeNum = styled.span`
  display: block;
  font-size: 13px;
  color: #999;
  margin-top: 4px;
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e8e8e8;
  margin: 24px 0;
`;
const Meta = styled.section`
  display: flex;
  justify-content: space-between;
  gap: 32px;
`;
const MetaCol = styled.div<{ $right?: boolean }>`
  ${({ $right }) => $right && 'text-align: right; min-width: 220px;'}
`;
const MetaName = styled.p`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 2px;
`;
const MetaSub = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: 2px;
`;
const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  font-size: 12px;
  margin-bottom: 6px;
`;
const Label = styled.span`
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #999;
  font-weight: 600;
`;
const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  thead tr { border-bottom: 1px solid #111; }
  th {
    padding: 6px 8px;
    font-size: 10.5px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #666;
    font-weight: 600;
    text-align: left;
  }
  td { padding: 10px 8px; }
`;
const Tag = styled.span`
  font-size: 11px;
  color: #999;
  margin-left: 6px;
`;
const Totals = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  margin-top: 8px;
`;
const TotalsRow = styled.div<{ $final?: boolean }>`
  display: flex;
  gap: 40px;
  font-size: ${({ $final }) => ($final ? '15px' : '13px')};
  font-weight: ${({ $final }) => ($final ? '700' : 'normal')};
  padding-top: ${({ $final }) => ($final ? '8px' : '0')};
  border-top: ${({ $final }) => ($final ? '1px solid #e8e8e8' : 'none')};
  margin-top: ${({ $final }) => ($final ? '2px' : '0')};
`;
const Accent = styled.span`
  color: #059669;
`;
const Notes = styled.div`
  margin-top: 32px;
  font-size: 12px;
  color: #555;
  border-left: 3px solid #059669;
  padding-left: 12px;
`;
const Footer = styled.footer`
  margin-top: 48px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  font-size: 11px;
  color: #bbb;
`;

// ─── Component ───────────────────────────────────────────────────────────────

export function DesignA(data: DocumentTemplateData) {
  const { type, number, issueDate, dueDate, notes, subtotal, totalAmount, tenant, customer, items } = data;
  const addr = [tenant.address, tenant.city, tenant.country].filter(Boolean).join(', ');

  return (
    <Page>
      <Header>
        <Brand>
          {tenant.logoUrl && <Logo src={tenant.logoUrl} alt={tenant.name} />}
          <Company>{tenant.name}</Company>
          <CompanySub>{addr}</CompanySub>
          <CompanySub>
            {tenant.phone} · {tenant.email}
          </CompanySub>
        </Brand>
        <BadgeWrap>
          <BadgeType>{typeLabel(type)}</BadgeType>
          <BadgeNum>#{String(number).padStart(4, '0')}</BadgeNum>
        </BadgeWrap>
      </Header>

      <Divider />

      <Meta>
        <MetaCol>
          <Label>Bill To</Label>
          {customer ? (
            <>
              <MetaName>{customer.name}</MetaName>
              {[customer.phone, customer.email, customer.address].filter(Boolean).map((l, i) => (
                <MetaSub key={i}>{l}</MetaSub>
              ))}
            </>
          ) : (
            <MetaSub>—</MetaSub>
          )}
        </MetaCol>
        <MetaCol $right>
          <MetaRow>
            <Label>Issue Date</Label>
            <span>{fmtDate(issueDate)}</span>
          </MetaRow>
          {dueDate && (
            <MetaRow>
              <Label>Due Date</Label>
              <span>{fmtDate(dueDate)}</span>
            </MetaRow>
          )}
          <MetaRow>
            <Label>Type</Label>
            <span>{typeLabel(type)}</span>
          </MetaRow>
        </MetaCol>
      </Meta>

      <Divider />

      <ItemsTable>
        <thead>
          <tr>
            <th style={{ width: 36, textAlign: 'center' }}>#</th>
            <th>Description</th>
            <th style={{ textAlign: 'right', width: 80 }}>Qty</th>
            <th style={{ textAlign: 'right', width: 120 }}>Unit Price</th>
            <th style={{ textAlign: 'right', width: 120 }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={i % 2 !== 0 ? { background: '#fafafa' } : {}}>
              <td style={{ textAlign: 'center', color: '#999' }}>{i + 1}</td>
              <td>
                {item.description}
                {item.supplier && <Tag>· {item.supplier.name}</Tag>}
              </td>
              <td style={{ textAlign: 'right' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right' }}>{fmt(item.unitPrice)}</td>
              <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(item.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </ItemsTable>

      <Divider />

      <Totals>
        <TotalsRow>
          <span style={{ color: '#999' }}>Subtotal</span>
          <span>{fmt(subtotal)}</span>
        </TotalsRow>
        <TotalsRow $final>
          <span>Total Due</span>
          <Accent>{fmt(totalAmount)}</Accent>
        </TotalsRow>
      </Totals>

      {notes && (
        <Notes>
          <Label>Notes — </Label>
          {notes}
        </Notes>
      )}

      <Footer>{tenant.name} · Thank you for your business</Footer>
    </Page>
  );
}
