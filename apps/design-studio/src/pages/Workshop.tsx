import type { DesignKey, DocumentTemplateData } from '@flow-ledger/document-templates';
import { DESIGNS, designRegistry, renderDesign } from '@flow-ledger/document-templates';
import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import DesignFrame from '../components/DesignFrame';
import { BtnGhost } from '../components/ui';
import { mockData } from '../mockData';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dataToJson(data: DocumentTemplateData): string {
  return JSON.stringify(data, null, 2);
}

function jsonToData(text: string): DocumentTemplateData | null {
  try {
    const parsed = JSON.parse(text);
    if (parsed.issueDate) parsed.issueDate = new Date(parsed.issueDate);
    if (parsed.dueDate) parsed.dueDate = parsed.dueDate ? new Date(parsed.dueDate) : null;
    return parsed as DocumentTemplateData;
  } catch {
    return null;
  }
}

// ─── Styled components ───────────────────────────────────────────────────────

const WorkshopLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const Topbar = styled.div`
  height: 48px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  gap: 16px;
`;

const TopbarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TopbarLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DesignSelect = styled.select`
  font-size: 13px;
  font-weight: 500;
  padding: 5px 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  color: #0f172a;
`;

const Split = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const EditorPane = styled.div`
  width: 42%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #e2e8f0;
`;

const PreviewPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const PaneHeader = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  background: #1e293b;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
`;

const StatusOk = styled.span`
  color: #86efac;
  font-size: 11px;
`;

const StatusErr = styled.span`
  color: #fca5a5;
  font-size: 11px;
`;

const JsonEditor = styled.textarea`
  flex: 1;
  width: 100%;
  padding: 14px;
  font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace;
  font-size: 12px;
  line-height: 1.6;
  background: #0f172a;
  color: #e2e8f0;
  border: none;
  resize: none;
  outline: none;
`;

const EditorHint = styled.div`
  padding: 8px 14px;
  font-size: 11px;
  color: #64748b;
  background: #fff;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
  code {
    background: #f1f5f9;
    padding: 1px 4px;
    border-radius: 3px;
    font-family: monospace;
    font-size: 10px;
  }
`;

const PreviewFrame = styled.div`
  flex: 1;
  background: #e2e8f0;
  overflow: auto;
`;

const SmBtnGhost = styled(BtnGhost)`
  padding: 5px 12px;
  font-size: 12px;
`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function Workshop() {
  const { key = 'E' } = useParams<{ key: string }>();
  const navigate = useNavigate();
  const activeKey = (DESIGNS.includes(key as DesignKey) ? key : 'E') as DesignKey;

  const [jsonText, setJsonText] = useState(() => dataToJson(mockData));
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [liveData, setLiveData] = useState<DocumentTemplateData>(mockData);

  const handleJsonChange = useCallback((text: string) => {
    setJsonText(text);
    const parsed = jsonToData(text);
    if (parsed) {
      setLiveData(parsed);
      setJsonError(null);
    } else {
      setJsonError('Invalid JSON');
    }
  }, []);

  const html = renderDesign(activeKey, liveData);

  const resetData = () => {
    setJsonText(dataToJson(mockData));
    setLiveData(mockData);
    setJsonError(null);
  };

  const activeEntry = designRegistry.find((e) => e.key === activeKey);

  return (
    <WorkshopLayout>
      <Topbar>
        <TopbarLeft>
          <TopbarLabel>Design</TopbarLabel>
          <DesignSelect value={activeKey} onChange={(e) => navigate(`/workshop/${e.target.value}`)}>
            {designRegistry.map(({ key: k, label }) => (
              <option key={k} value={k}>
                {k} — {label}
              </option>
            ))}
          </DesignSelect>
        </TopbarLeft>
        <SmBtnGhost onClick={resetData}>Reset Data</SmBtnGhost>
      </Topbar>

      <Split>
        <EditorPane>
          <PaneHeader>
            <span>Mock Data (JSON)</span>
            {jsonError ? <StatusErr>{jsonError}</StatusErr> : <StatusOk>✓ Valid</StatusOk>}
          </PaneHeader>
          <JsonEditor value={jsonText} onChange={(e) => handleJsonChange(e.target.value)} spellCheck={false} autoCorrect="off" autoCapitalize="off" />
          <EditorHint>
            Edit any field — the preview updates live. Dates are ISO strings (e.g. <code>&quot;2026-04-28T00:00:00.000Z&quot;</code>).
          </EditorHint>
        </EditorPane>

        <PreviewPane>
          <PaneHeader>
            <span>
              Live Preview — Design {activeKey} · {activeEntry?.label}
            </span>
          </PaneHeader>
          <PreviewFrame>
            <DesignFrame html={html} mode="full" />
          </PreviewFrame>
        </PreviewPane>
      </Split>
    </WorkshopLayout>
  );
}
