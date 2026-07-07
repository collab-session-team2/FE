export function getLevelInfo(totalPoint) {
  if (totalPoint < 20) {
    return {
      level: 1,
      levelName: "CASUAL FRIEND",
      currentPoint: totalPoint,
      requiredPoint: 20,
      nextLevelName: "CLOSE FRIEND",
    };
  }

  if (totalPoint < 50) {
    return {
      level: 2,
      levelName: "CLOSE FRIEND",
      currentPoint: totalPoint - 20,
      requiredPoint: 30,
      nextLevelName: "BEST FRIEND",
    };
  }

  if (totalPoint < 100) {
    return {
      level: 3,
      levelName: "BEST FRIEND",
      currentPoint: totalPoint - 50,
      requiredPoint: 50,
      nextLevelName: "SOULMATE",
    };
  }

  return {
    level: 4,
    levelName: "SOULMATE",
    currentPoint: 100,
    requiredPoint: 100,
    nextLevelName: "MAX LEVEL",
  };
}
