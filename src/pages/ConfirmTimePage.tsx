import React, { useState } from "react";
import styled from "styled-components";
import Header from "../components/Header";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

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

  &:hover {
    background: #25632a;
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

const TimeCellTable = styled.td<{ selected: boolean }>`
  height: 25px;
  border: 1px solid #ddd;
  background: ${({ selected }) => (selected ? "#1976d2" : "#f5f5f5")};
  cursor: pointer;
  user-select: none;
`;

const ConfirmTimePage: React.FC = () => {
  const [confirmed, setConfirmed] = useState(false);
  const confirmedDate = "2025-10-10";
  const confirmedTime = [19, 20];
  const deadline = "2025-10-08 23:59";
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(confirmedDate));

  const [selectedTimes, setSelectedTimes] = useState<{ [key: string]: number[] }>({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect">("select");

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleTimeClick = (hour: number, select: boolean) => {
    if (!selectedDate) return;
    const dateKey = formatDate(selectedDate);
    const times = selectedTimes[dateKey] || [];
    const newTimes = select
      ? Array.from(new Set([...times, hour]))
      : times.filter((h) => h !== hour);
    setSelectedTimes({ ...selectedTimes, [dateKey]: newTimes });
  };

  const handleMouseDown = (hour: number) => {
    if (!selectedDate) return;
    const dateKey = formatDate(selectedDate);
    const times = selectedTimes[dateKey] || [];
    const selecting = !times.includes(hour);
    setDragMode(selecting ? "select" : "deselect");
    setIsDragging(true);
    handleTimeClick(hour, selecting);
  };

  const handleMouseOver = (hour: number) => {
    if (!isDragging) return;
    handleTimeClick(hour, dragMode === "select");
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <>
      <Header />
      <Container>
        <Title>최종 약속 시간 확정</Title>
        <InfoBox>
          <div>응답 마감일: <strong>{deadline}</strong></div>
          <div>마감 이후 가장 많은 인원이 선택한 시간으로 약속이 확정됩니다.</div>
        </InfoBox>
        <TimeBox>
          {confirmed ? (
            <>
              <div>✅ 약속이 확정되었습니다!</div>
              <div style={{ marginTop: "12px" }}>
                <span>날짜: <strong>{confirmedDate}</strong></span><br />
                <span>시간: <strong>{confirmedTime[0]}:00 ~ {confirmedTime[confirmedTime.length - 1] + 1}:00</strong></span>
              </div>
            </>
          ) : (
            <>
              <div>예상 확정 시간</div>
              <div style={{ marginTop: "12px" }}>
                <span>날짜: <strong>{confirmedDate}</strong></span><br />
                <span>시간: <strong>{confirmedTime[0]}:00 ~ {confirmedTime[confirmedTime.length - 1] + 1}:00</strong></span>
              </div>
            </>
          )}
        </TimeBox>
        {!confirmed && (
          <Button onClick={() => setConfirmed(true)}>약속 확정하기</Button>
        )}

        <CalendarTimeWrapper>
          <CalendarBox>
            <Calendar
              value={selectedDate}
              onChange={(date) => {
                const selected = Array.isArray(date) ? date[0] : date;
                setSelectedDate(selected);
              }}
              locale="ko-KR"
            />
          </CalendarBox>
          <TimeTableBox>
            <TimeTableTitle>시간 선택</TimeTableTitle>
            <TimeTable>
              <tbody>
                {hours.map((hour) => {
                  const dateKey = selectedDate ? formatDate(selectedDate) : "";
                  const selected = selectedTimes[dateKey]?.includes(hour) ?? false;

                  return (
                    <TimeRow key={hour}>
                      <td style={{ padding: "0 8px", textAlign: "right", width: "50px" }}>
                        {`${hour}~${hour + 1}`}
                      </td>
                      <TimeCellTable
                        selected={selected}
                        onMouseDown={() => handleMouseDown(hour)}
                        onMouseOver={() => handleMouseOver(hour)}
                        onMouseUp={handleMouseUp}
                      />
                    </TimeRow>
                  );
                })}
              </tbody>
            </TimeTable>
          </TimeTableBox>
        </CalendarTimeWrapper>
      </Container>
    </>
  );
};

export default ConfirmTimePage;
