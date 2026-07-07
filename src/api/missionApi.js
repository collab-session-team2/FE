import api from "./axiosInstance";

const normalizeMission = (mission) => ({
  id: mission.missionId ?? mission.id,
  title: mission.title ?? mission.missionTitle ?? mission.name ?? "",
  point: mission.point ?? mission.points ?? mission.score ?? 0,
  completed: mission.completed ?? mission.isCompleted ?? mission.verified ?? false,
});

const unwrapMissionList = (response) => {
  const data = response?.data ?? response;
  if (Array.isArray(data)) return data;
  return data?.missions ?? data?.content ?? data?.items ?? [];
};

const getTotalPointFromResponse = (response, missions) => {
  const data = response?.data ?? response;
  return (
    data?.totalPoint ??
    data?.currentPoint ??
    data?.point ??
    missions
      .filter((mission) => mission.completed)
      .reduce((sum, mission) => sum + mission.point, 0)
  );
};

export async function fetchMissions() {
  const response = await api.get("/api/missions");
  const missions = unwrapMissionList(response).map(normalizeMission);

  return {
    missions,
    totalPoint: getTotalPointFromResponse(response, missions),
  };
}

export async function verifyMission({ missionId, imageUrl }) {
  return api.post(`/api/missions/${missionId}/verify`, { imageUrl });
}
