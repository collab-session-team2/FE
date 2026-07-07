import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { login } from "../../api/authApi";
import loginLogo from "../../assets/images/login_logo.svg";
import EmailField from "../../components/auth/EmailField";

function LoginPage() {
  const navigate = useNavigate();

  const [emailId, setEmailId] = useState("");
  const [domain, setDomain] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!emailId || !domain || !password) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      await login({ email: `${emailId}@${domain}`, password });
      navigate("/");
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Content>
        <Logo src={loginLogo} alt="LOGIN" />

        <EmailField
          emailId={emailId}
          setEmailId={setEmailId}
          domain={domain}
          setDomain={setDomain}
        />

        <InputGroup>
          <Label>비밀번호 / PASSWORD</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
        </InputGroup>

        <LoginButton
          type="button"
          onClick={handleLogin}
          disabled={isSubmitting}
        >
          {isSubmitting ? "LOGGING IN" : "LOG IN"}
        </LoginButton>

        <SignupButton type="button" onClick={() => navigate("/signup")}>
          SIGN UP
        </SignupButton>
      </Content>
    </PageContainer>
  );
}

export default LoginPage;

const PageContainer = styled.div`
  width: 390px;
  height: 799px;
  margin: 0 auto;
  background: #fff9e8;
`;

const Content = styled.main`
  width: 100%;
  padding: 155px 52px 0;
  box-sizing: border-box;
`;

const Logo = styled.img`
  display: block;
  width: 250px;
  height: auto;
  margin: 0 auto 56px;
`;

const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 22px;
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

const LoginButton = styled.button`
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
  margin-top: 8px;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: #9bb8d4;
  }

  &:active {
    background: #89a9c8;
    transform: scale(0.98);
  }
`;

const SignupButton = styled.button`
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 15px;
  background: #7f9fba;
  color: #fff;
  font-family: "Pretendard Variable";
  font-size: 20px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 12px;
  transition: background 0.15s ease, transform 0.1s ease;

  &:hover {
    background: #6e8ea9;
  }

  &:active {
    background: #5d7d98;
    transform: scale(0.98);
  }
`;
