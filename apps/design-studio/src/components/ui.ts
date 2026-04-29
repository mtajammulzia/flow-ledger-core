/**
 * Shared styled primitives used across the design-studio pages.
 */
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

// ─── Button ──────────────────────────────────────────────────────────────────

const btnBase = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  text-decoration: none;
  transition: background 0.15s, border-color 0.15s;
  white-space: nowrap;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const BtnPrimary = styled.button`
  ${btnBase}
  background: #2563eb;
  color: #fff;
  &:hover { background: #1d4ed8; }
`;

export const BtnGhost = styled.button`
  ${btnBase}
  background: transparent;
  border-color: #e2e8f0;
  color: #0f172a;
  &:hover { background: #f1f5f9; }
`;

export const BtnPrimaryLink = styled(Link)`
  ${btnBase}
  background: #2563eb;
  color: #fff;
  &:hover { background: #1d4ed8; }
`;

export const BtnGhostLink = styled(Link)`
  ${btnBase}
  background: transparent;
  border-color: #e2e8f0;
  color: #0f172a;
  &:hover { background: #f1f5f9; }
`;

export const BtnSm = css`
  padding: 5px 12px;
  font-size: 12px;
`;

// ─── Page scaffold ────────────────────────────────────────────────────────────

export const PageHeader = styled.div`
  margin-bottom: 24px;
`;

export const PageTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
`;

export const PageSubtitle = styled.p`
  color: #64748b;
  font-size: 13px;
  margin-top: 4px;
`;
