import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { BsBookmark } from "react-icons/bs";
import { FiCheckSquare, FiUser } from "react-icons/fi";

export default function Footer() {
  return (
    <FooterBar>
      <MenuItem to="/" end>
        <IconWrapper>
          <GoHome size={28} />
        </IconWrapper>
        <span>홈</span>
      </MenuItem>

      <MenuItem to="/diaryMain">
        <IconWrapper>
          <BsBookmark size={23} />
        </IconWrapper>
        <span>교환일기</span>
      </MenuItem>

      <MenuItem to="/mission">
        <IconWrapper>
          <FiCheckSquare size={23} />
        </IconWrapper>
        <span>미션</span>
      </MenuItem>

      <MenuItem to="/mypage">
        <IconWrapper>
          <FiUser size={25} />
        </IconWrapper>
        <span>마이페이지</span>
      </MenuItem>
    </FooterBar>
  );
}

const FooterBar = styled.footer`
  width: 390px;
  height: 94px;
  background: #ffffff;
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
`;

const MenuItem = styled(NavLink)`
  color: #b3a89c;
  text-decoration: none;

  display: flex;
  flex-direction: column;
  align-items: center;

  span {
    margin-top: 6px;
    font-family: "SUITE", sans-serif;
    font-size: 13px;
    font-weight: 700;
    line-height: 1;
  }

  &.active {
    color: #102550;
  }
`;

const IconWrapper = styled.div`
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
