import React from 'react';
import styled from 'styled-components';

const NavContainer = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
`;

const LogoIcon = styled.span`
  font-size: 2rem;
  animation: bounce 2s infinite;
`;

const Tagline = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 400;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Navbar = () => {
  return (
    <NavContainer>
      <NavContent>
        <Logo>
          <LogoIcon>🧠</LogoIcon>
          QuizTime
        </Logo>
        <Tagline>AI-Powered Quiz Generator</Tagline>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar;
