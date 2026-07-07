import { useState, useRef } from "react";
import styled from "styled-components";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDiary } from "../../store/useDiary";

export default function RoomCreate() {
  const navigate = useNavigate();
  const { createRoom, openDiary } = useDiary();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [createdRoomId, setCreatedRoomId] = useState(null);

  const [roomName, setRoomName] = useState("");
  // 선택된 인원수
  const [selectedPeople, setSelectedPeople] = useState(null);

  // 이미지 미리보기 & 파일 input 참조
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // 모든 정보 입력 여부 (이름 + 인원수 + 대표 사진)
  const isFormComplete =
    roomName.trim() !== "" && selectedPeople !== null && !!imagePreview;

  const handleCreateRoom = () => {
    if (!isFormComplete) return;
    // 방코드 발급 + 전체 유저 기준 생성 순번 배정
    const { code, id } = createRoom({
      name: roomName,
      peopleCount: selectedPeople || 4,
      photo: imagePreview,
    });
    setRoomCode(code);
    setCreatedRoomId(id);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    if (createdRoomId) {
      openDiary(createdRoomId);
      navigate(`/diary/${createdRoomId}`);
      return;
    }
    navigate("/");
  };

  // 이미지 박스 클릭 -> 숨겨진 file input 열기
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 파일 선택 시 미리보기 생성
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const peopleOptions = [2, 3, 4, 5];

  return (
    <Container>
      <Title>SLAM BOOK</Title>

      <FormWrapper>
        <Section>
          <Label>일기장 이름</Label>
          <Input
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
        </Section>

        <Section>
          <Label>인원수 선택</Label>
          <PeopleWrapper>
            {peopleOptions.map((num) => (
              <PeopleButton
                key={num}
                $active={selectedPeople === num}
                onClick={() => setSelectedPeople(num)}
              >
                {num}명
              </PeopleButton>
            ))}
          </PeopleWrapper>
        </Section>

        <Section>
          <Label>일기장 대표 사진</Label>
          <ImageBox onClick={handleImageClick} $hasImage={!!imagePreview}>
            {imagePreview ? (
              <PreviewImage src={imagePreview} alt="대표 사진 미리보기" />
            ) : (
              <>
                <FiImage />
                <ImageMainText>사진 추가하기</ImageMainText>
                <ImageSubText>방 대표 사진을 골라주세요</ImageSubText>
              </>
            )}
          </ImageBox>

          <HiddenInput
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </Section>

        <CreateButton
          onClick={handleCreateRoom}
          disabled={!isFormComplete}
          $disabled={!isFormComplete}
        >
          일기장 생성하기
        </CreateButton>
      </FormWrapper>

      {isModalOpen && (
        <ModalOverlay>
          <ModalBox>
            <ModalTitle>생성 완료!</ModalTitle>
            <ModalText>일기장이 생성되었습니다.</ModalText>

            <CodeBox>
              <CodeLabel>방 코드</CodeLabel>
              <RoomCode>{roomCode}</RoomCode>
            </CodeBox>

            <CloseButton onClick={handleConfirm}>확인</CloseButton>
          </ModalBox>
        </ModalOverlay>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 390px;
  min-height: 844px;
  margin: 0 auto;
  background: #371E16;
  padding: 80px 21px 34px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 88px;
`;

const FormWrapper = styled.div`
  margin-top: -30px;
`;

const Section = styled.div`
  margin-bottom: 38px;
`;

const Label = styled.p`
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 18px;
`;

const Input = styled.input`
  width: 348px;
  height: 52px;
  border-radius: 16px;
  border: 1.5px solid #fff;
  background: transparent;
  outline: none;
  color: white;
  font-size: 18px;
  padding: 0 16px;
`;

const PeopleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const PeopleButton = styled.button`
  width: 66px;
  height: 44px;
  border-radius: 12px;
  border: 1.5px solid #fff;
  background: ${(props) =>
    props.$active ? "rgba(255, 255, 255, 0.35)" : "transparent"};
  color: white;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;
`;

const ImageBox = styled.div`
  width: 348px;
  height: 190px;
  background: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #777;
  cursor: pointer;
  overflow: hidden;
  padding: 0;

  svg {
    font-size: 48px;
    margin-bottom: 10px;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImageMainText = styled.p`
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const ImageSubText = styled.p`
  font-size: 13px;
  font-weight: 500;
`;

const CreateButton = styled.button`
  width: 348px;
  height: 58px;
  border-radius: 30px;
  border: none;
  background: ${({ $disabled }) => ($disabled ? "#6b6259" : "#497092")};
  color: ${({ $disabled }) => ($disabled ? "#b3aca3" : "white")};
  font-size: 24px;
  font-weight: 700;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  margin-top: -10px;
  transition: background 0.15s ease, opacity 0.15s ease;
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
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
  font-size: 28px;
  font-weight: 900;
  color: #4382b2;
  margin-bottom: 12px;
`;

const ModalText = styled.p`
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 24px;
`;

const CodeBox = styled.div`
  background: white;
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 24px;
`;

const CodeLabel = styled.p`
  font-size: 14px;
  font-weight: 700;
  color: #777;
  margin-bottom: 8px;
`;

const RoomCode = styled.p`
  font-size: 30px;
  font-weight: 900;
  letter-spacing: 3px;
  color: #4382b2;
`;

const CloseButton = styled.button`
  width: 100%;
  height: 44px;
  border: none;
  border-radius: 14px;
  background: #4d7fa8;
  color: white;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
`;
