const pad = (n) => String(n).padStart(2, "0");

export const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export const addDays = (d, n) => {
  const x = startOfDay(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const isSameDay = (a, b) =>
  startOfDay(a).getTime() === startOfDay(b).getTime();

const WEEK_EN = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const WEEK_KO = ["일", "월", "화", "수", "목", "금", "토"];

export const weekEn = (d) => WEEK_EN[new Date(d).getDay()];
export const weekKo = (d) => WEEK_KO[new Date(d).getDay()];
export const fmtMain = (d) =>
  `${pad(d.getMonth() + 1)}.${pad(d.getDate())}.${d.getFullYear()}`;
export const fmtEntry = (d) =>
  `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}.${weekKo(d)}`;
