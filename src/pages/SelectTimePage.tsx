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
  height: 25px;  // 높이 조절
  border: 1px solid #ddd;
  background: ${({ selected }) => (selected ? "#1976d2" : "#f5f5f5")};
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

const TimeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const TimeCell = styled.button<{ selected: boolean }>`
  padding: 12px 0;
  background: ${({ selected }) => (selected ? "#1976d2" : "#f5f5f5")};
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: ${({ selected }) => (selected ? "bold" : "normal")};
  transition: background 0.2s;
`;

const SelectedList = styled.div`
  margin-top: 24px;
  font-size: 15px;
`;

const SelectTimePage: React.FC = () => {
  // ✅ 타입 정의
  type CalendarValue = Date | [Date, Date] | null;

  const [value, setValue] = useState<CalendarValue>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<Record<string, number[]>>({});

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"select" | "deselect">("select");

  const handleMouseDown = (hour: number) => {
    if (!selectedDate) return;
    const dateKey = selectedDate.toISOString().slice(0, 10);
    const times = selectedTimes[dateKey] || [];
    const selecting = !times.includes(hour);
    setDragMode(selecting ? "select" : "deselect");
    setIsDragging(true);
    handleTimeClick(hour, selecting);
  };

  // ✅ 올바른 타입 사용
const handleDateChange = (value: CalendarValue, event: React.SyntheticEvent<any> | undefined) => {
  if (!value) {
    setSelectedDate(null);
    return;
  }
  const date = Array.isArray(value) ? value[0] : value;
  setSelectedDate(date);
  setValue(value);
};

const handleMouseOver = (hour: number) => {
  if (!isDragging) return;
  handleTimeClick(hour, dragMode === "select");
};

const handleMouseUp = () => setIsDragging(false);

// 선택 함수 수정
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

  return (
    <Container>
          <TimeTableTitle>
            {selectedDate
              ? `${selectedDate.toISOString().slice(0, 10)} 시간 선택`
              : "날짜를 선택하세요"}
          </TimeTableTitle>
      <CalendarTimeWrapper >
        <CalendarBox>
          <CalendarTitle>날짜선택</CalendarTitle>
          <StyledCalendar
            value={value}
            onChange={(newValue) => handleDateChange(newValue as CalendarValue, undefined)}
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
                    {/* 시간 레이블 */}
                    <td style={{ padding: "0 8px", textAlign: "right", width: "50px" }}>
                      {`${hour}~${hour + 1}`}
                    </td>
                    {/* 선택 가능한 셀 */}
                    <TimeCellTable
                      selected={selectedTimes[dateKey]?.includes(hour) ?? false}
                      onMouseDown={() => handleMouseDown(hour)}
                      onMouseOver={() => handleMouseOver(hour)}
                      onMouseUp={handleMouseUp}
                    />
                  </TimeRow>
                );
              })}
            </tbody>
          </TimeTable>)}
        </TimeTableBox>   
      </CalendarTimeWrapper >     
      <SelectedList>
          <h4>내가 선택한 시간</h4>
          {renderSelectedList()}
      </SelectedList>
    </Container>
  );
};

export default SelectTimePage;
