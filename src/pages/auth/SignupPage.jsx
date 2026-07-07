import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { signup } from "../../api/userApi";
import signupLogo from "../../assets/images/signup_logo.svg";
import EmailField from "../../components/auth/EmailField";

function SignupPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [emailId, setEmailId] = useState("");
  const [domain, setDomain] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    if (!name || !password || !emailId || !domain) {
      setErrorMessage("모든 정보를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await signup({
        userName: name,
        email: `${emailId}@${domain}`,
        password,
      });
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Content>
        <Logo src={signupLogo} alt="SIGN UP" />

        <InputGroup>
          <Label>이름 / NAME</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="성함을 입력해주세요"
          />
        </InputGroup>

        <InputGroup>
          <Label>비밀번호 / PASSWORD</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
        </InputGroup>

        <EmailField
          emailId={emailId}
          setEmailId={setEmailId}
          domain={domain}
          setDomain={setDomain}
        />

        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}

        <SignupButton
          type="button"
          onClick={handleSignup}
          disabled={isSubmitting}
        >
          {isSubmitting ? "SIGNING UP" : "SIGN UP"}
        </SignupButton>
      </Content>
    </PageContainer>
  );
}

export default SignupPage;

const PageContainer = styled.div`
  width: 390px;
  height: 799px;
  margin: 0 auto;
  background: #fff9e8;
`;

const Content = styled.main`
  width: 100%;
  padding: 156px 52px 0;
  box-sizing: border-box;
`;

const Logo = styled.img`
  display: block;
  width: 282px;
  height: auto;
  margin: 0 auto 48px;
`;

const InputGroup = styled.div`
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

const Input = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px;
  box-sizing: border-box;
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

const ErrorText = styled.p`
  color: #d94a4a;
  font-family: "Pretendard Variable";
  font-size: 12px;
  font-weight: 600;
  margin: -8px 0 10px;
`;

const SignupButton = styled.button`
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 15px;
  background: #abc6de;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  margin-top: 4px;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;
