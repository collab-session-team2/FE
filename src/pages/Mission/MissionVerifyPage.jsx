import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { uploadImage } from "../../api/image";
import { verifyMission } from "../../api/missionApi";
import MissionCompleteModal from "../../components/mission/MissionCompleteModal";
import { useDiary } from "../../store/useDiary";

import backIcon from "../../assets/icons/back_icon.svg";
import imageIcon from "../../assets/icons/image_icon.svg";

function MissionVerifyPage() {
  const navigate = useNavigate();
  const { missionId } = useParams();
  const { activeRoomId, getMissionById, completeMission } = useDiary();

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentMission = getMissionById(missionId);
  const missionPoint = currentMission?.exp || 0;

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleCompleteClick = async () => {
    if (!selectedFile) {
      alert("미션 인증 사진을 추가해주세요.");
      return;
    }

    if (!activeRoomId) {
      alert("방 정보가 없어 인증할 수 없습니다. 미션 목록에서 다시 진입해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1) 사진을 먼저 업로드해 URL(imageUrl)을 받는다.
      const { imageUrl } = await uploadImage(selectedFile, "MISSION");
      // 2) 받은 URL 을 missionImage 로 담아 인증 요청. 응답은 갱신된 미션 객체.
      await verifyMission(activeRoomId, missionId, { missionImage: imageUrl });
      // 3) 캐시된 목록을 즉시 갱신(complete/exp 반영). 목록 화면으로 돌아가면
      //    MissionPage 가 재마운트되며 서버 기준으로 다시 조회한다.
      completeMission(missionId);
      setIsModalOpen(true);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/mission");
  };

  return (
    <PageContainer>
      <Content>
        <Header>
          <BackButton type="button" onClick={() => navigate(-1)}>
            <BackIcon src={backIcon} alt="뒤로가기" />
          </BackButton>

          <PageTitle>미션 인증하기</PageTitle>
        </Header>

        <NoticeBox>
          <NoticeTitle>미션 인증 주의사항</NoticeTitle>
          <NoticeText>
            흔들리거나 흐린 사진은 인증되지 않을 수 있어요.
          </NoticeText>
        </NoticeBox>

        <UploadBox>
          {previewImage ? (
            <PreviewImage src={previewImage} alt="미션 인증 사진" />
          ) : (
            <UploadLabel htmlFor="mission-image">
              <UploadImageIcon src={imageIcon} alt="사진 추가 아이콘" />
              <UploadTitle>사진 추가하기</UploadTitle>
              <UploadText>미션 인증 사진을 올려주세요.</UploadText>
            </UploadLabel>
          )}

          {previewImage && <UploadLabel htmlFor="mission-image" />}

          <UploadInput
            id="mission-image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </UploadBox>

        <CompleteButton
          type="button"
          onClick={handleCompleteClick}
          disabled={isSubmitting}
        >
          {isSubmitting ? "인증 중..." : "인증 완료"}
        </CompleteButton>
      </Content>

      {isModalOpen && (
        <MissionCompleteModal point={missionPoint} onClose={handleCloseModal} />
      )}
    </PageContainer>
  );
}

export default MissionVerifyPage;

const PageContainer = styled.div`
  width: 390px;
  height: 799px;
  margin: 0 auto;
  background: #371e16;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Content = styled.main`
  width: 100%;
  min-height: 100%;
  padding: 18px 20px 264px;
  box-sizing: border-box;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 103px;
  margin-bottom: 49px;
`;

const BackButton = styled.button`
  width: 22px;
  height: 22px;
  border: none;
  background: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const BackIcon = styled.img`
  width: 9px;
  height: 16.019px;
  object-fit: contain;
`;

const PageTitle = styled.h1`
  color: #fff;
  font-family: SUITE;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const NoticeBox = styled.div`
  margin-bottom: 32px;
`;

const NoticeTitle = styled.p`
  margin: 0 0 3px;
  color: #fff;
  font-family: SUITE;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const NoticeText = styled.p`
  margin-bottom: 32px;
  color: #fff;
  font-family: SUITE;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const UploadBox = styled.section`
  position: relative;
  width: 350px;
  height: 200px;
  border-radius: 15px;
  background: #fff9e8;
  overflow: hidden;
  margin-bottom: 37px;
`;

const UploadLabel = styled.label`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const UploadInput = styled.input`
  display: none;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadImageIcon = styled.img`
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  object-fit: contain;
`;

const UploadTitle = styled.p`
  margin: 0 0 6px;
  color: #7c7c7c;
  font-family: "Pretendard Variable";
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const UploadText = styled.p`
  margin: 0;
  color: #9a7a6c;
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
`;

const CompleteButton = styled.button`
  color: #102550;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: flex;
  width: 349px;
  height: 49px;
  padding: 15px 0;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  border: none;
  background: #d0d9ee;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;
