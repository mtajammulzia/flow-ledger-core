import React from 'react';
import styled from 'styled-components';

interface Props {
  html: string;
  /** 'thumbnail' renders a scaled-down A4 card; 'full' fills the container */
  mode?: 'thumbnail' | 'full';
}

// A4 at 96 dpi ≈ 794 × 1123px
const A4_W = 794;
const A4_H = 1123;
const THUMB_W = 180;
const THUMB_H = Math.round(THUMB_W * (A4_H / A4_W)); // ≈ 254
const THUMB_SCALE = THUMB_W / A4_W;

const ThumbWrap = styled.div`
  width: ${THUMB_W}px;
  height: ${THUMB_H}px;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
`;

const ThumbFrame = styled.iframe`
  width: ${A4_W}px;
  height: ${A4_H}px;
  border: none;
  transform-origin: top left;
  transform: scale(${THUMB_SCALE});
  pointer-events: none;
`;

const FullFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  display: block;
`;

export default function DesignFrame({ html, mode = 'full' }: Props) {
  if (mode === 'thumbnail') {
    return (
      <ThumbWrap>
        <ThumbFrame srcDoc={html} sandbox="allow-same-origin" title="design-thumbnail" />
      </ThumbWrap>
    );
  }

  return <FullFrame srcDoc={html} title="design-preview" />;
}
