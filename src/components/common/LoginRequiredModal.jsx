import styled from "styled-components";

// "로그인이 필요합니다" 안내 모달.
// 확인 버튼을 누르면 /login 으로 이동한다. (이동은 상위에서 onConfirm으로 처리)
export default function LoginRequiredModal({ onConfirm }) {
  return (
    <Overlay>
      <Box>
        <Title>로그인이 필요합니다</Title>
        <Text>이 기능은 로그인 후 이용할 수 있어요.</Text>
        <ConfirmButton type="button" onClick={onConfirm}>
          확인
        </ConfirmButton>
      </Box>
    </Overlay>
  );
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Box = styled.div`
  width: 300px;
  background: #fff8e8;
  border-radius: 24px;
  padding: 32px 24px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 900;
  color: #102550;
  margin-bottom: 10px;
`;

const Text = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #555;
  margin-bottom: 24px;
`;

const ConfirmButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 14px;
  background: #4d7fa8;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  cursor: pointer;
`;
