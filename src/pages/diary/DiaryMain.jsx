import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import CasualFriendCard from "../../assets/images/casualFriend.svg";
import CloseFriendCard from "../../assets/images/closeFriend.svg";
import DiaryLook from "./DiaryLook";
import { useDiary } from "../../store/useDiary";
import {
  addDays,
  fmtMain,
  isSameDay,
  startOfDay,
  weekEn,
} from "../../utils/date";
import { getDiaryRoomDetail } from "../../api/diaryRoom";

export default function DiaryMain() {
  const navigate = useNavigate();
  const { diaryId } = useParams();
  const { activeRoomId, openDiary } = useDiary();

  // URL 직접 접근 시에도 현재 방을 동기화 (diaryId = diaryRoomId)
  useEffect(() => {
    if (diaryId) openDiary(diaryId);
  }, [diaryId, openDiary]);

  const roomId = activeRoomId || diaryId;

  // 방 상세 조회 상태
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(Boolean(roomId));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    let mounted = true;
    getDiaryRoomDetail(roomId)
      .then((res) => mounted && setDetail(res))
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [roomId]);

  const today = startOfDay(new Date());
  const [weekOffset, setWeekOffset] = useState(0); // 0 = 오늘이 가운데

  const centerDate = addDays(today, weekOffset); // 선택 = 가운데
  const days = [-2, -1, 0, 1, 2].map((i) => addDays(centerDate, i));

  const selectedIsToday = isSameDay(centerDate, today);
  const selectedIsPast = centerDate < today;

  // 날짜 클릭 -> 해당 날짜를 가운데로 (미래는 불가)
  const pickDay = (idx) => {
    const next = weekOffset + (idx - 2);
    if (next > 0) return;
    setWeekOffset(next);
  };

  // 내 차례 여부(myTurn) / 현재 차례 사용자명(currentTurnUserName)
  const isMyTurn = !!detail?.myTurn;
  const turn = {
    isMine: isMyTurn,
    name: detail?.currentTurnUserName || "",
    label: isMyTurn ? "MY TURN" : `${detail?.currentTurnUserName || ""} Turn`,
  };
  // TODO: 확인 필요 - NO.00X(방 생성 순번) 필드가 상세 응답에 없음. 우선 1 고정.
  const order = 1;
  const cardSvg = order === 1 ? CasualFriendCard : CloseFriendCard;

  return (
    <Page>
      <Content>
        <Logo>SLAM BOOK</Logo>

        <DiaryTitle>{detail?.diaryRoomName}</DiaryTitle>
        <DateText>{fmtMain(centerDate)}</DateText>

        {loading && <DateText>불러오는 중...</DateText>}
        {error && <DateText>{error}</DateText>}

        <DayList>
          <Arrow onClick={() => setWeekOffset((o) => o - 1)}>‹</Arrow>
          {days.map((d, idx) => {
            const active = idx === 2;
            const future = d > today;
            return (
              <DayItem key={d.toISOString()} onClick={() => pickDay(idx)}>
                <DayName $active={active} $future={future}>
                  {weekEn(d)}
                </DayName>
                <DateCircle $active={active} $future={future}>
                  {d.getDate()}
                </DateCircle>
              </DayItem>
            );
          })}
          <Arrow
            $disabled={weekOffset >= 0}
            onClick={() => weekOffset < 0 && setWeekOffset((o) => o + 1)}
          >
            ›
          </Arrow>
        </DayList>

        {selectedIsToday ? (
          <>
            <CardWrap>
              <CardImage src={cardSvg} alt="friend card" />
              {detail?.diaryRoomImage && (
                <CardPhoto src={detail.diaryRoomImage} alt="대표 사진" />
              )}
              <CardNo>
                NO.<CardNoNum>{String(order).padStart(3, "0")}</CardNoNum>
              </CardNo>
            </CardWrap>

            <MyTurnBox>
              <MyTurnTitle>{turn.label}</MyTurnTitle>
              {turn.isMine ? (
                <>
                  <MyTurnText>오늘 하루, 당신의 일상을 적어보세요</MyTurnText>
                  <WriteButton
                    onClick={() => navigate(`/diary/${roomId}/write`)}
                  >
                    일기 작성하러 가기
                  </WriteButton>
                </>
              ) : (
                <>
                  <MyTurnText>
                    친구가 교환일기를 작성하는 동안 그동안의 일기장을 구경하러
                    가볼까요?
                  </MyTurnText>
                  <WriteButton
                    onClick={() => navigate(`/diary/${roomId}/look`)}
                  >
                    지난 기록 보기
                  </WriteButton>
                </>
              )}
            </MyTurnBox>
          </>
        ) : (
          selectedIsPast && <DiaryLook embedded date={centerDate} />
        )}
      </Content>
    </Page>
  );
}

const Page = styled.div`
  width: 390px;
  min-height: 844px;
  margin: 0 auto;
  background: #371e16;
`;

const Content = styled.div`
  padding: 67px 20px 120px;
`;

const Logo = styled.h1`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const DiaryTitle = styled.h2`
  color: #fff8e8;
  font-size: 33px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const DateText = styled.p`
  color: white;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 28px;
`;

const DayList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 34px;
`;

const Arrow = styled.button`
  border: none;
  background: transparent;
  color: white;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  opacity: ${({ $disabled }) => ($disabled ? 0.25 : 1)};
`;

const DayItem = styled.button`
  width: 52px;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const DayName = styled.p`
  color: white;
  opacity: ${({ $future }) => ($future ? 0.35 : 1)};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 800 : 400)};
  margin-bottom: 12px;
`;

const DateCircle = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: ${({ $active }) =>
    $active ? "6px double #fff8e8" : "1.5px solid white"};
  background: ${({ $active }) =>
    $active ? "rgba(255, 255, 255, 0.18)" : "transparent"};
  color: white;
  opacity: ${({ $future }) => ($future ? 0.35 : 1)};
  font-size: 18px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardWrap = styled.div`
  position: relative;
  width: 350px;
  height: 209px;
  margin-bottom: 28px;
`;

const CardImage = styled.img`
  width: 350px;
  height: 209px;
  object-fit: cover;
  border-radius: 20px;
`;

const CardPhoto = styled.img`
  position: absolute;
  left: 8.7%;
  top: 16.6%;
  width: 31.9%;
  height: 67.5%;
  object-fit: cover;
`;

const CardNo = styled.span`
  position: absolute;
  left: 62%;
  top: 43%;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  color: #2e2621;
`;

const CardNoNum = styled.span`
  font-family: "Post No Bills Jaffna", sans-serif;
  font-weight: 800;
`;

const MyTurnBox = styled.div`
  width: 350px;
  min-height: 211px;
  background: #fff9e8;
  border-radius: 20px;
  padding: 34px 28px;
`;

const MyTurnTitle = styled.h2`
  color: black;
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 10px;
`;

const MyTurnText = styled.p`
  color: black;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 50px;
`;
const WriteButton = styled.button`
  width: 294px;
  height: 44px;
  border: none;
  border-radius: 14px;
  background: #102550;
  color: white;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
`;
