import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import { useDiary } from "../../store/useDiary";
import { fmtEntry } from "../../utils/date";
import { getDiary } from "../../api/diary";

const C = {
  bg: "#3C2A21",
  cream: "#FBF3DA",
  text: "#2E2621",
  sub: "#6F6459",
  muted: "#A79C90",
  imageBox: "#E9E6E1",
  white: "#FFFFFF",
};

const ChevronLeft = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#F5EDDA"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

const HeartIcon = ({ $filled }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill={$filled ? "#D9534F" : "none"}
    stroke={$filled ? "#D9534F" : "#6F6459"}
    strokeWidth="1.8"
  >
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const CommentIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#6F6459"
    strokeWidth="1.8"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SendIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#A79C90"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#B8B0A6">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);

export default function DiaryDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  // 라우트: /diary/:diaryId/entry/:entryId (diaryId=방, entryId=일기)
  const { diaryId, entryId } = useParams();
  const { activeDiaryId, openDiary, openEntry } = useDiary();

  // 작성 직후 이동한 경우 방금 만든 일기를 시드로 받아 즉시 렌더한다.
  const seededEntry = location.state?.entry ?? null;

  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [showComments, setShowComments] = useState(false);

  // 일기 상세 조회 상태 (시드가 있으면 그 값으로 초기 렌더)
  const [entry, setEntry] = useState(seededEntry);
  const [loading, setLoading] = useState(
    seededEntry ? false : Boolean(activeDiaryId || entryId),
  );
  const [error, setError] = useState(null);

  // TODO: 확인 필요 - 좋아요/댓글 관련 백엔드 API가 문서에 없어 로컬 상태로만 동작(미저장)
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);

  // URL 직접 접근 시에도 컨텍스트를 동기화
  useEffect(() => {
    if (diaryId && entryId) openEntry(diaryId, entryId);
    else if (diaryId) openDiary(diaryId);
  }, [diaryId, entryId, openDiary, openEntry]);

  const targetDiaryId = activeDiaryId || entryId;

  // 시드가 있어도 상세를 최신화한다. (실패해도 시드가 있으면 화면은 유지)
  useEffect(() => {
    if (!targetDiaryId) return;
    let mounted = true;
    getDiary(targetDiaryId)
      .then((res) => mounted && setEntry(res))
      .catch((e) => mounted && !seededEntry && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [targetDiaryId, seededEntry]);

  const toggleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleSend = () => {
    if (!input.trim() || !entry) return;
    // TODO: 확인 필요 - 댓글 저장 API 없음. 우선 화면 로컬에만 추가.
    setComments((prev) => [
      ...prev,
      { id: Date.now(), author: "나", time: "방금 전", text: input.trim() },
    ]);
    setInput("");
  };

  if (loading) return null;
  if (error) {
    return (
      <Page>
        <TopBar>
          <BackBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
            <ChevronLeft />
          </BackBtn>
          <TopTitle>일기 기록</TopTitle>
        </TopBar>
        <Content>
          <TopTitle>{error}</TopTitle>
        </Content>
      </Page>
    );
  }
  if (!entry) return null;

  return (
    <Page>
      <TopBar>
        <BackBtn onClick={() => navigate(-1)} aria-label="뒤로가기">
          <ChevronLeft />
        </BackBtn>
        <TopTitle>일기 기록</TopTitle>
      </TopBar>

      <Content>
        <Card>
          <AuthorRow>
            <Avatar>
              <UserIcon />
            </Avatar>
            <AuthorName>{entry.userName}</AuthorName>
          </AuthorRow>

          <Title>{entry.title}</Title>
          <DateText>{fmtEntry(new Date(entry.targetDate))}</DateText>

          <ImageBox>
            {entry.diaryImage ? (
              <ImageBoxImg src={entry.diaryImage} alt="" />
            ) : (
              "이미지"
            )}
          </ImageBox>

          <Stats>
            <Stat onClick={toggleLike}>
              <HeartIcon $filled={liked} /> 좋아요 {likes}
            </Stat>
            <Stat onClick={() => setShowComments((v) => !v)}>
              <CommentIcon /> 댓글 {comments.length}
            </Stat>
          </Stats>

          <Text $expanded={expanded}>{entry.content}</Text>
          {!expanded && <More onClick={() => setExpanded(true)}>더보기</More>}

          {showComments && (
            <>
              <CommentLabel>댓글</CommentLabel>
              {comments.map((c) => (
                <CommentCard key={c.id}>
                  <CommentHead>
                    <Avatar>
                      <UserIcon />
                    </Avatar>
                    <div>
                      <CName>{c.author}</CName>
                      <CTime>{c.time}</CTime>
                    </div>
                  </CommentHead>
                  <CText>{c.text}</CText>
                </CommentCard>
              ))}
            </>
          )}
        </Card>
      </Content>

      {showComments && (
        <InputBar>
          <CommentInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="댓글을 입력해주세요."
          />
          <SendBtn onClick={handleSend} aria-label="댓글 전송">
            <SendIcon />
          </SendBtn>
        </InputBar>
      )}
    </Page>
  );
}

const Page = styled.div`
  position: relative;
  width: 390px;
  min-height: 844px;
  margin: 0 auto;
  background: #371e16;
`;

const TopBar = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  padding: 0 16px;
`;

const BackBtn = styled.button`
  position: absolute;
  left: 12px;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
`;

const TopTitle = styled.h2`
  color: #f5edda;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
`;

const Content = styled.main`
  padding: 24px 20px 110px;
`;

const Card = styled.article`
  background: ${C.cream};
  border-radius: 22px;
  padding: 26px 22px;
`;

const AuthorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

const Avatar = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #e3ddd4;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`;

const AuthorName = styled.span`
  font-size: 17px;
  color: ${C.text};
`;

const Title = styled.h3`
  font-size: 22px;
  font-weight: 700;
  color: ${C.text};
  margin: 0 0 6px;
`;

const DateText = styled.p`
  font-size: 15px;
  color: ${C.sub};
  margin: 0 0 18px;
`;

const ImageBox = styled.div`
  width: 100%;
  height: 240px;
  border-radius: 16px;
  background: ${C.imageBox};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${C.muted};
  font-size: 18px;
  margin-bottom: 20px;
`;

const ImageBoxImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
`;

const Stats = styled.div`
  display: flex;
  gap: 22px;
  margin-bottom: 16px;
`;

const Stat = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  font-size: 15px;
  color: ${C.text};
  cursor: pointer;
`;

const Text = styled.p`
  font-size: 15px;
  line-height: 1.75;
  color: ${C.text};
  margin: 0;

  ${({ $expanded }) =>
    !$expanded &&
    css`
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
    `}
`;

const More = styled.button`
  display: block;
  margin: 4px 0 0 auto;
  background: none;
  border: none;
  color: ${C.sub};
  font-size: 15px;
  cursor: pointer;
`;

const CommentLabel = styled.h4`
  font-size: 17px;
  font-weight: 700;
  color: ${C.text};
  margin: 28px 0 14px;
`;

const CommentCard = styled.div`
  background: ${C.white};
  border-radius: 16px;
  padding: 20px 18px;
  margin-bottom: 12px;
`;

const CommentHead = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

const CName = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: ${C.text};
  margin: 0;
`;

const CTime = styled.p`
  font-size: 13px;
  color: ${C.muted};
  margin: 2px 0 0;
`;

const CText = styled.p`
  font-size: 15px;
  color: ${C.text};
  text-decoration: underline;
  margin: 0;
`;

const InputBar = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 0;
  width: 390px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px 22px;
  background: ${C.bg};
`;

const CommentInput = styled.input`
  flex: 1;
  height: 48px;
  border: none;
  border-radius: 24px;
  padding: 0 20px;
  background: #ebe8e3;
  font-size: 15px;
  color: ${C.text};
  outline: none;

  &::placeholder {
    color: ${C.muted};
  }
`;

const SendBtn = styled.button`
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
`;
