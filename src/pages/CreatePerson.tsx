import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";

const Main = styled.main`
  max-width: 500px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px;
`;

const Title = styled.h2`
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 32px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;

  &:focus {
    border-color: #3b82f6;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  background: #3b82f6;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #2563eb;
  }
`;

const SuccessBox = styled.div`
  text-align: center;
  padding: 40px;
`;

const CreatePerson: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [departure, setDeparture] = useState("");
  const [favoritePlace, setFavoritePlace] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // 경로에 따라 역할 결정
  // /create-person?role=member 또는 /create-person?role=leader
  const searchParams = new URLSearchParams(location.search);
  const role = searchParams.get("role") === "member" ? "member" : "leader";

  const title = role === "leader" ? "그룹장 정보 입력" : "그룹원 정보 입력";
  const successMsg = role === "leader" ? "그룹장 정보가 저장되었습니다!" : "그룹원 정보가 저장되었습니다!";


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      alert("닉네임을 입력해주세요!");
      return;
    }
    if (!password.trim()) {
      alert("비밀번호를 입력해주세요!");
      return;
    }
    if (!departure.trim()) {
      alert("출발지를 입력해주세요!");
      return;
    }
    if (!favoritePlace.trim()) {
      alert("선호 지역 입력해주세요!");
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <Main>
        <Card>
          {!submitted ? (
            <>
              <Title>{title}</Title>
              <form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  placeholder="닉네임"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="출발지 ex)경기도, 서울"
                  value={departure}
                  onChange={e => setDeparture(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="선호 지역 ex)경기도, 서울"
                  value={favoritePlace}
                  onChange={e => setFavoritePlace(e.target.value)}
                />
                <Button type="submit">완료</Button>
              </form>
            </>
          ) : (
            <SuccessBox>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎉</div>
              <h3 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "16px" }}>
                {successMsg}
              </h3>
              <Button onClick={() => navigate("/")} style={{ marginTop: "24px" }}>
                홈으로 돌아가기
              </Button>
            </SuccessBox>
          )}
        </Card>
      </Main>
    </>
  );
};

export default CreatePerson;