import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: relative;
`;

const SelectedButton = styled.button`
  border: none;
  background: none;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
`;

const Arrow = styled.span`
  margin-left: 8px;
  font-size: 24px;
`;

const DropdownBox = styled.div`
  position: absolute;
  top: 42px;
  right: 0;
  width: 150px;
  padding: 12px;
  border-radius: 14px;
  background-color: #fff;
  z-index: 10;
`;

const OptionButton = styled.button`
  width: 100%;
  height: 42px;
  border: ${({ $active }) => ($active ? "none" : "1px solid #d1c9c9")};
  border-radius: 8px;
  background-color: ${({ $active }) => ($active ? "#d2cbcb" : "#fff")};
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;

  & + & {
    margin-top: 10px;
  }
`;

const HideButton = styled.button`
  width: 100%;
  margin-top: 22px;
  border: none;
  background: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
`;

const UpArrow = styled.span`
  margin-left: 4px;
  font-size: 20px;
`;


function MissionDropdown({ selectedDifficulty, onChangeDifficulty }) {
  const [isOpen, setIsOpen] = useState(false);

  const options = ["Easy", "Normal"];

  const handleSelect = (option) => {
    onChangeDifficulty(option);
    setIsOpen(false);
  };

  return (
    <Wrapper>
      <SelectedButton type="button" onClick={() => setIsOpen(true)}>
        {selectedDifficulty}
        <Arrow>⌄</Arrow>
      </SelectedButton>

      {isOpen && (
        <DropdownBox>
          {options.map((option) => (
            <OptionButton
              key={option}
              type="button"
              onClick={() => handleSelect(option)}
              $active={selectedDifficulty === option}
            >
              {option}
            </OptionButton>
          ))}

          <HideButton type="button" onClick={() => setIsOpen(false)}>
            숨기기 <UpArrow>⌃</UpArrow>
          </HideButton>
        </DropdownBox>
      )}
    </Wrapper>
  );
}

export default MissionDropdown;
