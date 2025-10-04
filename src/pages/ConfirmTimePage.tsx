import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// ---------------- 스타일 ----------------
const Container = styled.div`
  max-width: 900px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px #eee;
  padding: 32px;
`;

const Title = styled.h2`
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #1976d2;
`;

const InfoBox = styled.div`
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  text-align: center;
`;

const TimeBox = styled.div`
  background: #e3f2fd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #1976d2;
`;

const Button = styled.button`
  width: 100%;
  background: #388e3c;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  font-size: 18px;
  margin-top: 12px;

  &:hover {
    background: #25632a;
  }
`;

const ShareButton = styled(Button)`
  background: #1976d2;
  margin-top: 12px;

  &:hover {
    background: #145a9e;
  }
`;

const CalendarTimeWrapper = styled.div`
  display: flex;
  gap: 32px;
  margin-top: 32px;
`;

const CalendarBox = styled.div`
  flex: 1;
`;

const TimeTableBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TimeTableTitle = styled.h3`
  text-align: center;
  font-size: 22px;
  margin-bottom: 16px;
`;

const TimeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TimeRow = styled.tr``;

const TimeCellTable = styled.td<{ percent: number; selected?: boolean; top?: boolean }>`
  height: 25px;
  border: 1px solid #ddd;
  background: ${({ selected, top, percent }) =>
    selected ? "#ffa500" :
    top ? "#1976d2" :
    percent === 0 ? "#fff" :
    percent <= 25 ? "#cce5ff" :
    percent <= 50 ? "#82c1ff" :
    percent <= 75 ? "#2994ff" :
    "#005cb9"};
  color: ${({ selected, top, percent }) => (selected || top || percent > 50 ? "#fff" : "#333")};
  cursor: pointer;
`;

const CandidateList = styled.div`
  margin-top: 16px;
  background: #fafafa;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
`;

const ModalBackground = styled.div`
  position: fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background: rgba(0,0,0,0.5);
  display:flex;
  justify-content:center;
  align-items:center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 12px;
  max-width: 400px;
  text-align:center;
`;

interface Candidate {
  date: string;
  start: number;
  end: number;
  participants: number;
}

const ConfirmTimePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [topCandidate, setTopCandidate] = useState<Candidate | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showModal, setShowModal] = useState(false);

  const totalPeople = 5;
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const multiSelectedTimes: Record<string, Record<number, number>> = {
    "2025-10-10": { 10: 3, 11: 3, 12: 3, 19: 3, 20: 2 },
    "2025-10-11": { 9: 1, 13: 2, 16: 2, 17: 2 },
    "2025-10-12": { 15: 2, 16: 3, 17: 3, 18: 5, 19: 5 },
  };

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    // 전체 후보 계산
    const allCandidates: Candidate[] = [];
    Object.keys(multiSelectedTimes).forEach(dateKey => {
      const times = multiSelectedTimes[dateKey];
      const hourList = Object.keys(times).map(Number).sort((a, b) => a - b);

      let start: number | null = null;
      let minP = 0;

      for (let i=0;i<hourList.length;i++){
        const h = hourList[i];
        if (times[h]===totalPeople){
          if(start===null) start=h;
        } else {
          if(start!==null){
            allCandidates.push({date:dateKey,start,end:h-1,participants:totalPeople});
            start=null;
          }
        }
      }
      if(start!==null) allCandidates.push({date:dateKey,start,end:hourList[hourList.length-1],participants:totalPeople});
    });

    const top = allCandidates.sort((a,b)=> b.participants!==a.participants ? b.participants-a.participants : (b.end-b.start)-(a.end-a.start))[0] || null;

    setCandidates(allCandidates);
    setTopCandidate(top);
    if(top) setSelectedDate(new Date(top.date));
  }, []);

  const handleConfirm = () => {
    if(!selectedCandidate) return;
    setShowModal(true);
  };

  const handleShare = () => {
    if(!selectedCandidate) return;
    const shareText = `📅 약속 시간\n날짜: ${selectedCandidate.date}\n시간: ${selectedCandidate.start}:00 ~ ${selectedCandidate.end+1}:00\n참석 인원: ${selectedCandidate.participants}명`;
    if(navigator.share){
      navigator.share({title:"약속 시간", text:shareText, url: window.location.href});
    } else {
      navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
      alert("공유 링크가 클립보드에 복사되었습니다.");
    }
  };
  
// 후보 정렬 후 순위 부여
const rankedCandidates = [...candidates]
  .sort((a, b) => b.participants - a.participants || (b.end - b.start) - (a.end - a.start))
  .map((c, idx) => ({ ...c, rank: idx + 1 }));

  return (
    <Container>
      <Title>최종 약속 시간 확정</Title>

      <InfoBox>
        <div>응답 마감일: <strong>2025-10-08 23:59</strong></div>
        <div>마감 이후 위 기준으로 자동 확정됩니다.</div>
          <CandidateList>
            <strong>후보 시간</strong>
            <ul>
              {candidates.map((c,idx)=>(
                <li key={idx} style={{cursor:"pointer", fontWeight:selectedCandidate===c?"bold":c===topCandidate?"bold":"normal", color:c===topCandidate?"#1976d2":"#333"}}
                    onClick={()=>setSelectedCandidate(c)}>
                  {`${c.date} | ${c.start}:00 ~ ${c.end+1}:00 (${c.participants}명)`}{c===topCandidate?" (1순위)":""}
                </li>
              ))}
            </ul>
          </CandidateList>

          <Button onClick={handleConfirm}>시간 확정하기</Button>
      </InfoBox>

      <CalendarTimeWrapper>
        <CalendarBox>
          <Calendar value={selectedDate} onChange={d=>setSelectedDate(Array.isArray(d)?d[0]:d)} locale="ko-KR" />
        </CalendarBox>

        <TimeTableBox>
          <TimeTableTitle>시간 선택 현황</TimeTableTitle>
          <TimeTable>
            <tbody>
              {hours.map(hour=>{
                const dateKey = selectedDate?formatDate(selectedDate):"";
                const count = multiSelectedTimes[dateKey]?.[hour] || 0;
                const percent = count===0?0:Math.round((count/totalPeople)*100);
const selected = selectedCandidate ? selectedCandidate.start <= hour && selectedCandidate.end >= hour : false;
const top = topCandidate ? topCandidate.start <= hour && topCandidate.end >= hour : false;

                return (
                  <TimeRow key={hour}>
                    <td style={{padding:"0 8px",textAlign:"right", width:"50px"}}>{`${hour}~${hour+1}`}</td>
                    <TimeCellTable
                      percent={percent}
                      selected={selected}
                      top={top}
                      onClick={()=> {
                        const candidate = candidates.find(c=>c.start<=hour && c.end>=hour && c.date===dateKey);
                        if(candidate) setSelectedCandidate(candidate);
                      }}
                    />
                  </TimeRow>
                )
              })}
            </tbody>
          </TimeTable>

        </TimeTableBox>
      </CalendarTimeWrapper>

      {showModal && selectedCandidate && (
        <ModalBackground>
          <ModalBox>
            <h3>✅ 약속이 확정되었습니다!</h3>
            <p>{`${selectedCandidate.date} | ${selectedCandidate.start}:00 ~ ${selectedCandidate.end+1}:00 | ${selectedCandidate.participants}명 참석`}</p>
            <Button onClick={()=>window.location.href="/"}>홈으로</Button>
            <ShareButton onClick={handleShare}>공유하기</ShareButton>
          </ModalBox>
        </ModalBackground>
      )}
    </Container>
  );
};

export default ConfirmTimePage;
