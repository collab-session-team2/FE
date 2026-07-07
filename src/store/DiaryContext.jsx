import { createContext, useContext, useState } from "react";

// 날짜 유틸
const pad = (n) => String(n).padStart(2, "0");
export const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
export const addDays = (d, n) => {
  const x = startOfDay(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const isSameDay = (a, b) =>
  startOfDay(a).getTime() === startOfDay(b).getTime();
const WEEK_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const WEEK_KO = ["일", "월", "화", "수", "목", "금", "토"];
export const weekEn = (d) => WEEK_EN[new Date(d).getDay()];
export const weekKo = (d) => WEEK_KO[new Date(d).getDay()];
export const fmtMain = (d) =>
  `${pad(d.getMonth() + 1)}.${pad(d.getDate())}.${d.getFullYear()}`;
export const fmtEntry = (d) =>
  `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}.${weekKo(d)}`;

const DiaryContext = createContext(null);

// 화면 간 이동에 필요한 "현재 방/일기" 식별자만 보관한다.
// 실제 데이터(방 목록/상세/일기)는 각 화면에서 API로 조회한다.
export function DiaryProvider({ children }) {
  const [activeRoomId, setActiveRoomId] = useState(null); // diaryRoomId
  const [activeDiaryId, setActiveDiaryId] = useState(null); // diaryId

  // 방 열기 (Home 카드 클릭 등)
  const openDiary = (diaryRoomId) => {
    setActiveRoomId(diaryRoomId);
    setActiveDiaryId(null);
  };

  // 일기 상세 열기
  const openEntry = (diaryRoomId, diaryId) => {
    setActiveRoomId(diaryRoomId);
    setActiveDiaryId(diaryId);
  };

  return (
    <DiaryContext.Provider
      value={{
        activeRoomId,
        activeDiaryId,
        openDiary,
        openEntry,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
}

export const useDiary = () => useContext(DiaryContext);
