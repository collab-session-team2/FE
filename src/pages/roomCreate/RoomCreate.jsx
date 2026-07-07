import { useState } from "react";
import styled from "styled-components";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function RoomCreate() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomCode, setRoomCode] = useState("");

  const handleCreateRoom = () => {
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(randomCode);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  return (
    <Container>
      <Title>SLAM BOOK</Title>

      <FormWrapper>
        <Section>
          <Label>일기장 이름</Label>
          <Input />
        </Section>

        <Section>
          <Label>인원수 선택</Label>
          <PeopleWrapper>
            <PeopleButton>2명</PeopleButton>
            <PeopleButton>3명</PeopleButton>
            <PeopleButton>4명</PeopleButton>
            <PeopleButton>5명</PeopleButton>
          </PeopleWrapper>
        </Section>

        <Section>
          <Label>일기장 대표 사진</Label>
          <ImageBox>
            <FiImage />
            <ImageMainText>사진 추가하기</ImageMainText>
            <ImageSubText>미션 인증 사진을 올려주세요</ImageSubText>
          </ImageBox>
        </Section>

        <CreateButton onClick={handleCreateRoom}>일기장 생성하기</CreateButton>
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
  background: #3f7aac;
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
  background: transparent;
  color: white;
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
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

  svg {
    font-size: 48px;
    margin-bottom: 10px;
  }
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
  background: #497092;
  color: white;
  font-size: 24px;
  font-weight: 700;
  cursor: pointer;
  margin-top: -10px;
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
