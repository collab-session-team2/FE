import { useContext } from "react";
import { DiaryContext } from "./diaryContextValue";

export const useDiary = () => useContext(DiaryContext);
