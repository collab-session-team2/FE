import { useState } from "react";
import styled from "styled-components";

const EmailGroup = styled.div`
  width: 100%;
  margin-bottom: 18px;
`;

const Label = styled.p`
  color: #173a5a;
  font-family: "Pretendard Variable";
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 7px;
`;

const EmailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
`;

const EmailInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 40px;
  padding: 0 12px;

  border: 2px solid #3f7aac;
  border-radius: 15px;
  outline: none;

  color: #333;
  font-family: "Pretendard Variable";
  font-size: 12px;

  &::placeholder {
    color: #b5b5b5;
  }
`;

const AtText = styled.span`
  color: #173a5a;
  font-family: "Pretendard Variable";
  font-size: 24px;
  font-weight: 700;
`;

const DomainWrapper = styled.div`
  position: relative;
  width: 84px;
  height: 40px;
`;

const DomainButton = styled.button`
  width: 100%;
  height: 40px;

  border: 2px solid #3f7aac;
  border-radius: 15px;
  background: #fff;

  color: #173a5a;
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;
`;

const DomainInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 8px;

  border: 2px solid #3f7aac;
  border-radius: 15px;
  outline: none;

  color: #333;
  font-family: "Pretendard Variable";
  font-size: 11px;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 46px;
  right: 0;

  width: 112px;
  padding: 8px;

  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.16);

  display: flex;
  flex-direction: column;
  gap: 6px;

  z-index: 20;
`;

const OptionButton = styled.button`
  width: 100%;
  height: 30px;

  border: none;
  border-radius: 7px;
  background: #f2f2f2;

  color: #173a5a;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-weight: 600;

  cursor: pointer;
`;

function EmailField({ emailId, setEmailId, domain, setDomain }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomDomain, setIsCustomDomain] = useState(false);

  const handleSelectDomain = (selectedDomain) => {
    if (selectedDomain === "custom") {
      setDomain("");
      setIsCustomDomain(true);
    } else {
      setDomain(selectedDomain);
      setIsCustomDomain(false);
    }

    setIsOpen(false);
  };

  return (
    <EmailGroup>
      <Label>이메일 / EMAIL</Label>

      <EmailRow>
        <EmailInput
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          placeholder="이메일 주소를 입력해주세요"
        />

        <AtText>@</AtText>

        <DomainWrapper>
          {isCustomDomain ? (
            <DomainInput
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onClick={() => setIsOpen(true)}
              placeholder="직접 입력"
            />
          ) : (
            <DomainButton
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              v
            </DomainButton>
          )}

          {isOpen && (
            <Dropdown>
              <OptionButton
                type="button"
                onClick={() => handleSelectDomain("naver.com")}
              >
                naver.com
              </OptionButton>
              <OptionButton
                type="button"
                onClick={() => handleSelectDomain("gmail.com")}
              >
                gmail.com
              </OptionButton>
              <OptionButton
                type="button"
                onClick={() => handleSelectDomain("custom")}
              >
                직접 입력
              </OptionButton>
            </Dropdown>
          )}
        </DomainWrapper>
      </EmailRow>
    </EmailGroup>
  );
}

export default EmailField;
