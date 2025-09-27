import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px #eee;
  background: #fff;
`;

const Title = styled.h2`
  text-align: center;
  color: #1976d2;
  margin-bottom: 8px;
`;

const Desc = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 24px;
`;

const TimeInputRow = styled.div`
  display: flex;
  gap: 8px;
  margin: 16px 0;
`;

const TimeInput = styled.input`
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const AddButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  background: #1976d2;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const TimeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const TimeItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const RemoveButton = styled.button`
  margin-left: 8px;
  background: none;
  border: none;
  color: #d32f2f;
  cursor: pointer;
`;

const ConfirmButton = styled.button<{disabled: boolean}>`
  width: 100%;
  padding: 12px 0;
  border-radius: 4px;
  background: ${({disabled}) => (disabled ? "#ccc" : "#388e3c")};
  color: #fff;
  border: none;
  margin-top: 16px;
  font-weight: bold;
  cursor: ${({disabled}) => (disabled ? "not-allowed" : "pointer")};
`;

const Home = () => {
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [inputTime, setInputTime] = useState("");

  const handleAddTime = () => {
    if (inputTime && !selectedTimes.includes(inputTime)) {
      setSelectedTimes([...selectedTimes, inputTime]);
      setInputTime("");
    }
  };

  const handleRemoveTime = (time: string) => {
    setSelectedTimes(selectedTimes.filter((t) => t !== time));
  };

  const handleConfirm = () => {
    alert(`선택된 시간: ${selectedTimes.map(t => new Date(t).toLocaleString()).join(", ")}`);
  };

  return (
    <Container>
      <Title>모임 시간 선택</Title>
      <Desc>
        참여 가능한 시간을 선택해 주세요.<br />
        여러 시간 선택이 가능합니다.
      </Desc>
      <TimeInputRow>
        <TimeInput
          type="datetime-local"
          value={inputTime}
          onChange={e => setInputTime(e.target.value)}
        />
        <AddButton onClick={handleAddTime}>추가</AddButton>
      </TimeInputRow>
      <TimeList>
        {selectedTimes.map(time => (
          <TimeItem key={time}>
            <span style={{ flex: 1 }}>{new Date(time).toLocaleString()}</span>
            <RemoveButton onClick={() => handleRemoveTime(time)}>삭제</RemoveButton>
          </TimeItem>
        ))}
      </TimeList>
      <ConfirmButton
        onClick={handleConfirm}
        disabled={selectedTimes.length === 0}
      >
        약속 확정하기
      </ConfirmButton>
    </Container>
  );
};

export default Home;