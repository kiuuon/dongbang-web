import CheckIcon from '@/icons/check-icon';
import CheckIcon2 from '@/icons/check-icon2';
import { useState } from 'react';

function Signup() {
  const [page, setPage] = useState(1);
  const [termOfUse, setTermOfUse] = useState(false); // 동방 이용약관 동의
  const [privacyPolicy, setPrivacyPolicy] = useState(false); // 개인정보 수집 및 이용 동의
  const [thirdPartyConsent, setThirdPartyConsent] = useState(false); // 개인정보 제3자 제공 동의
  const [marketing, setMarketing] = useState(false); // 마케팅 정보 수신 동의

  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);
  const [birth, setBirth] = useState('');
  const [birthError, setBirthError] = useState(false);
  const [gender, setGender] = useState('');
  const [nickname, setNickname] = useState('');
  const [university, setUniversity] = useState('');
  const [clubCount, setClubCount] = useState('');
  const [mbti, setMbti] = useState('');
  const [path, setPath] = useState('');

  const handleFullAgreeButton = () => {
    if (termOfUse && privacyPolicy && thirdPartyConsent && marketing) {
      setTermOfUse(false);
      setPrivacyPolicy(false);
      setThirdPartyConsent(false);
      setMarketing(false);
    } else {
      setTermOfUse(true);
      setPrivacyPolicy(true);
      setThirdPartyConsent(true);
      setMarketing(true);
    }
  };

  const handleNextButton = () => {
    if (termOfUse && privacyPolicy && thirdPartyConsent) {
      setPage(2);
    } else {
      // eslint-disable-next-line no-alert
      alert('필수 약관에 동의해주세요.');
    }
  };

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const nameRegExp = /^[a-zA-Z가-힣]{2,10}$/;
  const handleNameBlur = () => {
    if (!name.match(nameRegExp)) {
      setNameError(true);
    } else {
      setNameError(false);
    }
  };

  const handleBirth = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBirth(event.target.value);
  };

  const birthRegExp = /^[0-9]{6}$/;
  const handleBirthBlur = () => {
    if (!birth.match(birthRegExp)) {
      setBirthError(true);
    } else {
      setBirthError(false);
    }
  };

  if (page === 1) {
    return (
      <div className="flex h-screen w-screen flex-col bg-[#F5F5F5] p-[40px]">
        <div className="mb-[12px] mt-[50px] text-[20px] font-black">이용 약관 동의</div>
        <div className="mb-[370px] text-[16px]">
          서비스 이용에 필요한 약관 동의 사항입니다. 정책 및 약관을 확인해주세요.
        </div>
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer items-center gap-[8px] text-[16px]"
          onClick={handleFullAgreeButton}
          onKeyDown={handleFullAgreeButton}
        >
          <CheckIcon color={termOfUse && privacyPolicy && thirdPartyConsent && marketing ? '#6593C8' : '#9C9C9C'} />
          전체 동의
        </div>
        <div className="my-[25px] h-[1px] w-full bg-[#B4B4B4]" />
        <div>
          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center gap-[8px] text-[16px]"
            onClick={() => setTermOfUse(!termOfUse)}
            onKeyDown={() => setTermOfUse(!termOfUse)}
          >
            <CheckIcon color={termOfUse ? '#6593C8' : '#9C9C9C'} /> 동방 이용약간 동의 (필수)
          </div>
          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center gap-[8px] text-[16px]"
            onClick={() => setPrivacyPolicy(!privacyPolicy)}
            onKeyDown={() => setPrivacyPolicy(!privacyPolicy)}
          >
            <CheckIcon color={privacyPolicy ? '#6593C8' : '#9C9C9C'} /> 개인정보 수집 및 이용 동의(필수)
          </div>
          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center gap-[8px] text-[16px]"
            onClick={() => setThirdPartyConsent(!thirdPartyConsent)}
            onKeyDown={() => setThirdPartyConsent(!thirdPartyConsent)}
          >
            <CheckIcon color={thirdPartyConsent ? '#6593C8' : '#9C9C9C'} /> 개인정보 제3자 제공 동의(필수)
          </div>
          <div
            role="button"
            tabIndex={0}
            className="flex cursor-pointer items-center gap-[8px] text-[16px]"
            onClick={() => setMarketing(!marketing)}
            onKeyDown={() => setMarketing(!marketing)}
          >
            <CheckIcon color={marketing ? '#6593C8' : '#9C9C9C'} /> 마케팅 정보 메일, SMS 수신 동의
          </div>
        </div>
        <div className="mt-[40px] flex justify-center">
          <button
            type="button"
            className="h-[40px] w-[152px] rounded-[10px] bg-[#D9D9D9] text-[16px]"
            onClick={handleNextButton}
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-[#F5F5F5] p-[40px]">
      <div className="mb-[25px] mt-[50px] text-[20px] font-black">회원가입</div>
      <div>
        <div>
          <div className="flex items-end text-[14px] text-[#969696]">이름</div>
          <div className="flex gap-[4px]">
            <input
              value={name}
              className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px]"
              onChange={handleName}
              onBlur={handleNameBlur}
            />
            {nameError && (
              <div className="flex items-center text-[6px] text-[#CB0101]">
                2~10글자 이내에 한글 또는 영문을 입력해주세요
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="text-[14px] text-[#969696]">생년월일</div>
          <div className="flex gap-[4px]">
            <input
              value={birth}
              className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px]"
              onChange={handleBirth}
              onBlur={handleBirthBlur}
            />
            {birthError && <div className="flex items-center text-[6px] text-[#CB0101]">6자리 숫자로 입력해주세요</div>}
          </div>
        </div>
        <div>
          <div className="text-[14px] text-[#969696]">성별</div>
          <div className="mb-[10px] mt-[5px] flex gap-[10px]">
            <button type="button" className="h-[16px] w-[27px] rounded-[5px] bg-[#D9D9D9] text-[10px] text-[#969696]">
              남
            </button>
            <button type="button" className="h-[16px] w-[27px] rounded-[5px] bg-[#D9D9D9] text-[10px] text-[#969696]">
              여
            </button>
          </div>
        </div>
        <div>
          <div className="text-[14px] text-[#969696]">닉네임</div>
          <div className="flex gap-[15px]">
            <input className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px]" />
            <button type="button" className="h-[20px] w-[50px] rounded-[10px] bg-[#E9E9E9] text-[10px] text-[#969696]">
              중복확인
            </button>
          </div>
        </div>
        <div>
          <div className="text-[14px] text-[#969696]">학교</div>
          <div className="flex gap-[15px]">
            <input className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px]" />
            <button type="button" className="h-[20px] w-[30px] rounded-[10px] bg-[#E9E9E9] text-[10px] text-[#969696]">
              찾기
            </button>
          </div>
        </div>
        <div>
          <div className="text-[14px] text-[#969696]">가입한 동아리 수</div>
          <div className="mb-[10px] mt-[5px] flex gap-[10px]">
            <button type="button" className="h-[16px] w-[30px] rounded-[5px] bg-[#D9D9D9] text-[10px] text-[#969696]">
              1개
            </button>
            <button type="button" className="h-[16px] w-[30px] rounded-[5px] bg-[#D9D9D9] text-[10px] text-[#969696]">
              2개
            </button>
            <button type="button" className="h-[16px] w-[30px] rounded-[5px] bg-[#D9D9D9] text-[10px] text-[#969696]">
              3개
            </button>
            <button type="button" className="h-[16px] w-[50px] rounded-[5px] bg-[#D9D9D9] text-[10px] text-[#969696]">
              4개 이상
            </button>
            <button type="button" className="h-[16px] w-[30px] rounded-[5px] bg-[#D9D9D9] text-[10px] text-[#969696]">
              없음
            </button>
          </div>
        </div>
        <div>
          <div>
            <div className="text-[14px] text-[#969696]">MBTI</div>
            <input className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px]" />
          </div>
        </div>
        <div>
          <div className="text-[14px] text-[#969696]">가입 경로</div>
          <div className="mt-[8px] flex flex-col items-start gap-[5px] text-[14px] text-[#969696]">
            <button type="button" className="flex">
              <CheckIcon2 color="#969696" />
              SNS
            </button>
            <button type="button" className="flex">
              <CheckIcon2 color="#969696" />
              학교 행사
            </button>
            <button type="button" className="flex">
              <CheckIcon2 color="#969696" />
              지인 추천
            </button>
            <button type="button" className="flex">
              <CheckIcon2 color="#969696" />
              교내 어플
            </button>
            <button type="button" className="flex">
              <CheckIcon2 color="#969696" />
              기타
            </button>
            <input
              placeholder="ex) 블로그"
              className="ml-[20px] h-[27px] w-[174px] rounded-[10px] bg-[#E9E9E9] pl-[10px]"
            />
          </div>
        </div>
      </div>
      <div className="mt-[40px] flex justify-center">
        <button type="button" className="h-[40px] w-[152px] rounded-[10px] bg-[#D9D9D9] text-[16px]">
          가입하기
        </button>
      </div>
    </div>
  );
}

export default Signup;
