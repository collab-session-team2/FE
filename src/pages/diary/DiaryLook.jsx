import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { useDiary } from "../../store/useDiary";
import { fmtEntry, fmtMain } from "../../utils/date";
import { useDiary, fmtMain, fmtEntry } from "../../store/DiaryContext";
import { getDiaryRoomDetail } from "../../api/diaryRoom";
import { getDiaries } from "../../api/diary";

const C = {
  bg: "#3C2A21",
  cream: "#FBF3DA",
  text: "#2E2621",
  sub: "#6F6459",
  muted: "#A79C90",
  thumb: "#EAE7E2",
};

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill="#B8B0A6" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#B8B0A6" />
  </svg>
);

const ImageIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#9A9086"
    strokeWidth="1.5"
  >
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="#9A9086" stroke="none" />
    <path d="M21 15l-5-5L5 21" />
  </svg>
);

export default function DiaryLook({ embedded = false }) {
  const navigate = useNavigate();
  const { diaryId } = useParams();
  const { activeDiary, getDiaryById, openDiary, openEntry } = useDiary();
  const diary = getDiaryById(diaryId) || activeDiary;
  const entries = diary?.entries || [];

  useEffect(() => {
    if (diaryId) openDiary(diaryId);
  }, [diaryId, openDiary]);

  const goDetail = (entryId) => {
    openEntry(diary.id, entryId);
    navigate(`/diary/${diary.id}/entry/${entryId}`);
  const { activeRoomId, openEntry } = useDiary();

  const [entries, setEntries] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [loading, setLoading] = useState(Boolean(activeRoomId));
  const [error, setError] = useState(null);

  // 일기 목록 조회
  useEffect(() => {
    if (!activeRoomId) return;
    let mounted = true;
    getDiaries(activeRoomId)
      .then((res) => mounted && setEntries(res || []))
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [activeRoomId]);

  // 헤더용 방 이름 (독립 페이지에서만 필요)
  useEffect(() => {
    if (embedded || !activeRoomId) return;
    let mounted = true;
    getDiaryRoomDetail(activeRoomId)
      .then((res) => mounted && setRoomName(res?.diaryRoomName || ""))
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [embedded, activeRoomId]);

  const goDetail = (diaryId) => {
    openEntry(activeRoomId, diaryId);
    navigate("/diaryDetail");
  };

  const list = (
    <List>
      {entries.map((d) => (
        <Card key={d.diaryId} onClick={() => goDetail(d.diaryId)}>
          <Thumb>
            {d.diaryImage ? <ThumbImg src={d.diaryImage} alt="" /> : <ImageIcon />}
          </Thumb>
          <Info>
            <AuthorRow>
              <Avatar>
                <UserIcon />
              </Avatar>
              <AuthorName>{d.userName}</AuthorName>
            </AuthorRow>
            <Title>{d.title}</Title>
            <DateText>{fmtEntry(new Date(d.targetDate))}</DateText>
            <Preview>{d.content}</Preview>
          </Info>
        </Card>
      ))}
    </List>
  );

  // 과거 날짜에서 DiaryMain 안에 리스트만 렌더링
  if (embedded) return list;

  return (
    <Page>
      <Header>
        <Brand>SLAM BOOK</Brand>
        <RoomTitle>{diary?.name}</RoomTitle>
        <RoomTitle>{roomName}</RoomTitle>
        <RoomDate>{fmtMain(new Date())}</RoomDate>
      </Header>
      {loading && <RoomDate>불러오는 중...</RoomDate>}
      {error && <RoomDate>{error}</RoomDate>}
      {list}
    </Page>
  );
}

const Page = styled.div`
  width: 390px;
  min-height: 844px;
  margin: 0 auto;
  background: #371e16;
  padding: 24px 20px 100px;
`;

const Header = styled.header`
  padding: 12px 4px 24px;
`;

const Brand = styled.p`
  color: #f5edda;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin: 0;
`;

const RoomTitle = styled.h1`
  color: #ffffff;
  font-size: 40px;
  font-weight: 800;
  margin: 8px 0 6px;
`;

const RoomDate = styled.p`
  color: #cdbfae;
  font-size: 18px;
  margin: 0;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.article`
  position: relative;
  display: flex;
  gap: 18px;
  padding: 22px 20px;
  background: ${C.cream};
  border-radius: 20px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.18);
  transition: transform 0.15s ease;

  &:active {
    transform: scale(0.99);
  }

  /* 오른쪽 위 접힌 모서리 */
  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: rgba(0, 0, 0, 0.07);
    clip-path: polygon(100% 0, 0 0, 100% 100%);
  }
`;

const Thumb = styled.div`
  flex-shrink: 0;
  width: 110px;
  height: 130px;
  border-radius: 14px;
  background: ${C.thumb};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

const Avatar = styled.span`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #e3ddd4;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const AuthorName = styled.span`
  font-size: 15px;
  color: ${C.text};
`;

const Title = styled.h3`
  font-size: 19px;
  font-weight: 700;
  color: ${C.text};
  margin: 0 0 6px;
`;

const DateText = styled.p`
  font-size: 14px;
  color: ${C.sub};
  margin: 0 0 14px;
`;

const Preview = styled.p`
  font-size: 14px;
  color: ${C.text};
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
