import React from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Gallery from './pages/Gallery';
import Preview from './pages/Preview';
import Workshop from './pages/Workshop';

// ─── Layout ──────────────────────────────────────────────────────────────────

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Navbar = styled.nav`
  height: 52px;
  background: #0f172a;
  display: flex;
  align-items: center;
  padding: 0 24px;
  flex-shrink: 0;
`;

const Brand = styled.span`
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.2px;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 4px;
  margin-left: auto;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? '#fff' : '#94a3b8')};
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  background: ${({ $active }) => ($active ? '#2563eb' : 'transparent')};
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${({ $active }) => ($active ? '#2563eb' : '#1e293b')};
    color: #fff;
  }
`;

const AppMain = styled.main`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

// ─── Component ───────────────────────────────────────────────────────────────

export default function App() {
  const { pathname } = useLocation();

  const navItems = [
    { to: '/', label: 'Gallery' },
    { to: '/preview/E', label: 'Preview' },
    { to: '/workshop/E', label: 'Workshop' },
  ];

  return (
    <Shell>
      <Navbar>
        <Brand>Flow Ledger · Design Studio</Brand>
        <NavLinks>
          {navItems.map(({ to, label }) => (
            <NavLink key={to} to={to} $active={pathname === to || (to !== '/' && pathname.startsWith(to.split('/').slice(0, 2).join('/')))}>
              {label}
            </NavLink>
          ))}
        </NavLinks>
      </Navbar>

      <AppMain>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/preview/:key" element={<Preview />} />
          <Route path="/workshop/:key" element={<Workshop />} />
        </Routes>
      </AppMain>
    </Shell>
  );
}
