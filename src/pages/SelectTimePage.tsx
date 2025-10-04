import React, { useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Container = styled.div`
  display: flex;
  flex-direction: column; 
  max-width: 800px;
  margin: 40px auto;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px #eee;
  padding: 32px;
  gap: 32px;
`;

const CalendarTimeWrapper = styled.div`
  display: flex;
  flex-direction: row; 
  gap: 32px;
`;

const CalendarTitle = styled.h3`
  text-align: center;
  margin-bottom: 16px;
`;

const TimeTitle = styled.h3`
  text-align: center;
  margin-bottom: 16px;
`;

const StyledCalendar = styled(Calendar)`
  width: 100% !important;
  max-width: 500px;
  font-size: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px #eee;

  .my-selected-date {
    background: #1976d2 !important;
    color: white !important;
    border-radius: 10%;
  }

  .my-selected-date:hover {
    background: #145ea8 !important;
  }
`;

const CalendarBox = styled.div`
  flex: 1;
`;

const TimeTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TimeRow = styled.tr``;

const TimeCellTable = styled.td<{ selected: boolean }>`
  height: 25px;
  border: 1px solid #ddd;
  cursor: pointer;
  user-select: none;
`;

const TimeTableBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TimeTableTitle = styled.h3`
  text-align: center;
  font-size: 30px;
  margin-bottom: 16px;
`;

const SelectedList = styled.div`
  margin-top: 24px;
  font-size: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 16px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.2s;

  &:hover {
    background: #145ea8;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  text-align: center;
`;

const SelectTimePage: React.FC = () => {
  type CalendarValue = Date | [Date, Date] | null;

  const [value, setValue] = useState<CalendarValue>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<Record<string, number[]>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect">("select");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 친구들이 선택한 시간 (더미 데이터)
  const [multiSelectedTimes, setMultiSelectedTimes] = useState<Record<string, Record<number, number>>>({
    "2025-10-03": { 10: 2, 11: 3, 14: 1 },
    "2025-10-04": { 9: 1, 13: 2, 16: 2 },
    "2025-10-05": { 8: 1, 15: 2, 19: 4 },
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleTimeClick = (hour: number, forceSelect?: boolean) => {
    if (!selectedDate) return;
    const dateKey = formatDate(selectedDate);
    const times = selectedTimes[dateKey] || [];
    const selected = forceSelect !== undefined ? forceSelect : !times.includes(hour);

    setSelectedTimes({
      ...selectedTimes,
      [dateKey]: selected
        ? Array.from(new Set([...times, hour])).sort((a, b) => a - b)
        : times.filter(h => h !== hour),
    });
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

  const resetSelectedTimesForDate = () => {
    if (!selectedDate) return;
    const dateKey = formatDate(selectedDate);
    setSelectedTimes({ ...selectedTimes, [dateKey]: [] });
  };

  const resetAll = () => setSelectedTimes({});

  const renderSelectedList = () => {
    const keys = Object.keys(selectedTimes).filter(k => selectedTimes[k].length > 0);
    if (keys.length === 0) return <div>선택한 시간이 없습니다.</div>;
    return (
      <ul>
        {keys.map(date => (
          <li key={date}>
            <strong>{date}</strong>: {selectedTimes[date].map(h => `${h}시`).join(", ")}
          </li>
        ))}
      </ul>
    );
  };

  // 🔹 친구 + 내 선택 반영 색상
  const getTimeColor = (
    dateKey: string,
    hour: number,
    totalParticipants: number = 4 // 친구 3명 + 나 1명
  ) => {
    const mySelected = selectedTimes[dateKey]?.includes(hour) ?? false;
    const friendsCount = multiSelectedTimes[dateKey]?.[hour] ?? 0;
    const totalSelected = friendsCount + (mySelected ? 1 : 0);
    const percent = totalSelected / totalParticipants;

    if (percent >= 1) return "#0047b3"; // 100%
    if (percent >= 0.75) return "#3366ff"; // 75%
    if (percent >= 0.5) return "#99ccff"; // 50%
    if (percent >= 0.25) return "#cce0ff"; // 25%
    return "#f5f5f5"; // 아무도 선택 안함
  };

  return (
    <Container>
      <TimeTableTitle>{selectedDate ? `${formatDate(selectedDate)} 시간 선택` : "날짜를 선택하세요"}</TimeTableTitle>

      <ButtonGroup>
        <Button onClick={resetSelectedTimesForDate} disabled={!selectedDate}>시간 초기화</Button>
        <Button onClick={resetAll}>전체 초기화</Button>
        <Button onClick={() => setIsModalOpen(true)}>저장하기</Button>
      </ButtonGroup>

      <CalendarTimeWrapper>
        <CalendarBox>
          <CalendarTitle>날짜선택</CalendarTitle>
          <StyledCalendar
            value={value}
            onChange={date => {
              const selected = Array.isArray(date) ? date[0] : date;
              setSelectedDate(selected);
              setValue(selected);
            }}
            tileClassName={({ date, view }) => {
              if (view !== "month") return "";
              const dateKey = formatDate(date);
              return (selectedTimes[dateKey]?.length ?? 0) > 0 ? "my-selected-date" : "";
            }}
          />
        </CalendarBox>

        <TimeTableBox>
          <TimeTitle>시간선택</TimeTitle>
          {selectedDate && (
            <TimeTable>
              <tbody>
                {hours.map(hour => {
                  const dateKey = formatDate(selectedDate);
                  return (
                    <TimeRow key={hour}>
                      <td style={{ padding: "0 8px", textAlign: "right", width: "50px" }}>
                        {`${hour}~${hour + 1}`}
                      </td>
                      <TimeCellTable
                        selected={selectedTimes[dateKey]?.includes(hour) ?? false}
                        onMouseDown={() => handleMouseDown(hour)}
                        onMouseOver={() => handleMouseOver(hour)}
                        onMouseUp={handleMouseUp}
                        style={{ background: getTimeColor(dateKey, hour, 4) }}
                      />
                    </TimeRow>
                  );
                })}
              </tbody>
            </TimeTable>
          )}
        </TimeTableBox>
      </CalendarTimeWrapper>

      <SelectedList>
        <h4>내가 선택한 시간</h4>
        {renderSelectedList()}
      </SelectedList>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <h2>저장이 완료되었습니다!</h2>
            <ButtonGroup>
              <Button onClick={() => window.location.href = "/"}>홈으로</Button>
              <Button onClick={() => setIsModalOpen(false)}>시간 다시 선택</Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default SelectTimePage;
