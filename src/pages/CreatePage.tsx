import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";

const Main = styled.main`
  max-width: 600px;
  margin: 0 auto;
  padding: 48px 24px;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  padding: 32px;
`;

const Title = styled.h2`
  font-size: 32px;
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

const Textarea = styled.textarea`
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

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
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

const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [eventName, setEventName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) {
      alert("약속 이름을 입력해주세요!");
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <Header/>
      <Main>
        <Card>
          {!submitted ? (
            <>
              <Title>새 약속 만들기</Title>
              <form onSubmit={handleSubmit}>
                <Input
                  type="text"
                  placeholder="약속 이름"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
                <Textarea placeholder="설명 (선택사항)" rows={3} />

                <Select>
                  <option>오전 (9:00 - 12:00)</option>
                  <option>오후 (13:00 - 18:00)</option>
                  <option>저녁 (19:00 - 22:00)</option>
                  <option>종일</option>
                </Select>

                <Button type="submit">약속 만들기</Button>
              </form>
            </>
          ) : (
            <SuccessBox>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
              <h3 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>
                약속이 생성되었습니다!
              </h3>
              <p>친구들에게 공유할 링크: <strong>synctogether.com/abc123</strong></p>
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

export default CreatePage;
