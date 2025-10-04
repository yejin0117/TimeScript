import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import Header from "../components/Header";
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

const TimeCellTable = styled.td<{
  percent: number;
  selected?: boolean;
  rank1?: boolean;
}>`
  height: 25px;
  border: 1px solid #ddd;
  background: ${({ selected, rank1, percent }) =>
    selected ? "#ffa500" :
    rank1 ? "#1976d2" :
    percent === 0 ? "#fff" :
    percent <= 25 ? "#cce5ff" :
    percent <= 50 ? "#82c1ff" :
    percent <= 75 ? "#2994ff" :
    "#005cb9"};
  color: ${({ selected, rank1, percent }) => (selected || rank1 || percent > 50 ? "#fff" : "#333")};
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
  rank?: number;
}

interface PlaceRecommendation {
  name: string;
  address: string;
}

const ConfirmTimePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [rankedCandidates, setRankedCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [topCandidate, setTopCandidate] = useState<Candidate | null>(null);
  const [showAllCandidates, setShowAllCandidates] = useState(false);


  const totalPeople = 5;
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const multiSelectedTimes: Record<string, Record<number, number>> = {
    "2025-10-10": { 10: 3, 11: 3, 12: 3, 19: 3, 20: 2 },
    "2025-10-11": { 9: 1, 13: 2, 16: 2, 17: 2 },
    "2025-10-12": { 15: 2, 16: 3, 17: 3, 18: 5, 19: 5 },
  };

const dummyPlaceData: Record<string, PlaceRecommendation[]> = {
  "강남": [
    { name: "스타벅스 강남점", address: "서울 강남구" },
    { name: "카페 마마스 강남점", address: "서울 강남구" },
  ],
  "홍대": [
    { name: "홍대 카페 1", address: "서울 마포구" },
    { name: "홍대 카페 2", address: "서울 마포구" },
  ],
};
  
const dummyWeatherData: Record<string, { weather: string; temp: number }> = {
  "2025-10-10": { weather: "맑음", temp: 22 },
  "2025-10-11": { weather: "흐림", temp: 19 },
  "2025-10-12": { weather: "비", temp: 17 },
};

  const [weatherData, setWeatherData] = useState(dummyWeatherData);
const [placeData, setPlaceData] = useState(dummyPlaceData);
const [selectedRegion, setSelectedRegion] = useState("강남"); // 예시

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

useEffect(() => {
  const allCandidates: Candidate[] = [];

  Object.keys(multiSelectedTimes).forEach(dateKey => {
    const times = multiSelectedTimes[dateKey];
    const hourList = Object.keys(times).map(Number).sort((a, b) => a - b);

    let start: number | null = null;
    let maxCount: number | null = null;

    for (let i = 0; i < hourList.length; i++) {
      const h = hourList[i];
      const count = times[h];

      if (count === 0) {
        start = null;
        maxCount = null;
        continue;
      }

      if (start === null) {
        start = h;
        maxCount = count;
      } else if (h === hourList[i - 1] + 1 && count === maxCount) {
        // 연속된 시간이며 참석인원이 최대값이면 계속 확장
        // do nothing
      } else {
        allCandidates.push({
          date: dateKey,
          start: start!,
          end: hourList[i - 1],
          participants: maxCount!,
        });
        start = h;
        maxCount = count;
      }
    }

    if (start !== null) {
      allCandidates.push({
        date: dateKey,
        start,
        end: hourList[hourList.length - 1],
        participants: maxCount!,
      });
    }
  });

  // 최대 참석 인원 기준으로 정렬
  const sortedCandidates = allCandidates.sort((a, b) => {
    if (b.participants !== a.participants) return b.participants - a.participants;
    if ((b.end - b.start) !== (a.end - a.start)) return (b.end - b.start) - (a.end - a.start);
    return a.date.localeCompare(b.date);
  });

  // 순위 부여
  let rank = 1;
  let prevParticipants = -1;
  let prevLength = -1;
  let prevDate = "";
  const rankedCandidatesArr: Candidate[] = [];

  sortedCandidates.forEach(c => {
    const length = c.end - c.start + 1;
    if (c.participants !== prevParticipants || length !== prevLength || c.date !== prevDate) {
      prevParticipants = c.participants;
      prevLength = length;
      prevDate = c.date;
      rank = rankedCandidatesArr.length + 1;
    }
    rankedCandidatesArr.push({ ...c, rank });
  });

  setCandidates(rankedCandidatesArr);
  setRankedCandidates(rankedCandidatesArr);
  setTopCandidate(rankedCandidatesArr[0] || null);
  if (rankedCandidatesArr[0]) setSelectedDate(new Date(rankedCandidatesArr[0].date));
}, []);


const handleConfirm = () => {
  if (!selectedCandidate) {
    // 선택된 후보가 없으면 1순위 후보 자동 선택
    const firstRankCandidate = rankedCandidates.find(c => c.rank === 1);
    if (firstRankCandidate) {
      setSelectedCandidate(firstRankCandidate);
      setSelectedDate(new Date(firstRankCandidate.date));
      setShowModal(true);
    }
  } else {
    setShowModal(true);
  }
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

  return (
    <>
    <Header />
    <Container>
      <Title>최종 약속 시간 확정</Title>
      <InfoBox>
        <CandidateList>
          <strong>후보 시간</strong>
          <ul>
            {(showAllCandidates ? rankedCandidates : rankedCandidates.filter(c => c.rank === 1))
              .map((c, idx) => (
<li
  key={idx}
  style={{
    cursor:"pointer",
    fontWeight: selectedCandidate===c||c.rank===1 ? "bold" : "normal",
    color: c.rank===1 ? "#1976d2" : "#333",
    fontSize: c.rank===1 ? 19 : 18,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
  onClick={()=> {
    setSelectedCandidate(c);
    setSelectedDate(new Date(c.date));
  }}
>
  <span>{`${c.date} | ${c.start}:00 ~ ${c.end+1}:00 (${c.participants}명)`} {c.rank===1 ? "(1순위)" : `(${c.rank}순위)`}</span>
  <span style={{marginLeft: "12px"}}>
    {weatherData[c.date] ? `${weatherData[c.date].weather} / ${weatherData[c.date].temp}°C` : "로딩..."}
  </span>
</li>

            ))}
          </ul>

          <Button 
            style={{background:"#1976d2"}} 
            onClick={()=>setShowAllCandidates(prev=>!prev)}>
            {showAllCandidates ? "접기" : "더보기"}
          </Button>
        </CandidateList>
        <div style={{ marginTop: "8px", fontSize: "14px", color: "#555" }}>
  <strong>추천 장소:</strong>
  <ul>
    {placeData[selectedRegion]?.map((p, idx) => (
      <li key={idx}>{`${p.name} (${p.address})`}</li>
    )) || <li>추천 장소가 없습니다.</li>}
  </ul>
</div>


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

                const selected = selectedCandidate ? selectedCandidate.start<=hour && selectedCandidate.end>=hour && selectedCandidate.date===dateKey : false;
                const rank1 = rankedCandidates.find(c=>c.rank===1 && c.date===dateKey && c.start<=hour && c.end>=hour) ? true : false;

                return (
                  <TimeRow key={hour}>
                    <td style={{padding:"0 8px",textAlign:"right", width:"50px"}}>{`${hour}~${hour+1}`}</td>
                    <TimeCellTable
                      percent={percent}
                      selected={selected}
                      rank1={rank1}
                      onClick={()=>{
                        const candidate = rankedCandidates.find(c=>c.start<=hour && c.end>=hour && c.date===dateKey);
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                }}
              >
                ✖
              </button>
            </div>
            <h3>✅ 약속이 확정되었습니다!</h3>
            <p>{`${selectedCandidate.date} | ${selectedCandidate.start}:00 ~ ${selectedCandidate.end+1}:00 | ${selectedCandidate.participants}명 참석`}</p>
            <Button onClick={()=>window.location.href="/"}>홈으로</Button>
            <ShareButton onClick={handleShare}>공유하기</ShareButton>
          </ModalBox>
        </ModalBackground>
      )}
    </Container>
    </>
  );
};

export default ConfirmTimePage;
