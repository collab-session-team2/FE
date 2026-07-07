import styled from "styled-components";

import completeImage from "../../assets/images/mission_complete_image.svg";
import closeIcon from "../../assets/icons/close_icon.svg";

const ModalOverlay = styled.div`
  position: absolute;
  inset: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.25);
  z-index: 100;
`;

const ModalBox = styled.div`
  position: relative;

  width: 320px;
  height: 430px;

  border-radius: 20px;
  background: #fff;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 68px 24px 32px;
  box-sizing: border-box;

  transform: scale(0.9);
  transform-origin: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;

  width: 20px;
  height: 20px;

  border: none;
  background: none;
  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;

const CloseIcon = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
`;

const ModalTitle = styled.h2`
  width: 100%;
  margin: 0;

  color: #371e16;
  text-align: center;
  font-family: SUITE;
  font-size: 25px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const PointText = styled.span`
  color: #3f7aac;
`;

const CompleteImage = styled.img`
  width: 250px;
  height: auto;

  margin-top: 34px;
  object-fit: contain;
`;

function MissionCompleteModal({ point, onClose }) {
  return (
    <ModalOverlay>
      <ModalBox>
        <CloseButton type="button" onClick={onClose}>
          <CloseIcon src={closeIcon} alt="닫기" />
        </CloseButton>

        <ModalTitle>
          미션 인증완료
          <br />
          <PointText>{point}p</PointText> 획득!
        </ModalTitle>

        <CompleteImage src={completeImage} alt="미션 완료 이미지" />
      </ModalBox>
    </ModalOverlay>
  );
}

export default MissionCompleteModal;
