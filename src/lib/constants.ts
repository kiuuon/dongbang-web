const queryKey = {
  session: ['session'],
  userInfo: ['userInfo'],
  universityList: ['universityList'],
};

const signUpErrorMessages = {
  nameErrorMessage: '2~10글자 이내에 한글 또는 영문을 입력해주세요.',
  birthErrorMessage: '8자리 숫자로 입력해주세요.',
  nicknameErrorMessage: '2~8글자 이내에 한글 또는 영문을 입력해주세요.',
  sameNicknameErrorMessage: '이미 사용중인 닉네임입니다',
  availableNicknameMessage: '사용 가능한 닉네임입니다',
  universityErrorMessage: '존재하지 않는 대학교입니다.',
  mbtiErrorMessage: '올바른 MBTI 유형이 아닙니다.',
  termsErrorMessage: '필수 약관에 동의해주세요.',
  infoErrorMessage: '잘못 입력된 항목이 있거나 닉네임 중복확인을 했는지 확인해주세요.',
};

export { queryKey, signUpErrorMessages };
