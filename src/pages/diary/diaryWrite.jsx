import { useRef, useState } from "react";
import styled from "styled-components";
import { FiImage } from "react-icons/fi";
import Footer from "../../components/footer/Footer";

export default function DiaryWrite() {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(URL.createObjectURL(file));
  };

  return (
    <Page>
      <Content>
        <Logo>SLAM BOOK</Logo>
        <DiaryTitle>걸스토크</DiaryTitle>
        <DateText>07.08.2026</DateText>

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

          <TextArea />

          <SubmitButton>작성 완료</SubmitButton>
        </WriteCard>
      </Content>

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
  padding: 67px 20px 120px;
`;

const Logo = styled.h1`
  color: white;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
  font-family: "SUITE", sans-serif;
`;
const DiaryTitle = styled.h2`
  color: #fff8e8;
  font-size: 33px;
  font-weight: 700;
  margin-bottom: 8px;
  font-family: "SUITE", sans-serif;
`;

const DateText = styled.p`
  color: white;
  font-size: 16px;
  font-weight: 400;
  margin-bottom: 28px;
  font-family: "SUITE", sans-serif;
`;

const WriteCard = styled.div`
  width: 350px;
  height: 522px;
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
  font-family: "SUITE", sans-serif;
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
  font-family: "SUITE", sans-serif;
`;
