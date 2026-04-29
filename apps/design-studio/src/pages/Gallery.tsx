import { designRegistry, renderDesign } from '@flow-ledger/document-templates';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import DesignFrame from '../components/DesignFrame';
import { BtnGhostLink, BtnPrimaryLink, BtnSm, PageHeader, PageSubtitle, PageTitle } from '../components/ui';
import { mockData } from '../mockData';

// ─── Styled components ───────────────────────────────────────────────────────

const GalleryPage = styled.div`
  padding: 28px 32px;
  overflow-y: auto;
  height: 100%;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.2s, border-color 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
  }
`;

const ThumbWrap = styled.div`
  padding: 12px;
  background: #f8fafc;
`;

const CardFooter = styled.div`
  padding: 12px 14px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const CardKey = styled.span`
  display: block;
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CardLabel = styled.span`
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-top: 2px;
`;

const CardActions = styled.div`
  display: flex;
  gap: 6px;
`;

const SmGhostLink = styled(BtnGhostLink)`${BtnSm}`;
const SmPrimaryLink = styled(BtnPrimaryLink)`${BtnSm}`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function Gallery() {
  const previews = useMemo(() => designRegistry.map(({ key, label }) => ({ key, label, html: renderDesign(key, mockData) })), []);

  return (
    <GalleryPage>
      <PageHeader>
        <PageTitle>Document Designs</PageTitle>
        <PageSubtitle>
          {designRegistry.length} designs available · using seed data from <em>Karachi General Traders</em>
        </PageSubtitle>
      </PageHeader>

      <Grid>
        {previews.map(({ key, label, html }) => (
          <Card key={key}>
            <Link to={`/preview/${key}`} style={{ display: 'block' }}>
              <ThumbWrap>
                <DesignFrame html={html} mode="thumbnail" />
              </ThumbWrap>
            </Link>
            <CardFooter>
              <div>
                <CardKey>Design {key}</CardKey>
                <CardLabel>{label}</CardLabel>
              </div>
              <CardActions>
                <SmGhostLink to={`/preview/${key}`}>Preview</SmGhostLink>
                <SmPrimaryLink to={`/workshop/${key}`}>Edit</SmPrimaryLink>
              </CardActions>
            </CardFooter>
          </Card>
        ))}
      </Grid>
    </GalleryPage>
  );
}
