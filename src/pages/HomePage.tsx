import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Card from "../components/Card";
import Header from "../components/Header";

const Container = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 50px 24px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 48px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 16px;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: rgba(0, 0, 0, 0.8);
  margin-bottom: 48px;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 32px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  justify-items: center;
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
    <Header/>
    <Container>
      <Title>
        함께하는 시간을
        <br />
        쉽게 정해보세요
      </Title>
      <Subtitle>SyncTogether로 친구들과 완벽한 약속 시간을 찾아보세요</Subtitle>

      <CardGrid>
        <Card
          icon="📅"
          title="약속 잡기"
          description="새로운 약속을 만들고 친구들을 초대해보세요"
          buttonText="시작하기"
          color="#3b82f6"
          onClick={() => navigate("/create")}
        />
        <Card
          icon="🔍"
          title="내 약속 그룹 찾기"
          description="기존 약속 그룹에 참여하거나 확인해보세요"
          buttonText="찾아보기"
          color="#8b5cf6"
          onClick={() => navigate("/groupFind")}
        />
      </CardGrid>
    </Container>
    </>
  );
};

export default HomePage;
