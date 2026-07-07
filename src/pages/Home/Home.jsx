import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Footer from "../../components/footer/Footer";
import { FiPlus } from "react-icons/fi";
import { useDiary } from "../../store/DiaryContext";
import { getDiaryRooms, joinDiaryRoom } from "../../api/diaryRoom";

export default function Home() {
  const navigate = useNavigate();
  const { openDiary } = useDiary();

  // 방 목록 조회 상태
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 모달 단계: null | "choice" | "code"
  const [modalStep, setModalStep] = useState(null);
  const [code, setCode] = useState("");

  // 방 목록 조회
  const fetchRooms = () => {
    setLoading(true);
    return getDiaryRooms()
      .then((res) => setDiaries(res || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    let mounted = true;
    getDiaryRooms()
      .then((res) => mounted && setDiaries(res || []))
      .catch((e) => mounted && setError(e.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const openChoiceModal = () => setModalStep("choice");
  const closeModal = () => {
    setModalStep(null);
    setCode("");
  };

  // 방 생성하기 -> RoomCreate 페이지로 이동
  const goCreateRoom = () => {
    closeModal();
    navigate("/create");
  };

  // 코드로 참여하기 -> 참여 후 방 목록 리페치
  const joinByCode = async () => {
    if (!code.trim()) return;
    try {
      await joinDiaryRoom(code.trim());
      closeModal();
      await fetchRooms();
    } catch (e) {
      setError(e.message);
    }
  };

  // 일기장 클릭 -> 해당 방 열고 DiaryMain 이동
  const goDiary = (id) => {
    openDiary(id);
    navigate("/diaryMain");
  };

  return (
    <Page>
      <Content>
        <Header>
          <PageTitle>교환일기장</PageTitle>
          <AddButton onClick={openChoiceModal}>
            <FiPlus size={24} />
          </AddButton>
        </Header>

        {loading ? (
          <EmptyBox>
            <EmptyText>불러오는 중...</EmptyText>
          </EmptyBox>
        ) : error ? (
          <EmptyBox>
            <EmptyText>일기장을 불러오지 못했어요</EmptyText>
            <EmptySubText>{error}</EmptySubText>
          </EmptyBox>
        ) : diaries.length === 0 ? (
          <EmptyBox>
            <EmptyText>아직 생성된 일기장이 없어요</EmptyText>
            <EmptySubText>+ 버튼을 눌러 일기장을 만들어보세요</EmptySubText>
          </EmptyBox>
        ) : (
          <Grid>
            {diaries.map((diary) => (
              <DiaryCard
                key={diary.diaryRoomId}
                onClick={() => goDiary(diary.diaryRoomId)}
              >
                <CardInner>
                  <CardImage $src={diary.diaryRoomImage} />
                  <CardTab />
                </CardInner>
                <CardLabel>{diary.diaryRoomName}</CardLabel>
              </DiaryCard>
            ))}
          </Grid>
        )}
      </Content>

      {/* 선택 모달 */}
      {modalStep === "choice" && (
        <ModalOverlay onClick={closeModal}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>일기장 추가</ModalTitle>
            <ModalText>어떻게 시작할까요?</ModalText>

            <ModalButton onClick={() => setModalStep("code")}>
              코드로 참여하기
            </ModalButton>
            <ModalButton $primary onClick={goCreateRoom}>
              방 생성하기
            </ModalButton>

            <CancelButton onClick={closeModal}>취소</CancelButton>
          </ModalBox>
        </ModalOverlay>
      )}

      {/* 코드 입력 모달 */}
      {modalStep === "code" && (
        <ModalOverlay onClick={closeModal}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>코드로 참여하기</ModalTitle>
            <ModalText>초대받은 방 코드를 입력해주세요</ModalText>

            <CodeInput
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="예) A1B2C3"
              maxLength={6}
            />

            <ModalButton $primary onClick={joinByCode}>
              참여하기
            </ModalButton>
            <CancelButton onClick={() => setModalStep("choice")}>
              뒤로
            </CancelButton>
          </ModalBox>
        </ModalOverlay>
      )}

      <Footer />
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
  padding: 40px 24px 120px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

const PageTitle = styled.h1`
  color: #fff8e8;
  font-size: 28px;
  font-weight: 600;
`;

const AddButton = styled.button`
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 12px;
  background: #fff8e8;
  color: #371e16;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const EmptyBox = styled.div`
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const EmptyText = styled.p`
  color: #fff8e8;
  font-size: 18px;
  font-weight: 700;
`;

const EmptySubText = styled.p`
  color: #b8a9a0;
  font-size: 14px;
  font-weight: 400;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 16px;
`;

const DiaryCard = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardInner = styled.div`
  position: relative;
  width: 100%;
  height: 210px;
  background: #d0d9ee;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  padding-top: 24px;
`;

const CardImage = styled.div`
  width: 78%;
  height: 100px;
  background: #ffffff;
  border-radius: 4px;
  ${({ $src }) =>
    $src &&
    `background-image: url(${$src}); background-size: cover; background-position: center;`}
`;

const CardTab = styled.div`
  position: absolute;
  top: 90px;
  right: -6px;
  width: 30px;
  height: 46px;
  background: #9aa5cf;
  border-radius: 10px;
`;

const CardLabel = styled.p`
  margin-top: 12px;
  color: #fff8e8;
  font-size: 15px;
  font-weight: 700;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
`;

const ModalBox = styled.div`
  width: 300px;
  background: #fff8e8;
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 900;
  color:  #102550
  margin-bottom: 8px;
`;

const ModalText = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #555;
  margin-bottom: 24px;
`;

const CodeInput = styled.input`
  width: 100%;
  height: 48px;
  border-radius: 14px;
  border: 1.5px solid #ccc;
  background: #fff;
  outline: none;
  text-align: center;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #333;
  margin-bottom: 20px;

  &:focus {
    border-color: #4382b2;
  }
`;

const ModalButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 14px;
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
  background: ${({ $primary }) => ($primary ? "#4d7fa8" : "#d0d9ee")};
  color: ${({ $primary }) => ($primary ? "#fff" : "#33507a")};
`;

const CancelButton = styled.button`
  width: 100%;
  height: 40px;
  border: none;
  background: transparent;
  color: #999;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 4px;
`;
