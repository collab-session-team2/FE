import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { missionData } from "../../data/missionData";
import { getLevelInfo } from "../../utils/level";
import MissionCard from "../../components/mission/MissionCard";
import MissionDropdown from "../../components/mission/MissionDropdown";

const PageContainer = styled.div`
  width: 390px;
  height: 799px;
  background: #3f7aac;
`;

const Content = styled.main`
  padding: 37px 20px 60px;
`;

const LevelTitle = styled.p`
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 18px;
`;

const ProgressCard = styled.section`
  width: 364px;
  height: 125px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.3);
  margin-bottom: 42px;
  padding: 8px 7px 18px;
`;

const PointText = styled.p`
  display: block;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-left: 7px;
  margin-bottom: 7px;
`;

const ProgressBar = styled.div`
  width: 235px;
  height: 38px;
  border-radius: 100px;
  border: 1px solid #fff;
  background: #fff9e8;
  overflow: hidden;
  margin-bottom: 16px;
`;

const ProgressFill = styled.div`
  width: ${({ $percent }) => `${$percent}%`};
  height: 38px;
  border-radius: 100px;
  border: 1px solid #fff;
  background: #244460;
`;

const NextLevelText = styled.p`
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  margin-left: 7px;
`;

const MissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
`;

const MissionHeaderTitle = styled.h2`
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

const MissionListBox = styled.section`
  width: 350px;
  padding: 28px 24px;
  border-radius: 15px;
  background: #fff9e8;

  display: flex;
  flex-direction: column;
  gap: 40px;
`;

function MissionPage() {
  const navigate = useNavigate();

  // Easy / Hard는 이제 난이도 필터가 아니라 정렬 기준으로 사용
  const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");

  // TODO: API 연동 시 사용자 현재 포인트로 교체
  const totalPoint = 10;

  const levelInfo = getLevelInfo(totalPoint);

  const progressPercent =
    (levelInfo.currentPoint / levelInfo.requiredPoint) * 100;

  const sortedMissions = [...missionData].sort((a, b) => {
    if (selectedDifficulty === "Easy") {
      return a.point - b.point;
    }

    return b.point - a.point;
  });

  const handleVerifyClick = (missionId) => {
    navigate(`/mission/${missionId}/verify`);
  };

  return (
    <PageContainer>
      <Content>
        <LevelTitle>{levelInfo.levelName}</LevelTitle>

        <ProgressCard>
          <PointText>
            {levelInfo.currentPoint}/{levelInfo.requiredPoint}
          </PointText>

          <ProgressBar>
            <ProgressFill $percent={progressPercent} />
          </ProgressBar>

          <NextLevelText>다음 레벨 : {levelInfo.nextLevelName}</NextLevelText>
        </ProgressCard>

        <MissionHeader>
          <MissionHeaderTitle>현재 진행중인 미션</MissionHeaderTitle>

          <MissionDropdown
            selectedDifficulty={selectedDifficulty}
            onChangeDifficulty={setSelectedDifficulty}
          />
        </MissionHeader>

        <MissionListBox>
          {sortedMissions.map((mission) => (
            <MissionCard
              key={mission.id}
              mission={mission}
              onVerifyClick={() => handleVerifyClick(mission.id)}
            />
          ))}
        </MissionListBox>
      </Content>
    </PageContainer>
  );
}

export default MissionPage;
