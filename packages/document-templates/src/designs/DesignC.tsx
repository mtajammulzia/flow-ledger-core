/**
 * Design C — Modern / Left Sidebar
 *
 * Dark coloured left sidebar holding company info & document meta.
 * Clean white content area on the right. Bold and visually distinctive.
 */
import React from 'react';
import styled from 'styled-components';
import type { DocumentTemplateData } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined) => (v == null ? '—' : `PKR ${v.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`);

const fmtDate = (d: Date | null | undefined) => (d ? new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }).format(d) : '—');

const typeLabel = (t: DocumentTemplateData['type']) => ({ QUOTATION: 'Quotation', INVOICE: 'Invoice', CHALLAN: 'Delivery Challan' })[t] ?? t;

// ─── Styled components ───────────────────────────────────────────────────────

const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 13px;
  color: #111827;
`;
const Sidebar = styled.aside`
  width: 220px;
  min-width: 220px;
  background: #1e293b;
  color: #fff;
  padding: 36px 24px;
  display: flex;
  flex-direction: column;
`;
const SidebarTop = styled.div`
  margin-bottom: 8px;
`;
const Logo = styled.img`
  height: 40px;
  border-radius: 6px;
  margin-bottom: 14px;
  display: block;
`;
const LogoPlaceholder = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  background: #334155;
  color: #94a3b8;
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
`;
const SCompany = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: #f8fafc;
  line-height: 1.3;
`;
const SMeta = styled.p`
  font-size: 11px;
  color: #94a3b8;
  margin-top: 3px;
  line-height: 1.5;
`;
const SidebarDivider = styled.hr`
  border: none;
  border-top: 1px solid #334155;
  margin: 20px 0;
`;
const SSection = styled.div`
  margin-bottom: 18px;
`;
const SLabel = styled.div`
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #64748b;
  font-weight: 600;
  margin-bottom: 4px;
`;
const SValue = styled.div<{ $number?: boolean; $due?: boolean }>`
  font-size: ${({ $number }) => ($number ? '18px' : '13px')};
  font-weight: 600;
  color: ${({ $number, $due }) => ($number ? '#7dd3fc' : $due ? '#fbbf24' : '#e2e8f0')};
  ${({ $number }) => $number && 'margin-top: 2px;'}
`;
const SidebarBottom = styled.div`
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid #334155;
`;
const Main = styled.main`
  flex: 1;
  padding: 40px 44px;
  background: #fff;
`;
const MainHeading = styled.div`
  margin-bottom: 28px;
`;
const DocTypeTag = styled.span`
  display: inline-block;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 5px 14px;
  border-radius: 20px;
  border: 1px solid #bfdbfe;
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    padding: 9px 10px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.7px;
    color: #6b7280;
    font-weight: 600;
    border-bottom: 2px solid #e5e7eb;
    text-align: left;
  }
  td {
    padding: 11px 10px;
    border-bottom: 1px solid #f3f4f6;
    vertical-align: top;
  }
`;
const IName = styled.span`
  font-weight: 500;
`;
const ISupplier = styled.div`
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
`;
const Totals = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 20px;
  gap: 6px;
`;
const TotRow = styled.div<{ $final?: boolean }>`
  display: flex;
  gap: 40px;
  font-size: ${({ $final }) => ($final ? '15px' : '13px')};
  font-weight: ${({ $final }) => ($final ? '700' : 'normal')};
  color: ${({ $final }) => ($final ? '#111827' : '#6b7280')};
  ${({ $final }) => $final && 'margin-top: 8px; padding-top: 10px; border-top: 2px solid #e5e7eb;'}
`;
const TotVal = styled.span<{ $final?: boolean }>`
  min-width: 130px;
  text-align: right;
  font-weight: ${({ $final }) => ($final ? '800' : '500')};
  font-size: ${({ $final }) => ($final ? '18px' : '13px')};
  color: ${({ $final }) => ($final ? '#1d4ed8' : '#374151')};
`;
const NotesBox = styled.div`
  margin-top: 28px;
  font-size: 12px;
  color: #6b7280;
  padding: 12px 14px;
  background: #f9fafb;
  border-radius: 6px;
`;
const Footer = styled.div`
  margin-top: 48px;
  font-size: 11px;
  color: #d1d5db;
  text-align: right;
`;

// ─── Component ───────────────────────────────────────────────────────────────

export function DesignC(data: DocumentTemplateData) {
  const { type, number, issueDate, dueDate, notes, subtotal, totalAmount, tenant, customer, items } = data;
  const addr = [tenant.address, tenant.city, tenant.country].filter(Boolean).join(', ');

  return (
    <Layout>
      <Sidebar>
        <SidebarTop>
          {tenant.logoUrl ? <Logo src={tenant.logoUrl} alt={tenant.name} /> : <LogoPlaceholder>{tenant.name.slice(0, 2).toUpperCase()}</LogoPlaceholder>}
          <SCompany>{tenant.name}</SCompany>
          {addr && <SMeta>{addr}</SMeta>}
          <SMeta>{tenant.phone}</SMeta>
          <SMeta>{tenant.email}</SMeta>
        </SidebarTop>

        <SidebarDivider />

        <SSection>
          <SLabel>Document</SLabel>
          <SValue>{typeLabel(type)}</SValue>
          <SValue $number>#{String(number).padStart(4, '0')}</SValue>
        </SSection>

        <SSection>
          <SLabel>Issued</SLabel>
          <SValue>{fmtDate(issueDate)}</SValue>
        </SSection>

        {dueDate && (
          <SSection>
            <SLabel>Due</SLabel>
            <SValue $due>{fmtDate(dueDate)}</SValue>
          </SSection>
        )}

        <SidebarBottom>
          <SSection>
            <SLabel>Bill To</SLabel>
            {customer ? (
              <>
                <SValue>{customer.name}</SValue>
                {[customer.phone, customer.email, customer.address].filter(Boolean).map((l, i) => (
                  <SMeta key={i}>{l}</SMeta>
                ))}
              </>
            ) : (
              <SValue>—</SValue>
            )}
          </SSection>
        </SidebarBottom>
      </Sidebar>

      <Main>
        <MainHeading>
          <DocTypeTag>{typeLabel(type)}</DocTypeTag>
        </MainHeading>

        <Table>
          <thead>
            <tr>
              <th style={{ textAlign: 'center', width: 36 }}>#</th>
              <th>Item</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Rate</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i}>
                <td style={{ textAlign: 'center', color: '#d1d5db', fontSize: 12 }}>{i + 1}</td>
                <td>
                  <IName>{item.description}</IName>
                  {item.supplier && <ISupplier>{item.supplier.name}</ISupplier>}
                </td>
                <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{fmt(item.unitPrice)}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Totals>
          <TotRow>
            <span>Subtotal</span>
            <TotVal>{fmt(subtotal)}</TotVal>
          </TotRow>
          <TotRow $final>
            <span>Total</span>
            <TotVal $final>{fmt(totalAmount)}</TotVal>
          </TotRow>
        </Totals>

        {notes && (
          <NotesBox>
            <strong>Notes: </strong>
            {notes}
          </NotesBox>
        )}

        <Footer>Thank you for your business.</Footer>
      </Main>
    </Layout>
  );
}
