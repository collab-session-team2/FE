import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import MissionCard from "../../components/mission/MissionCard";
import MissionDropdown from "../../components/mission/MissionDropdown";
import { getMissions } from "../../api/missionApi";
import { useDiary } from "../../store/useDiary";
import { getLevelInfo } from "../../utils/level";

// 완료한 미션들의 exp 합으로 누적 포인트(레벨 경험치)를 계산한다.
const sumCompletedExp = (missions) =>
  missions.filter((m) => m.complete).reduce((sum, m) => sum + (m.exp ?? 0), 0);

function MissionPage() {
  const navigate = useNavigate();
  const { activeRoomId, activeMissions, activeTotalPoint, setMissionData } =
    useDiary();
  const [selectedDifficulty, setSelectedDifficulty] = useState("Easy");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    // 방이 선택되지 않았으면 조회하지 않는다. (안내 문구는 렌더에서 처리)
    if (!activeRoomId) return;

    const loadMissions = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        // 기본 정렬 asc(오름차순). data 배열을 그대로 받는다.
        const missions = await getMissions(activeRoomId, "asc");
        if (!ignore) {
          setMissionData({
            missions,
            totalPoint: sumCompletedExp(missions),
          });
        }
      } catch (error) {
        if (!ignore) {
          setErrorMessage(error.message);
          setMissionData({ missions: [], totalPoint: 0 });
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    loadMissions();

    return () => {
      ignore = true;
    };
  }, [activeRoomId, setMissionData]);

  const levelInfo = getLevelInfo(activeTotalPoint);
  const progressPercent =
    (levelInfo.currentPoint / levelInfo.requiredPoint) * 100;

  const sortedMissions = [...activeMissions].sort((a, b) => {
    if (selectedDifficulty === "Easy") {
      return a.exp - b.exp;
    }

    return b.exp - a.exp;
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
          {!activeRoomId && (
            <StateText>먼저 교환일기 방을 선택해주세요.</StateText>
          )}
          {activeRoomId && isLoading && (
            <StateText>미션을 불러오는 중입니다.</StateText>
          )}
          {activeRoomId && !isLoading && errorMessage && (
            <StateText>{errorMessage}</StateText>
          )}
          {activeRoomId &&
            !isLoading &&
            !errorMessage &&
            sortedMissions.length === 0 && (
              <StateText>진행 중인 미션이 없습니다.</StateText>
            )}
          {activeRoomId &&
            !isLoading &&
            !errorMessage &&
            sortedMissions.map((mission) => (
              <MissionCard
                key={mission.missionId}
                mission={mission}
                onVerifyClick={() => handleVerifyClick(mission.missionId)}
              />
            ))}
        </MissionListBox>
      </Content>
    </PageContainer>
  );
}

export default MissionPage;

const PageContainer = styled.div`
  width: 390px;
  height: 799px;
  margin: 0 auto;
  background: #371e16;

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
  padding: 37px 20px 80px;
  box-sizing: border-box;
`;

const LevelTitle = styled.p`
  color: #fff9e8;
  font-family: SUITE;
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin-bottom: 18px;
`;

const ProgressCard = styled.section`
  width: 350px;
  height: 118px;
  box-sizing: border-box;
  border-radius: 15px;
  background: #d0d9ee;
  margin-bottom: 46px;
  padding: 12px 15px 19px;
`;

const PointText = styled.p`
  color: #102550;
  font-family: SUITE;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  border-radius: 100px;
  margin-bottom: 7px;
`;

const ProgressBar = styled.div`
  width: 318px;
  height: 22px;
  border-radius: 100px;
  border: 1px solid #fff;
  background: #fff9e8;
  overflow: hidden;
  margin-bottom: 20px;
`;

const ProgressFill = styled.div`
  width: ${({ $percent }) => `${$percent}%`};
  height: 100%;
  border-radius: 100px;
  border: 1px solid #fff;
  background: #102550;
`;

const NextLevelText = styled.p`
  color: #102550;
  font-family: SUITE;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

const MissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
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
  width: 100%;
  box-sizing: border-box;
  padding: 28px 24px 80px;
  border-radius: 15px;
  background: #fff9e8;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const StateText = styled.p`
  color: #102550;
  font-family: "Pretendard Variable";
  font-size: 15px;
  font-weight: 600;
  text-align: center;
`;
