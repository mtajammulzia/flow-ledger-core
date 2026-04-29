import type { DesignConfig, DesignKey } from '@flow-ledger/document-templates';
import { DESIGNS, designRegistry, renderDesign } from '@flow-ledger/document-templates';
import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import DesignFrame from '../components/DesignFrame';
import { BtnGhostLink, BtnPrimaryLink, BtnSm } from '../components/ui';
import { mockData } from '../mockData';

// ─── Styled components ───────────────────────────────────────────────────────

const Layout = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  height: 100%;
`;

const Sidebar = styled.aside`
  width: 220px;
  min-width: 220px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const SidebarSection = styled.div<{ $bottom?: boolean }>`
  padding: 16px;
  border-bottom: ${({ $bottom }) => ($bottom ? 'none' : '1px solid #e2e8f0')};
  border-top: ${({ $bottom }) => ($bottom ? '1px solid #e2e8f0' : 'none')};
  ${({ $bottom }) => $bottom && 'margin-top: auto; display: flex; flex-direction: column; gap: 8px;'}
`;

const SidebarHeading = styled.div`
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #64748b;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ConfigBadge = styled.span`
  font-size: 9px;
  background: #fef3c7;
  color: #92400e;
  padding: 1px 6px;
  border-radius: 20px;
  text-transform: none;
  letter-spacing: 0;
  font-weight: 600;
`;

const DesignListBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: ${({ $active }) => ($active ? '#eff6ff' : 'transparent')};
  border-radius: 6px;
  cursor: pointer;
  text-align: left;
  margin-bottom: 2px;
  transition: background 0.12s;
  &:hover { background: ${({ $active }) => ($active ? '#eff6ff' : '#f1f5f9')}; }
`;

const DliKey = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #2563eb;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DliLabel = styled.span`
  font-size: 12px;
  color: #0f172a;
  margin-top: 1px;
`;

const ToggleRow = styled.label<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  margin-bottom: 8px;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.4 : 1)};
  input { accent-color: #2563eb; }
`;

const PreviewMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Toolbar = styled.div`
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
`;

const ToolbarLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
`;

const FrameWrap = styled.div`
  flex: 1;
  background: #e2e8f0;
  padding: 16px;
  overflow: auto;
  display: flex;
  justify-content: center;
  iframe { box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15); }
`;

const SmGhostLink = styled(BtnGhostLink)`${BtnSm}`;
const FullPrimaryLink = styled(BtnPrimaryLink)`width: 100%; justify-content: center;`;
const FullGhostLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  background: transparent;
  text-decoration: none;
  &:hover { background: #f1f5f9; }
`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function Preview() {
  const { key = 'A' } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const activeKey = (DESIGNS.includes(key as DesignKey) ? key : 'A') as DesignKey;

  const [config, setConfig] = useState<DesignConfig>({
    showSignatures: true,
    showTerms: true,
    showNotes: true,
  });

  const html = renderDesign(activeKey, { ...mockData, config });

  const toggle = (flag: keyof DesignConfig) => setConfig((prev) => ({ ...prev, [flag]: !prev[flag] }));

  const isConfigSupported = activeKey === 'E';
  const activeEntry = designRegistry.find((e) => e.key === activeKey);

  return (
    <Layout>
      <Sidebar>
        <SidebarSection>
          <SidebarHeading>Designs</SidebarHeading>
          {designRegistry.map(({ key: k, label }) => (
            <DesignListBtn key={k} $active={k === activeKey} onClick={() => navigate(`/preview/${k}`)}>
              <DliKey>Design {k}</DliKey>
              <DliLabel>{label}</DliLabel>
            </DesignListBtn>
          ))}
        </SidebarSection>

        <SidebarSection>
          <SidebarHeading>
            Section Config
            {!isConfigSupported && <ConfigBadge>Design E only</ConfigBadge>}
          </SidebarHeading>
          <ToggleRow $disabled={!isConfigSupported}>
            <input type="checkbox" checked={config.showNotes ?? true} onChange={() => toggle('showNotes')} disabled={!isConfigSupported} />
            Notes
          </ToggleRow>
          <ToggleRow $disabled={!isConfigSupported}>
            <input type="checkbox" checked={config.showTerms ?? true} onChange={() => toggle('showTerms')} disabled={!isConfigSupported} />
            Terms &amp; Conditions
          </ToggleRow>
          <ToggleRow $disabled={!isConfigSupported}>
            <input type="checkbox" checked={config.showSignatures ?? true} onChange={() => toggle('showSignatures')} disabled={!isConfigSupported} />
            Signature Lines
          </ToggleRow>
        </SidebarSection>

        <SidebarSection $bottom>
          <SidebarHeading>Actions</SidebarHeading>
          <FullPrimaryLink to={`/workshop/${activeKey}`}>Open in Workshop</FullPrimaryLink>
          <FullGhostLink href={`http://localhost:3000/documents/PREVIEW_ID/pdf?design=${activeKey}`} target="_blank" rel="noreferrer">
            Generate PDF via API ↗
          </FullGhostLink>
        </SidebarSection>
      </Sidebar>

      <PreviewMain>
        <Toolbar>
          <ToolbarLabel>
            Design {activeKey} · {activeEntry?.label}
          </ToolbarLabel>
          <SmGhostLink to="/">← Gallery</SmGhostLink>
        </Toolbar>
        <FrameWrap>
          <DesignFrame html={html} mode="full" />
        </FrameWrap>
      </PreviewMain>
    </Layout>
  );
}
