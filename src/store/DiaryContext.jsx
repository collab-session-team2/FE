import { useCallback, useState } from "react";
import { DiaryContext } from "./diaryContextValue";

// 화면 간 이동에 필요한 "현재 방/일기" 식별자와 미션 진행 상태만 보관한다.
// 방 목록/상세/일기 등 실제 데이터는 각 화면에서 API로 조회한다.
export function DiaryProvider({ children }) {
  // 현재 열려 있는 방/일기 식별자 (화면 이동용)
  const [activeRoomId, setActiveRoomId] = useState(null); // diaryRoomId
  const [activeDiaryId, setActiveDiaryId] = useState(null); // diaryId

  // 방 열기 (Home 카드 클릭, 방 생성 완료 등)
  const openDiary = useCallback((diaryRoomId) => {
    setActiveRoomId(diaryRoomId);
    setActiveDiaryId(null);
  }, []);

  // 일기 상세 열기
  const openEntry = useCallback((diaryRoomId, diaryId) => {
    setActiveRoomId(diaryRoomId);
    setActiveDiaryId(diaryId);
  }, []);

  // 미션 진행 상태: MissionPage에서 API로 불러와 캐시하고,
  // MissionVerifyPage에서 조회/완료 처리에 사용한다.
  const [activeMissions, setActiveMissions] = useState([]);
  const [activeTotalPoint, setActiveTotalPoint] = useState(0);

  const setMissionData = useCallback(({ missions, totalPoint }) => {
    setActiveMissions(missions);
    setActiveTotalPoint(totalPoint);
  }, []);

  const getMissionById = (missionId) =>
    activeMissions.find((m) => String(m.missionId) === String(missionId)) ||
    null;

  const completeMission = (missionId) => {
    const target = activeMissions.find(
      (m) => String(m.missionId) === String(missionId),
    );

    setActiveMissions((prev) =>
      prev.map((m) =>
        String(m.missionId) !== String(missionId)
          ? m
          : { ...m, complete: true },
      ),
    );

    if (target && !target.complete) {
      setActiveTotalPoint((prev) => prev + target.exp);
    }
  };

  return (
    <DiaryContext.Provider
      value={{
        activeRoomId,
        activeDiaryId,
        openDiary,
        openEntry,
        activeMissions,
        activeTotalPoint,
        setMissionData,
        getMissionById,
        completeMission,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
}
