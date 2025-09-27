import React from "react";
import styled from "styled-components";

interface HeaderProps {
  onBack?: () => void;
}

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const HeaderInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 24px;
    font-weight: bold;
    color: white;
  }

  button {
    color: rgba(255, 255, 255, 0.8);
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;

    &:hover {
      color: white;
    }
  }
`;

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <HeaderContainer>
      <HeaderInner>
        <h1>SyncTogether</h1>
        {onBack && <button onClick={onBack}>← 홈으로</button>}
      </HeaderInner>
    </HeaderContainer>
  );
};

export default Header;
