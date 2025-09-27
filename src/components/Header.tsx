import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const HeaderContainer = styled.header`
  height: 60px;
  display: flex;
  justify-component: center;
  background: rgba(255, 255, 255, 1);
  border-bottom: 1px solid rgba(35, 33, 33, 0.2);
`;

const HeaderInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor:pointer;

  h1 {
    font-size: 24px;
    font-weight: bold;
    color: black;
    
    &:hover {
      color: #348224ff;
    }
  }
`;

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <HeaderContainer>
      <HeaderInner>
        <h1 onClick={() => navigate("/")}>SyncTogether</h1>
      </HeaderInner>
    </HeaderContainer>
  );
};

export default Header;
