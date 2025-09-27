import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // 추가

interface Group {
  id: number;
  name: string;
  inviteCode: string;
}

const mockGroups: Group[] = [
  { id: 1, name: "친구모임", inviteCode: "ABC123" },
  { id: 2, name: "스터디그룹", inviteCode: "STUDY22" },
  { id: 3, name: "동아리모임", inviteCode: "CLUB99" },
];

const FindPage: React.FC = () => {
  const [groupName, setGroupName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [foundGroup, setFoundGroup] = useState<Group | null>(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // 추가

  const handleSearch = () => {
    const group = mockGroups.find(
      (g) =>
        g.name === groupName.trim() && g.inviteCode === inviteCode.trim()
    );

    if (group) {
      setFoundGroup(group);
      setMessage("");
    } else {
      setFoundGroup(null);
      setMessage("해당 그룹을 찾을 수 없습니다.");
    }
  };

  const handleJoin = () => {
    // 그룹원 정보 입력 페이지로 이동
    navigate("/createPerson?role=member");
  };

  return (
    <Container>
      <h2>그룹 찾기</h2>

      <InputBox>
        <label>그룹명</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="그룹명을 입력하세요"
        />
      </InputBox>

      <InputBox>
        <label>초대코드</label>
        <input
          type="text"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          placeholder="초대코드를 입력하세요"
        />
      </InputBox>

      <SearchButton onClick={handleSearch}>그룹 찾기</SearchButton>

      {foundGroup ? (
        <ResultBox>
          <h3>그룹을 찾았습니다!</h3>
          <p>그룹명: {foundGroup.name}</p>
          <p>초대코드: {foundGroup.inviteCode}</p>
          <JoinButton onClick={handleJoin}>참여하기</JoinButton>
        </ResultBox>
      ) : (
        message && <Message>{message}</Message>
      )}
    </Container>
  );
};

export default FindPage;

// 스타일
const Container = styled.div`
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
`;

const InputBox = styled.div`
  margin: 15px 0;

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
  }

  input {
    width: 100%;
    padding: 8px;
    font-size: 1rem;
  }
`;

const SearchButton = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  background: #4a90e2;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const ResultBox = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
`;

const JoinButton = styled.button`
  margin-top: 10px;
  padding: 8px 15px;
  background: #28a745;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const Message = styled.div`
  margin-top: 20px;
  color: red;
`;
