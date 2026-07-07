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

// 더미 이름/내용
const NAME_POOL = ["구나영", "김태현", "홍길동", "이서연", "박준호"];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// 방 멤버 생성 (입장 순서 = index, 내 id = "me")
const buildMembers = (peopleCount) => {
  const others = shuffle(NAME_POOL).slice(0, Math.max(0, peopleCount - 1));
  return [
    { id: "me", name: "나" },
    ...others.map((name, i) => ({ id: `m${i + 1}`, name })),
  ];
};

let entrySeq = 1000;
// 과거 더미 일기 몇 개
const seedEntries = (members) => {
  const today = startOfDay(new Date());
  return [1, 2, 3].map((back) => {
    const author = members[back % members.length];
    const date = addDays(today, -back);
    const content =
      "오늘 하루도 정말 알찼다. 친구들과 함께한 시간이 소중했고, 소소한 일상 속에서 행복을 느꼈던 하루. 내일도 좋은 일만 가득하길 바라며 오늘의 기록을 남긴다.";
    return {
      id: entrySeq++,
      authorId: author.id,
      authorName: author.name,
      date: date.toISOString(),
      title: "일기 제목 일기 제목",
      content,
      preview: content,
      photo: null,
      likes: 1,
      liked: false,
      comments: [{ id: 1, author: "장서후", time: "1일 전", text: "오오오오옹" }],
    };
  });
};

// 하나의 방 데이터 생성
const buildDiary = ({ id, name, code, photo, peopleCount, order }) => {
  const members = buildMembers(peopleCount);
  const turnOrder = shuffle(members.map((m) => m.id));
  return {
    id,
    name,
    code,
    photo: photo || null,
    peopleCount,
    order, // 전체 유저 기준 생성 순번 -> NO.00X
    members,
    myMemberId: "me",
    turnOrder,
    currentTurnIndex: 0,
    entries: seedEntries(members),
  };
};

// 데모용 기본 방 (직접 진입 테스트용)
const DEMO = buildDiary({
  id: "demo",
  name: "걸스토크",
  code: "DEMO01",
  photo: null,
  peopleCount: 4,
  order: 4,
});

const DiaryContext = createContext(null);

export function DiaryProvider({ children }) {
  const [diaries, setDiaries] = useState([DEMO]);
  const [order, setOrder] = useState(4); // "DB" 전체 생성 순번 카운터
  const [activeId, setActiveId] = useState("demo");
  const [activeEntryId, setActiveEntryId] = useState(null);

  const activeDiary = diaries.find((d) => d.id === activeId) || diaries[0] || DEMO;
  const activeEntry =
    activeDiary?.entries.find((e) => e.id === activeEntryId) || null;

  // 방 생성 -> 방코드/생성순번 발급
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
    setDiaries((prev) => [...prev, diary]);
    return { code, order: nextOrder, id };
  };

  // 방코드로 참여 -> 코드로 방을 찾아 원래 이름/사진을 그대로 사용
  const joinRoom = ({ code }) => {
    const source = diaries.find((d) => d.code === code);
    const nextOrder = order + 1;
    const id = `join-${nextOrder}-${code}`;
    const diary = buildDiary({
      id,
      name: source ? source.name : `${code} 일기장`,
      code,
      photo: source ? source.photo : null,
      peopleCount: source ? source.peopleCount : 4,
      order: source ? source.order : nextOrder,
    });
    if (!source) setOrder(nextOrder);
    setDiaries((prev) => [...prev, diary]);
    return diary;
  };

  const openDiary = (id) => {
    setActiveId(id);
    setActiveEntryId(null);
  };
  const openEntry = (diaryId, entryId) => {
    setActiveId(diaryId);
    setActiveEntryId(entryId);
  };

  // 일기 작성 -> 턴 다음 사람으로 전환
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
      })
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
                e.id !== entryId
                  ? e
                  : {
                      ...e,
                      liked: !e.liked,
                      likes: e.liked ? e.likes - 1 : e.likes + 1,
                    }
              ),
            }
      )
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
                e.id !== entryId
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
                    }
              ),
            }
      )
    );
  };

  // 현재 턴 정보
  const getTurn = (diary) => {
    if (!diary) return { isMine: false, name: "", label: "" };
    const currentId = diary.turnOrder[diary.currentTurnIndex];
    const isMine = currentId === diary.myMemberId;
    const member = diary.members.find((m) => m.id === currentId);
    const name = member?.name || "";
    return { isMine, name, label: isMine ? "MY TURN" : `${name} Turn` };
  };

  return (
    <DiaryContext.Provider
      value={{
        diaries,
        activeDiary,
        activeEntry,
        createRoom,
        joinRoom,
        openDiary,
        openEntry,
        addEntry,
        toggleLike,
        addComment,
        getTurn,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
}

export const useDiary = () => useContext(DiaryContext);
