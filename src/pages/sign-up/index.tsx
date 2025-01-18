import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@tanstack/react-query';

import { UserType } from '@/types/user-type';
import { fetchSession } from '@/lib/apis/auth';
import { fetchUniversityList, isNicknameExists, signUp } from '@/lib/apis/sign-up';
import CheckIcon from '@/icons/check-icon';
import CheckIcon2 from '@/icons/check-icon2';

function Signup() {
  const router = useRouter();
  const { data: session } = useQuery({ queryKey: ['session'], queryFn: fetchSession });

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
  const [nicknameError, setNicknameError] = useState(false);
  const [isSameCheck, setIsSameCheck] = useState(false);
  const [sameNicknameError, setSameNicknameError] = useState(false);
  const [isAvailableNickname, setIsAvailableNickname] = useState(false);

  const [university, setUniversity] = useState('');
  const [searchedUniversityList, setSearchedUniversityList] = useState<Array<{ id: number; name: string }>>([]);
  const [isUniversityDropdownOpen, setIsUniversityDropdownOpen] = useState(false);
  const useniversityDropdownRef = useRef<HTMLDivElement>(null);
  const [universiryError, setUniversityError] = useState(false);

  const [clubCount, setClubCount] = useState('');

  const [mbti, setMbti] = useState('');
  const [mbtiError, setMbtiError] = useState(false);

  const [path, setPath] = useState('');
  const [pathInputDisabled, setPathInputDisabled] = useState(true);
  const [etcPath, setEtcPath] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: universityList } = useQuery({ queryKey: ['universityList'], queryFn: fetchUniversityList });

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

  const birthRegExp = /^[0-9]{8}$/;
  const handleBirthBlur = () => {
    if (!birth.match(birthRegExp)) {
      setBirthError(true);
    } else {
      setBirthError(false);
    }
  };

  const handleNickname = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSameCheck(false);
    setIsAvailableNickname(false);
    setNickname(event.target.value);
  };

  const nicknameRegExp = /^[a-zA-Z가-힣]{2,8}$/;
  const handleNicknameBlur = () => {
    if (!nickname.match(nicknameRegExp)) {
      setNicknameError(true);
      setIsAvailableNickname(false);
    } else {
      setNicknameError(false);
    }
  };

  const { mutate: handleNicknameSameCheck } = useMutation({
    mutationFn: () => isNicknameExists(nickname),
    onSuccess: (data) => {
      if (data) {
        setIsAvailableNickname(false);
        setSameNicknameError(true);
      } else {
        setIsAvailableNickname(true);
        setSameNicknameError(false);
        setIsSameCheck(true);
      }
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });

  const handleUniversity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUniversity(event.target.value);

    if (!universityList) return;

    if (event.target.value === '') {
      setSearchedUniversityList([]);
    } else {
      const searchedList = universityList.filter((item) => item.name.includes(event.target.value));
      setSearchedUniversityList(searchedList as Array<{ id: number; name: string }>);
    }
  };

  useEffect(() => {
    if (searchedUniversityList.length !== 0) {
      setIsUniversityDropdownOpen(true);
    } else {
      setIsUniversityDropdownOpen(false);
    }
  }, [searchedUniversityList]);

  const handleUniversityFocus = () => {
    if (searchedUniversityList.length > 0) {
      setIsUniversityDropdownOpen(true);
    }
  };

  const handleUniversityBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (useniversityDropdownRef.current && !useniversityDropdownRef.current.contains(event.relatedTarget as Node)) {
      setIsUniversityDropdownOpen(false);
    }

    if (universityList?.some((item) => item.name === university)) {
      setUniversityError(false);
    } else {
      setUniversityError(true);
    }
  };

  const handleUniversityClick = (n: string) => {
    setUniversity(n);
    setIsUniversityDropdownOpen(false);
    setUniversityError(false);
  };

  const handleMbti = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMbti(event.target.value.toUpperCase());
  };

  const mbtiRegExp = /^(INTJ|INTP|ENTJ|ENTP|INFJ|INFP|ENFJ|ENFP|ISTJ|ISFJ|ESTJ|ESFJ|ISTP|ISFP|ESTP|ESFP)$/;
  const handleMbtiBlur = () => {
    if (!mbti.match(mbtiRegExp)) {
      if (mbti.length !== 0) {
        setMbtiError(true);
      } else {
        setMbtiError(false);
      }
    } else {
      setMbtiError(false);
    }
  };

  const handleEtcPath = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEtcPath(event.target.value);
  };

  const { mutate: handleSignup } = useMutation({
    mutationFn: (body: UserType) => signUp(body),
    onSuccess: () => {
      setIsModalOpen(true);
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    },
  });

  const handleSignupButton = () => {
    if (
      nameError ||
      birthError ||
      nicknameError ||
      universiryError ||
      mbtiError ||
      !isSameCheck ||
      !isAvailableNickname ||
      gender === '' ||
      clubCount === ''
    ) {
      // eslint-disable-next-line no-alert
      alert('잘못 입력된 항목이 있거나 닉네임 중복확인을 했는지 확인해주세요.');
    } else {
      const data = {
        id: session?.user?.id as string,
        name,
        birth: `${birth.slice(0, 4)}-${birth.slice(4, 6)}-${birth.slice(6, 8)}`,
        gender,
        email: session?.user?.email as string,
        nickname,
        university_id: universityList?.find((item) => item.name === university)?.id,
        clubs_joined: clubCount,
        mbti: mbti || null,
        join_path: (path === '기타' ? etcPath : path) || null,
        term_of_use: termOfUse,
        privacy_policy: privacyPolicy,
        third_party_consent: thirdPartyConsent,
        marketing,
      };
      handleSignup(data);
      setIsModalOpen(true);
    }
  };

  const goToHome = () => {
    router.push('/');
  };

  if (page === 1) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F5F5F5] p-[40px]">
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
            className="mb-[40px] h-[40px] w-[152px] rounded-[10px] bg-[#D9D9D9] text-[16px]"
            onClick={handleNextButton}
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] p-[40px]">
      <div className="mb-[25px] mt-[50px] text-[20px] font-black">회원가입</div>
      <div>
        <div>
          <div className="flex items-end text-[14px] text-[#969696]">이름</div>
          <div className="flex gap-[4px]">
            <input
              value={name}
              className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
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
              placeholder="ex) 20000413"
              className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
              onChange={handleBirth}
              onBlur={handleBirthBlur}
            />
            {birthError && <div className="flex items-center text-[6px] text-[#CB0101]">8자리 숫자로 입력해주세요</div>}
          </div>
        </div>
        <div>
          <div className="text-[14px] text-[#969696]">성별</div>
          <div className="mb-[10px] mt-[5px] flex gap-[10px]">
            <button
              type="button"
              className={`h-[16px] w-[27px] rounded-[5px] ${gender === 'male' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'} text-[10px] ${gender === 'male' ? 'text-[#080808]' : 'text-[#969696]'}`}
              onClick={() => {
                setGender('male');
              }}
            >
              남
            </button>
            <button
              type="button"
              className={`h-[16px] w-[27px] rounded-[5px] ${gender === 'female' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'} text-[10px] ${gender === 'female' ? 'text-[#080808]' : 'text-[#969696]'}`}
              onClick={() => {
                setGender('female');
              }}
            >
              여
            </button>
          </div>
        </div>
        <div>
          <div className="text-[14px] text-[#969696]">닉네임</div>
          <div className="flex gap-[15px]">
            <input
              value={nickname}
              className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
              onChange={handleNickname}
              onBlur={handleNicknameBlur}
            />
            <button
              type="button"
              className="h-[20px] w-[50px] rounded-[10px] bg-[#E9E9E9] text-[10px] text-[#969696]"
              onClick={() => {
                if (nickname.match(nicknameRegExp)) {
                  handleNicknameSameCheck();
                }
              }}
            >
              중복확인
            </button>
            {nicknameError && (
              <div className="flex items-center text-[6px] text-[#CB0101]">
                2~8글자 이내에 한글 또는 영문을 입력해주세요
              </div>
            )}
            {sameNicknameError && (
              <div className="flex items-center text-[6px] text-[#CB0101]">이미 사용중인 닉네임입니다</div>
            )}
            {isAvailableNickname && (
              <div className="flex items-center text-[6px] text-[#008000]">사용 가능한 닉네임입니다</div>
            )}
          </div>
        </div>
        <div>
          <div className="text-[14px] text-[#969696]">학교</div>
          <div className="relative flex gap-[4px]">
            <input
              value={university}
              className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
              onChange={handleUniversity}
              onFocus={handleUniversityFocus}
              onBlur={handleUniversityBlur}
            />
            {universiryError && (
              <div className="flex items-center text-[6px] text-[#CB0101]">존재하지 않는 대학교입니다.</div>
            )}
            {isUniversityDropdownOpen && (
              <div
                ref={useniversityDropdownRef}
                className="absolute left-[0] top-[30px] h-[150px] w-[136px] overflow-y-auto rounded-[5px] border border-[#969696] bg-[#F5F5F5]"
              >
                {searchedUniversityList?.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="w-full cursor-pointer border-b border-[#969696] p-[5px] hover:bg-[#D9D9D9]"
                    onClick={() => handleUniversityClick(item.name)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="text-[14px] text-[#969696]">가입한 동아리 수</div>
          <div className="mb-[10px] mt-[5px] flex gap-[10px]">
            <button
              type="button"
              className={`h-[16px] w-[30px] rounded-[5px] text-[10px] ${clubCount === '1' ? 'text-[#080808]' : 'text-[#969696]'} ${clubCount === '1' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
              onClick={() => {
                setClubCount('1');
              }}
            >
              1개
            </button>
            <button
              type="button"
              className={`h-[16px] w-[30px] rounded-[5px] text-[10px] ${clubCount === '2' ? 'text-[#080808]' : 'text-[#969696]'} ${clubCount === '2' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
              onClick={() => {
                setClubCount('2');
              }}
            >
              2개
            </button>
            <button
              type="button"
              className={`h-[16px] w-[30px] rounded-[5px] text-[10px] ${clubCount === '3' ? 'text-[#080808]' : 'text-[#969696]'} ${clubCount === '3' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
              onClick={() => {
                setClubCount('3');
              }}
            >
              3개
            </button>
            <button
              type="button"
              className={`h-[16px] w-[50px] rounded-[5px] text-[10px] ${clubCount === '4+' ? 'text-[#080808]' : 'text-[#969696]'} ${clubCount === '4+' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
              onClick={() => {
                setClubCount('4+');
              }}
            >
              4개 이상
            </button>
            <button
              type="button"
              className={`h-[16px] w-[30px] rounded-[5px] text-[10px] ${clubCount === '0' ? 'text-[#080808]' : 'text-[#969696]'} ${clubCount === '0' ? 'bg-[#BCBBBB]' : 'bg-[#D9D9D9]'}`}
              onClick={() => {
                setClubCount('0');
              }}
            >
              없음
            </button>
          </div>
        </div>
        <div>
          <div>
            <div className="text-[14px] text-[#969696]">MBTI(선택)</div>
            <div className="flex gap-[4px]">
              <input
                value={mbti}
                className="mb-[10px] h-[24px] w-[136px] rounded-[5px] border-b border-[#969696] bg-[#F5F5F5] pl-[5px] outline-none"
                onChange={handleMbti}
                onBlur={handleMbtiBlur}
              />
              {mbtiError && (
                <div className="flex items-center text-[6px] text-[#CB0101]">올바른 MBTI 유형이 아닙니다</div>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="text-[14px] text-[#969696]">가입 경로(선택)</div>
          <div className="mt-[8px] flex flex-col items-start gap-[5px] text-[14px] text-[#969696]">
            <button
              type="button"
              className="flex"
              onClick={() => {
                setPathInputDisabled(true);
                setEtcPath('');
                if (path === 'SNS') {
                  setPath('');
                } else {
                  setPath('SNS');
                }
              }}
            >
              <CheckIcon2 color={path === 'SNS' ? '#5686E1' : '#969696'} />
              SNS
            </button>
            <button
              type="button"
              className="flex"
              onClick={() => {
                setPathInputDisabled(true);
                setEtcPath('');
                if (path === '학교 행사') {
                  setPath('');
                } else {
                  setPath('학교 행사');
                }
              }}
            >
              <CheckIcon2 color={path === '학교 행사' ? '#5686E1' : '#969696'} />
              학교 행사
            </button>
            <button
              type="button"
              className="flex"
              onClick={() => {
                setPathInputDisabled(true);
                setEtcPath('');
                if (path === '지인 추천') {
                  setPath('');
                } else {
                  setPath('지인 추천');
                }
              }}
            >
              <CheckIcon2 color={path === '지인 추천' ? '#5686E1' : '#969696'} />
              지인 추천
            </button>
            <button
              type="button"
              className="flex"
              onClick={() => {
                setPathInputDisabled(true);
                setEtcPath('');
                if (path === '교내 어플') {
                  setPath('');
                } else {
                  setPath('교내 어플');
                }
              }}
            >
              <CheckIcon2 color={path === '교내 어플' ? '#5686E1' : '#969696'} />
              교내 어플
            </button>
            <button
              type="button"
              className="flex"
              onClick={() => {
                setEtcPath('');
                if (path === '기타') {
                  setPath('');
                  setPathInputDisabled(true);
                } else {
                  setPath('기타');
                  setPathInputDisabled(false);
                }
              }}
            >
              <CheckIcon2 color={path === '기타' ? '#5686E1' : '#969696'} />
              기타
            </button>
            <input
              placeholder="ex) 블로그"
              value={etcPath}
              className="ml-[20px] h-[27px] w-[174px] rounded-[10px] bg-[#E9E9E9] pl-[10px] outline-none"
              disabled={pathInputDisabled}
              onChange={handleEtcPath}
            />
          </div>
        </div>
      </div>
      <div className="mt-[40px] flex justify-center">
        <button
          type="button"
          className="h-[40px] w-[152px] rounded-[10px] bg-[#D9D9D9] text-[16px]"
          onClick={handleSignupButton}
        >
          가입하기
        </button>
      </div>
      {isModalOpen && (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="shadow-modal flex h-[150px] w-[220px] flex-col items-center justify-center gap-[25px] rounded-[8px] bg-[#ECF5BD]">
            <div className="flex w-[150px] text-center text-[14px] text-[#8C8C8C]">
              가입이 완료되었습니다 <br /> 즐거운 동아리 활동하세요
            </div>
            <button
              type="button"
              className="mb-[40px] h-[35px] w-[100px] rounded-[8px] bg-[#DEE8B7] text-[14px] text-[#8C8C8C]"
              onClick={goToHome}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;
