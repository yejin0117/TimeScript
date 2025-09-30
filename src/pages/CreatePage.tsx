import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GroupsApi } from "../api/groups";
import { toOffsetDateTime } from "../utils/time";
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

const Select = styled.select`
  width: 100%;
  padding: 12px;
  margin-bottom: 8px;
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

const Label = styled.div`
  font-weight: bold;
  margin-bottom: 8px;
`;

const DateTimeContainer = styled.div`
  display: flex;
  gap: 8px; // 날짜와 시간 사이 간격
  margin-bottom: 16px;
`;

const SuccessBox = styled.div`
  text-align: center;
  padding: 40px;
`;

// ...existing code...
const CreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventReason, setEventReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [date, setDate] = useState(""); // 날짜
  const [time, setTime] = useState(""); // 시간

  const handleReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEventReason(e.target.value);
    if (e.target.value !== "직접입력") {
      setCustomReason("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = eventReason === "직접입력" ? customReason : eventReason;

    if (!eventName.trim()) {
      alert("약속 이름을 입력해주세요!");
      return;
    }
    if (!finalReason.trim()) {
      alert("모이는 이유를 선택하거나 입력해주세요!");
      return;
    }
    if (!date || !time) {
      alert("약속 날짜와 시간을 입력해주세요!");
      return;
    }

    try {
      const responseDeadline = toOffsetDateTime(date, time, 540);
      const { groupId, inviteCode } = await GroupsApi.createGroupSimple({
        name: eventName,
        reason: finalReason,
        responseDeadline,
      });
      localStorage.setItem("groupId", String(groupId));
      localStorage.setItem("inviteCode", inviteCode);
      navigate("/createPerson?role=leader");
    } catch (e: any) {
      alert(e.message || "그룹 생성 실패");
    }

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
                <Select value={eventReason} onChange={handleReasonChange}>
                  <option value="">모이는 이유를 선택하세요</option>
                  <option value="직접입력">직접입력</option>
                  <option value="가족행사">가족행사</option>
                  <option value="과제">과제</option>
                  <option value="데이트">데이트</option>
                  <option value="모임">모임</option>
                  <option value="스터디">스터디</option>
                  <option value="생일파티">생일파티</option>
                  <option value="영화">영화</option>
                  <option value="운동">운동</option>
                  <option value="회식">회식</option>
                  <option value="회의">회의</option>
                </Select>
                {eventReason === "직접입력" && (
                  <Input
                    type="text"
                    placeholder="모이는 이유를 직접 입력하세요"
                    value={customReason}
                    onChange={e => setCustomReason(e.target.value)}
                  />
                )}

                {/* 날짜와 시간 입력 */}
                <Label>응답 기한</Label>
                <DateTimeContainer>
                  <Input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                  />
                  <Input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                  />
                </DateTimeContainer>

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
