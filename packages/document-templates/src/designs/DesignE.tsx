/**
 * Design E — Compact B&W
 *
 * - Black and white only, tight spacing
 * - Two bordered boxes at the top: From (tenant) | To (customer)
 * - Compact items table
 * - T&C + signature block pinned to the bottom of the first page
 */
import React from 'react';
import styled from 'styled-components';
import type { DocumentTemplateData } from '../types';

// ─── Helpers ────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined) => (v == null ? '—' : `PKR ${v.toLocaleString('en-PK', { minimumFractionDigits: 2 })}`);

const fmtDate = (d: Date | null | undefined) => (d ? new Intl.DateTimeFormat('en-PK', { day: '2-digit', month: 'short', year: 'numeric' }).format(d) : '—');

const typeLabel = (t: DocumentTemplateData['type']) => ({ QUOTATION: 'Quotation', INVOICE: 'Invoice', CHALLAN: 'Delivery Challan' })[t] ?? t;

// ─── Styled components ───────────────────────────────────────────────────────

/** Outer flex column, fills A4 height so bottom section pins to bottom */
const Page = styled.div`
  font-family: 'Segoe UI', Arial, sans-serif;
  font-size: 12px;
  color: #000;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 14mm 16mm;
  display: flex;
  flex-direction: column;
  @media print { margin: 0; padding: 14mm 16mm; }
`;
const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 2px solid #000;
  padding-bottom: 6px;
  margin-bottom: 10px;
`;
const DocType = styled.span`
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 1.5px;
`;
const DocMeta = styled.span`
  font-size: 11px;
  color: #333;
`;
const TopBoxes = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 14px;
`;
const InfoBox = styled.div`
  border: 1px solid #000;
  padding: 10px 12px;
`;
const BoxHeading = styled.div`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #000;
  padding-bottom: 4px;
  margin-bottom: 6px;
`;
const LogoImg = styled.img`
  height: 32px;
  display: block;
  margin-bottom: 6px;
`;
const InfoName = styled.div`
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 3px;
`;
const InfoLine = styled.div`
  font-size: 11px;
  color: #333;
  margin-top: 2px;
  line-height: 1.4;
`;
const Content = styled.div`
  flex: 1;
`;
const ItemsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
  thead tr { background: #000; color: #fff; }
  th {
    padding: 6px 8px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    text-align: left;
  }
  td {
    padding: 6px 8px;
    border-bottom: 1px solid #ddd;
    vertical-align: top;
    line-height: 1.4;
  }
`;
const SupplierSpan = styled.span`
  font-size: 10px;
  color: #555;
`;
const Totals = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
  margin-bottom: 12px;
`;
const TotRow = styled.div<{ $final?: boolean }>`
  display: flex;
  gap: 32px;
  font-size: ${({ $final }) => ($final ? '13px' : '12px')};
  font-weight: ${({ $final }) => ($final ? '700' : 'normal')};
  color: ${({ $final }) => ($final ? '#000' : '#444')};
  padding: ${({ $final }) => ($final ? '4px 0 0' : '2px 0')};
  border-top: ${({ $final }) => ($final ? '2px solid #000' : 'none')};
  margin-top: ${({ $final }) => ($final ? '2px' : '0')};
  span:last-child { min-width: 120px; text-align: right; }
`;
const NotesBox = styled.div`
  font-size: 11px;
  color: #444;
  margin-bottom: 12px;
  padding: 6px 10px;
  border-left: 2px solid #000;
`;
const NotesLabel = styled.span`
  font-weight: 700;
`;
const BottomSection = styled.div`
  margin-top: auto;
  padding-top: 12px;
  border-top: 2px solid #000;
  page-break-inside: avoid;
`;
const BottomHeading = styled.div`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 5px;
`;
const TcList = styled.ol`
  list-style: decimal;
  padding-left: 16px;
  margin-bottom: 16px;
  li {
    font-size: 9px;
    color: #444;
    line-height: 1.5;
    margin-bottom: 2px;
  }
`;
const SigRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
`;
const SigBlock = styled.div``;
const SigLine = styled.div`
  border-bottom: 1px solid #000;
  height: 28px;
  margin-bottom: 5px;
`;
const SigLabelText = styled.div`
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #555;
  font-weight: 600;
`;
const SigName = styled.div`
  font-size: 10px;
  color: #333;
  margin-top: 2px;
`;

// ─── Component ───────────────────────────────────────────────────────────────

export function DesignE(data: DocumentTemplateData) {
  const { type, number, issueDate, dueDate, subtotal, totalAmount, tenant, customer, items } = data;

  const showNotes = data.config?.showNotes ?? true;
  const showTerms = data.config?.showTerms ?? true;
  const showSignatures = data.config?.showSignatures ?? true;
  const notes = showNotes ? data.notes : null;
  const terms = data.config?.terms ?? [
    'Payment is due within 30 days of the invoice date unless otherwise agreed in writing.',
    'Goods remain the property of the seller until full payment is received.',
    'Any disputes must be raised within 7 days of receipt of goods or services.',
    'Late payments may attract an interest charge of 2% per month on the outstanding amount.',
  ];

  const tenantAddr = [tenant.address, tenant.city, tenant.country].filter(Boolean).join(', ');

  return (
    <Page>
      <TitleRow>
        <DocType>{typeLabel(type).toUpperCase()}</DocType>
        <DocMeta>
          No.&nbsp;<strong>{String(number).padStart(4, '0')}</strong>
          &nbsp;&nbsp;|&nbsp;&nbsp;Date:&nbsp;<strong>{fmtDate(issueDate)}</strong>
          {dueDate && (
            <>
              &nbsp;&nbsp;|&nbsp;&nbsp;Due:&nbsp;<strong>{fmtDate(dueDate)}</strong>
            </>
          )}
        </DocMeta>
      </TitleRow>

      <TopBoxes>
        <InfoBox>
          <BoxHeading>From</BoxHeading>
          {tenant.logoUrl && <LogoImg src={tenant.logoUrl} alt={tenant.name} />}
          <InfoName>{tenant.name}</InfoName>
          {tenantAddr && <InfoLine>{tenantAddr}</InfoLine>}
          <InfoLine>{tenant.phone}</InfoLine>
          <InfoLine>{tenant.email}</InfoLine>
        </InfoBox>
        <InfoBox>
          <BoxHeading>To</BoxHeading>
          {customer ? (
            <>
              <InfoName>{customer.name}</InfoName>
              {customer.address && <InfoLine>{customer.address}</InfoLine>}
              {customer.phone && <InfoLine>{customer.phone}</InfoLine>}
              {customer.email && <InfoLine>{customer.email}</InfoLine>}
            </>
          ) : (
            <InfoLine>—</InfoLine>
          )}
        </InfoBox>
      </TopBoxes>

      <Content>
        <ItemsTable>
          <thead>
            <tr>
              <th style={{ textAlign: 'center', width: 32 }}>#</th>
              <th>Description</th>
              <th style={{ textAlign: 'right' }}>Qty</th>
              <th style={{ textAlign: 'right' }}>Unit Price</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={i % 2 !== 0 ? { background: '#f5f5f5' } : {}}>
                <td style={{ textAlign: 'center', color: '#777', fontSize: 11 }}>{i + 1}</td>
                <td>
                  {item.description}
                  {item.supplier && <SupplierSpan> · {item.supplier.name}</SupplierSpan>}
                </td>
                <td style={{ textAlign: 'right' }}>{item.quantity}</td>
                <td style={{ textAlign: 'right' }}>{fmt(item.unitPrice)}</td>
                <td style={{ textAlign: 'right', fontWeight: 600 }}>{fmt(item.totalPrice)}</td>
              </tr>
            ))}
          </tbody>
        </ItemsTable>

        <Totals>
          <TotRow>
            <span>Subtotal</span>
            <span>{fmt(subtotal)}</span>
          </TotRow>
          <TotRow $final>
            <span>Total Due</span>
            <span>{fmt(totalAmount)}</span>
          </TotRow>
        </Totals>

        {notes && (
          <NotesBox>
            <NotesLabel>Notes: </NotesLabel>
            {notes}
          </NotesBox>
        )}
      </Content>

      {(showTerms || showSignatures) && (
        <BottomSection>
          {showTerms && (
            <div>
              <BottomHeading>Terms &amp; Conditions</BottomHeading>
              <TcList>
                {terms.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </TcList>
            </div>
          )}

          {showSignatures && (
            <SigRow>
              <SigBlock>
                <SigLine />
                <SigLabelText>Authorised Signature</SigLabelText>
                <SigName>{tenant.name}</SigName>
              </SigBlock>
              <SigBlock>
                <SigLine />
                <SigLabelText>Received / Accepted By</SigLabelText>
                <SigName>{customer?.name ?? ''}</SigName>
              </SigBlock>
              <SigBlock>
                <SigLine />
                <SigLabelText>Date</SigLabelText>
                <SigName>&nbsp;</SigName>
              </SigBlock>
            </SigRow>
          )}
        </BottomSection>
      )}
    </Page>
  );
}
