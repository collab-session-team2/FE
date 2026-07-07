import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiImage } from "react-icons/fi";
import { useDiary } from "../../store/useDiary";
import { fmtMain } from "../../utils/date";
import { getDiaryRoomDetail } from "../../api/diaryRoom";
import { createDiary } from "../../api/diary";
import { uploadImage } from "../../api/image";

export default function DiaryWrite() {
  const navigate = useNavigate();
  const { activeRoomId } = useDiary();
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null); // 미리보기 URL
  const [imageFile, setImageFile] = useState(null); // 업로드용 파일
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 방 이름/내 차례 여부 조회
  const [detail, setDetail] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!activeRoomId) return;
    let mounted = true;
    getDiaryRoomDetail(activeRoomId)
      .then((res) => mounted && setDetail(res))
      .catch((e) => mounted && setError(e.message));
    return () => {
      mounted = false;
    };
  }, [activeRoomId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImageFile(file);
    setImage(URL.createObjectURL(file));
  };

  // 작성 완료 -> 이미지 먼저 업로드해 URL 획득 후 일기 등록
  const handleSubmit = async () => {
    if (submitting) return;
    if (!content.trim() && !title.trim()) return;
    // 내 차례가 아니면 작성 불가 (myTurn === false)
    if (detail && !detail.myTurn) {
      setError("아직 내 차례가 아니에요.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      let diaryImage = null;
      if (imageFile) {
        // 이미지 먼저 업로드 → URL 획득 후 diaryImage 로 전송
        const uploaded = await uploadImage(imageFile, "DIARY");
        diaryImage = uploaded.imageUrl;
      }
      // 작성 → 반환된 일기(diaryId 포함) 획득
      const created = await createDiary(activeRoomId, {
        title,
        content,
        diaryImage,
      });
      // 작성 완료 → 저장된 일기 상세로 이동.
      // - state.entry 로 방금 만든 객체를 시드해 상세가 즉시 렌더되게 하고,
      //   상세 화면이 getDiary 로 최신화한다.
      // - replace: 뒤로가기 시 작성 화면이 아니라 이전 화면으로 돌아가도록.
      navigate(`/diary/${activeRoomId}/entry/${created.diaryId}`, {
        replace: true,
        state: { entry: created },
      });
    } catch (e) {
      setError(e.message);
      setSubmitting(false);
    }
  };

  return (
    <Page>
      <Content>
        <Logo>SLAM BOOK</Logo>
        <DiaryTitle>{detail?.diaryRoomName}</DiaryTitle>
        <DateText>{fmtMain(new Date())}</DateText>

        <WriteCard>
          <HiddenInput
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <ImageUploadBox onClick={() => fileInputRef.current.click()}>
            {image ? (
              <PreviewImage src={image} alt="preview" />
            ) : (
              <>
                <FiImage />
                <span>원하는 이미지를 선택하세요.</span>
              </>
            )}
          </ImageUploadBox>

          <TitleInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요."
          />

          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <SubmitButton onClick={handleSubmit} disabled={submitting}>
            {submitting ? "등록 중..." : "작성 완료"}
          </SubmitButton>
          {error && <ErrorText>{error}</ErrorText>}
        </WriteCard>
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

const WriteCard = styled.div`
  width: 350px;
  min-height: 522px;
  background: #fff8e8;
  border-radius: 20px;
  padding: 28px;
`;

const HiddenInput = styled.input`
  display: none;
`;

const ImageUploadBox = styled.div`
  width: 294px;
  height: 169px;
  background: #eeeeee;
  border-radius: 14px;
  margin-bottom: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #808080;
  cursor: pointer;
  overflow: hidden;

  svg {
    font-size: 33px;
    margin-bottom: 12px;
  }

  span {
    font-size: 12px;
    font-weight: 400;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TitleInput = styled.input`
  width: 294px;
  height: 44px;
  border: none;
  border-radius: 14px;
  background: white;
  outline: none;
  padding: 0 16px;
  margin-bottom: 14px;
  font-size: 16px;
  font-weight: 700;
`;

const TextArea = styled.textarea`
  width: 294px;
  height: 211px;
  border: none;
  border-radius: 14px;
  background: white;
  resize: none;
  outline: none;
  padding: 16px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  width: 294px;
  height: 44px;
  border: none;
  border-radius: 14px;
  background: #102550;
  color: white;
  font-size: 14px;
  font-weight: 400;
  margin-top: 20px;
  cursor: pointer;
`;

const ErrorText = styled.p`
  color: #c0392b;
  font-size: 13px;
  margin-top: 10px;
`;
