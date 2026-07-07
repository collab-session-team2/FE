import styled from "styled-components";

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 302px;
  height: 39px;
`;

const MissionInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MissionTitle = styled.p`
  color: #000;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  align-self: stretch;
`;

const MissionPoint = styled.p`
  color: #3f7aac;
  font-family: "Pretendard Variable";
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const VerifyButton = styled.button`
  width: 74px;
  height: 30px;
  border: none;
  border-radius: 100px;
  background-color: ${({ $completed }) => ($completed ? "#3F7AAC" : "#A4BCD2")};
  color: ${({ $completed }) => ($completed ? "#fff" : "#000")};
  font-family: "Pretendard Variable";
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  cursor: pointer;
`;

function MissionCard({ mission, onVerifyClick }) {
  return (
    <Card>
      <MissionInfo>
        <MissionTitle>{mission.title}</MissionTitle>
        <MissionPoint>{mission.point} point</MissionPoint>
      </MissionInfo>

      <VerifyButton
        type="button"
        onClick={onVerifyClick}
        $completed={mission.completed}
      >
        {mission.completed ? "인증완료" : "인증하기"}
      </VerifyButton>
    </Card>
  );
}

export default MissionCard;
