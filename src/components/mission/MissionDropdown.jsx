import { useState } from "react";
import styled from "styled-components";

import downIcon from "../../assets/icons/down_icon.svg";

const Wrapper = styled.div`
  position: relative;
`;

const SelectedButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  min-width: 64px;
  height: 26px;
  padding: 2px 10px 4px 12px;

  border: none;
  border-radius: 5px;
  background: #fff9e8;

  color: #000;
  font-family: "Pretendard Variable";
  font-size: 15px;
  font-weight: 700;

  cursor: pointer;
`;

const ArrowIcon = styled.img`
  width: 12px;
  height: 7px;

  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.2s ease;
`;

const DropdownBox = styled.div`
  position: absolute;
  top: 34px;
  right: 0;

  width: 104px;
  padding: 8px;
  border-radius: 8px;
  background: #fff;
  z-index: 20;

  display: flex;
  flex-direction: column;
  gap: 8px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
`;

const OptionButton = styled.button`
  width: 100%;
  height: 34px;

  border-radius: 5px;
  border: ${({ $active }) => ($active ? "none" : "1.5px solid #371e16")};

  background: ${({ $active }) => ($active ? "#371e16" : "#fff9e8")};
  color: ${({ $active }) => ($active ? "#fff9e8" : "#371e16")};

  font-family: "Pretendard Variable";
  font-size: 15px;
  font-weight: 700;

  cursor: pointer;
`;

function MissionDropdown({ selectedDifficulty, onChangeDifficulty }) {
  const [isOpen, setIsOpen] = useState(false);

  const options = ["Easy", "Hard"];

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelectOption = (option) => {
    onChangeDifficulty(option);
    setIsOpen(false);
  };

  return (
    <Wrapper>
      <SelectedButton type="button" onClick={handleToggleDropdown}>
        {selectedDifficulty}
        <ArrowIcon src={downIcon} alt="드롭다운 열기" $isOpen={isOpen} />
      </SelectedButton>

      {isOpen && (
        <DropdownBox>
          {options.map((option) => (
            <OptionButton
              key={option}
              type="button"
              onClick={() => handleSelectOption(option)}
              $active={selectedDifficulty === option}
            >
              {option}
            </OptionButton>
          ))}
        </DropdownBox>
      )}
    </Wrapper>
  );
}

export default MissionDropdown;
