import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Footer from "../../components/footer/Footer";
import CloseFriendCard from "../../assets/images/closeFriend.svg";

export default function DiaryMain() {
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(2);

  const days = [
    { day: "MON", date: 6 },
    { day: "TUE", date: 7 },
    { day: "WED", date: 8 },
    { day: "THU", date: 9 },
    { day: "FRI", date: 10 },
  ];

  return (
    <Page>
      <Content>
        <Logo>SLAM BOOK</Logo>

        <DiaryTitle>걸스토크</DiaryTitle>
        <DateText>07.08.2026</DateText>

        <DayList>
          {days.map((item, index) => (
            <DayItem key={item.day} onClick={() => setSelectedDay(index)}>
              <DayName $active={selectedDay === index}>{item.day}</DayName>
              <DateCircle $active={selectedDay === index}>
                {item.date}
              </DateCircle>
            </DayItem>
          ))}
        </DayList>

        <CardImage src={CloseFriendCard} alt="close friend card" />

        <MyTurnBox>
          <MyTurnTitle>MY TURN</MyTurnTitle>
          <MyTurnText>오늘 하루, 당신의 일상을 적어보세요</MyTurnText>

          <WriteButton onClick={() => navigate("/diaryWrite")}>
            일기 작성하러 가기
          </WriteButton>
        </MyTurnBox>
      </Content>

      <Footer />
    </Page>
  );
}

const Page = styled.div`
  width: 390px;
  min-height: 844px;
  margin: 0 auto;
  background: #371E16;
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

const DayList = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 34px;
`;

const DayItem = styled.button`
  width: 58px;
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const DayName = styled.p`
  color: white;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 800 : 400)};
  margin-bottom: 12px;
`;

const DateCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: ${({ $active }) =>
    $active ? "6px double #fff8e8" : "1.5px solid white"};
  background: ${({ $active }) =>
    $active ? "rgba(255, 255, 255, 0.18)" : "transparent"};
  color: white;
  font-size: 18px;
  font-weight: 400;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardImage = styled.img`
  width: 350px;
  height: 209px;
  object-fit: cover;
  border-radius: 20px;
  margin-bottom: 28px;
`;

const MyTurnBox = styled.div`
  width: 350px;
  height: 211px;
  background: #d0d9ee;
  border-radius: 20px;
  padding: 34px 28px;
`;

const MyTurnTitle = styled.h2`
  color: black;
  font-size: 30px;
  font-weight: 900;
  margin-bottom: 10px;
`;

const MyTurnText = styled.p`
  color: black;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 50px;
`;
const WriteButton = styled.button`
  width: 294px;
  height: 44px;
  border: none;
  border-radius: 14px;
  background: #102550;
  color: white;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
`;
