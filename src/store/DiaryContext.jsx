import { useCallback, useState } from "react";
import { startOfDay } from "../utils/date";
import { DiaryContext } from "./diaryContextValue";

let entrySeq = 1;

const buildMembers = (peopleCount) => [
  { id: "me", name: "나" },
  ...Array.from({ length: Math.max(0, peopleCount - 1) }, (_, i) => ({
    id: `m${i + 1}`,
    name: `친구 ${i + 1}`,
  })),
];

const buildDiary = ({ id, name, code, photo, peopleCount, order }) => {
  const members = buildMembers(peopleCount);

  return {
    id,
    name,
    code,
    photo: photo || null,
    peopleCount,
    order,
    members,
    myMemberId: "me",
    turnOrder: members.map((member) => member.id),
    currentTurnIndex: 0,
    entries: [],
  };
};

export function DiaryProvider({ children }) {
  const [diaries, setDiaries] = useState([]);
  const [order, setOrder] = useState(0);
  const [activeId, setActiveId] = useState(null);
  const [activeEntryId, setActiveEntryId] = useState(null);
  const [activeMissions, setActiveMissions] = useState([]);
  const [activeTotalPoint, setActiveTotalPoint] = useState(0);

  const activeDiary = diaries.find((d) => d.id === activeId) || diaries[0] || null;
  const activeEntry =
    activeDiary?.entries.find((e) => String(e.id) === String(activeEntryId)) ||
    null;

  const setMissionData = useCallback(({ missions, totalPoint }) => {
    setActiveMissions(missions);
    setActiveTotalPoint(totalPoint);
  }, []);

  const getDiaryById = (id) => diaries.find((d) => d.id === id) || null;
  const getEntryById = (diaryId, entryId) =>
    getDiaryById(diaryId)?.entries.find((e) => String(e.id) === String(entryId)) ||
    null;
  const getMissionById = (missionId) =>
    activeMissions.find((mission) => String(mission.id) === String(missionId)) ||
    null;

  const createRoom = ({ name, peopleCount, photo }) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const nextOrder = order + 1;
    const id = `room-${nextOrder}-${code}`;
    const diary = buildDiary({
      id,
      name: name?.trim() || "제목 없는 일기장",
      code,
      photo,
      peopleCount: peopleCount || 4,
      order: nextOrder,
    });

    setOrder(nextOrder);
    setActiveId(id);
    setDiaries((prev) => [...prev, diary]);
    return { code, order: nextOrder, id };
  };

  const joinRoom = ({ code }) => {
    const nextOrder = order + 1;
    const id = `join-${nextOrder}-${code}`;
    const diary = buildDiary({
      id,
      name: `${code} 일기장`,
      code,
      photo: null,
      peopleCount: 4,
      order: nextOrder,
    });

    setOrder(nextOrder);
    setActiveId(id);
    setDiaries((prev) => [...prev, diary]);
    return diary;
  };

  const openDiary = useCallback((id) => {
    setActiveId(id);
    setActiveEntryId(null);
  }, []);

  const openEntry = useCallback((diaryId, entryId) => {
    setActiveId(diaryId);
    setActiveEntryId(entryId);
  }, []);

  const addEntry = (diaryId, { title, content, photo }) => {
    setDiaries((prev) =>
      prev.map((d) => {
        if (d.id !== diaryId) return d;
        const me = d.members.find((m) => m.id === d.myMemberId);
        const entry = {
          id: entrySeq++,
          authorId: d.myMemberId,
          authorName: me?.name || "나",
          date: startOfDay(new Date()).toISOString(),
          title: title?.trim() || "무제",
          content: content || "",
          preview: content || "",
          photo: photo || null,
          likes: 0,
          liked: false,
          comments: [],
        };

        return {
          ...d,
          entries: [entry, ...d.entries],
          currentTurnIndex: (d.currentTurnIndex + 1) % d.members.length,
        };
      }),
    );
  };

  const toggleLike = (diaryId, entryId) => {
    setDiaries((prev) =>
      prev.map((d) =>
        d.id !== diaryId
          ? d
          : {
              ...d,
              entries: d.entries.map((e) =>
                String(e.id) !== String(entryId)
                  ? e
                  : {
                      ...e,
                      liked: !e.liked,
                      likes: e.liked ? e.likes - 1 : e.likes + 1,
                    },
              ),
            },
      ),
    );
  };

  const addComment = (diaryId, entryId, text) => {
    const value = text.trim();
    if (!value) return;

    setDiaries((prev) =>
      prev.map((d) =>
        d.id !== diaryId
          ? d
          : {
              ...d,
              entries: d.entries.map((e) =>
                String(e.id) !== String(entryId)
                  ? e
                  : {
                      ...e,
                      comments: [
                        ...e.comments,
                        {
                          id: entrySeq++,
                          author: "나",
                          time: "방금 전",
                          text: value,
                        },
                      ],
                    },
              ),
            },
      ),
    );
  };

  const completeMission = (missionId) => {
    const completedMission = activeMissions.find(
      (mission) => String(mission.id) === String(missionId),
    );

    setActiveMissions((prev) =>
      prev.map((mission) =>
        String(mission.id) !== String(missionId)
          ? mission
          : { ...mission, completed: true },
      ),
    );

    if (completedMission && !completedMission.completed) {
      setActiveTotalPoint((prev) => prev + completedMission.point);
    }
  };

  const getTurn = (diary) => {
    if (!diary) return { isMine: false, name: "", label: "" };
    const currentId = diary.turnOrder[diary.currentTurnIndex];
    const isMine = currentId === diary.myMemberId;
    const member = diary.members.find((m) => m.id === currentId);
    const name = member?.name || "";
    return { isMine, name, label: isMine ? "MY TURN" : `${name} Turn` };
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
        diaries,
        activeDiary,
        activeEntry,
        activeMissions,
        activeTotalPoint,
        setMissionData,
        getDiaryById,
        getEntryById,
        getMissionById,
        createRoom,
        joinRoom,
        openDiary,
        openEntry,
        addEntry,
        toggleLike,
        addComment,
        completeMission,
        getTurn,
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
