import React, { useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

// =================== Styled Components ===================
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
  width: 100%;
  max-width: 500px;
  font-size: 16px;
  border-radius: 16px;
  box-shadow: 0 2px 8px #eee;

  .selected-date {
    background: #1976d2 !important;
    color: white !important;
    border-radius: 50%;
  }
  .multi-selected-date {
    background: rgba(25, 118, 210, 0.6) !important;
    color: white !important;
    border-radius: 50%;
  }
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
  font-size: 30px;
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

// =================== Main Component ===================
const SelectTimePage: React.FC = () => {
  // 캘린더 값
  const [value, setValue] = useState<Date | null>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 내가 선택한 시간
  const [selectedTimes, setSelectedTimes] = useState<Record<string, number[]>>({});

  // 친구들이 선택한 시간 (더미데이터)
  const [multiSelectedTimes, setMultiSelectedTimes] = useState<Record<string, Record<number, number>>>({
    "2025-10-03": { 10: 2, 11: 3, 14: 1 }, // 10시(2명), 11시(3명), 14시(1명)
    "2025-10-04": { 9: 1, 13: 2, 16: 2 },
    "2025-10-05": { 8: 1, 15: 2, 19: 4 },
  });

  // 드래그 상태
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect">("select");

  // 저장 모달
  const [isSaved, setIsSaved] = useState(false);

  // 시간 리스트
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // =================== Functions ===================
  const handleSave = () => {
    if (Object.keys(selectedTimes).length === 0) {
      alert("선택된 시간이 없습니다.");
      return;
    }

    const newMulti = { ...multiSelectedTimes };
    Object.entries(selectedTimes).forEach(([dateKey, times]) => {
      if (!newMulti[dateKey]) newMulti[dateKey] = {};
      times.forEach(hour => {
        newMulti[dateKey][hour] = (newMulti[dateKey][hour] || 0) + 1;
      });
    });
    setMultiSelectedTimes(newMulti);
    setIsSaved(true);
  };

  const handleModalClose = () => setIsSaved(false);

  const handleMouseDown = (hour: number) => {
    if (!selectedDate) return;
    const dateKey = selectedDate.toISOString().slice(0, 10);
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

  const handleTimeClick = (hour: number, forceSelect?: boolean) => {
    if (!selectedDate) return;
    const dateKey = selectedDate.toISOString().slice(0, 10);
    const times = selectedTimes[dateKey] || [];
    const selected = forceSelect !== undefined ? forceSelect : !times.includes(hour);

    setSelectedTimes({
      ...selectedTimes,
      [dateKey]: selected
        ? Array.from(new Set([...times, hour])).sort((a, b) => a - b)
        : times.filter((h) => h !== hour),
    });
  };

  const getTimeCellColor = (dateKey: string, hour: number) => {
    const count = multiSelectedTimes[dateKey]?.[hour] ?? 0;
    if (selectedTimes[dateKey]?.includes(hour)) return "#1976d2"; // 내가 선택
    if (count === 0) return "#f5f5f5"; // 아무도 선택 안함
    const intensity = Math.min(count / 5, 1); // 최대 5명 진하게
    return `rgba(25, 118, 210, ${intensity})`;
  };

  const resetSelectedTimesForDate = () => {
    if (!selectedDate) return;
    const dateKey = selectedDate.toISOString().slice(0, 10);
    setSelectedTimes({
      ...selectedTimes,
      [dateKey]: [],
    });
  };

  const resetAll = () => setSelectedTimes({});

  const renderSelectedList = () => {
    const keys = Object.keys(selectedTimes).filter((k) => selectedTimes[k].length > 0);
    if (keys.length === 0) return <div>선택한 시간이 없습니다.</div>;
    return (
      <ul>
        {keys.map((date) => (
          <li key={date}>
            <strong>{date}</strong>: {selectedTimes[date].map((h) => `${h}시`).join(", ")}
          </li>
        ))}
      </ul>
    );
  };

  // =================== JSX ===================
  return (
    <Container>
      <TimeTableTitle>
        {selectedDate
          ? `${selectedDate.toISOString().slice(0, 10)} 시간 선택`
          : "날짜를 선택하세요"}
      </TimeTableTitle>

      <ButtonGroup>
        <Button onClick={resetSelectedTimesForDate} disabled={!selectedDate}>시간 초기화</Button>
        <Button onClick={resetAll}>전체 초기화</Button>
        <Button onClick={handleSave}>저장하기</Button>
      </ButtonGroup>

      <CalendarTimeWrapper>
        <CalendarBox>
          <CalendarTitle>날짜선택</CalendarTitle>
          <StyledCalendar
            value={value}
            onChange={(date) => {
              const selected = Array.isArray(date) ? date[0] : date;
              setSelectedDate(selected);
              setValue(selected);
            }}
            tileClassName={({ date, view }) => {
              if (view !== "month") return "";
              const dateKey = date.toISOString().slice(0, 10);
              const count = Object.values(multiSelectedTimes[dateKey] || {}).reduce((a,b) => a+b,0);
              return count > 0 ? "multi-selected-date" : "";
            }}
          />
        </CalendarBox>

        <TimeTableBox>
          <TimeTitle>시간선택</TimeTitle>
          {selectedDate && (
            <TimeTable>
              <tbody>
                {hours.map((hour) => {
                  const dateKey = selectedDate!.toISOString().slice(0, 10);
                  return (
                    <TimeRow key={hour}>
                      <td style={{ padding: "0 8px", textAlign: "right", width: "50px" }}>
                        {`${hour}~${hour + 1}`}
                      </td>
                      <TimeCellTable
                        selected={selectedTimes[dateKey]?.includes(hour) ?? false}
                        style={{ background: getTimeCellColor(dateKey, hour) }}
                        onMouseDown={() => handleMouseDown(hour)}
                        onMouseOver={() => handleMouseOver(hour)}
                        onMouseUp={handleMouseUp}
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

      {isSaved && (
        <ModalOverlay>
          <ModalContent>
            <h2>저장이 완료되었습니다!</h2>
            <ButtonGroup>
              <Button onClick={() => window.location.href = "/"}>홈으로</Button>
              <Button onClick={handleModalClose}>시간 다시 선택</Button>
            </ButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default SelectTimePage;
