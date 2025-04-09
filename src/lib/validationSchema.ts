import * as yup from 'yup';

export const getSignUpInfoSchema = (
  universityList: { id: number; name: string }[],
  isDuplicate: boolean,
  isSameCheck: boolean,
) =>
  yup.object().shape({
    name: yup
      .string()
      .required('이름을 입력하세요.')
      .matches(/^[a-zA-Z가-힣]{2,10}$/, '2~10글자 이내에 한글 또는 영문을 입력해주세요.'),
    gender: yup.string().required('성별을 선택하세요.'),
    birth: yup
      .string()
      .required('생년월일을 입력하세요.')
      .matches(/^[0-9]{8}$/, '8자리 숫자로 입력해주세요.'),
    university: yup
      .string()
      .required('학교를 입력하세요.')
      .test('isValidUniversity', '존재하지 않는 대학교입니다.', (value) =>
        universityList.some((university: { id: number; name: string }) => university.name === value),
      ),
    major: yup.string().required('학과를 입력하세요.'),
    nickname: yup
      .string()
      .required('닉네임을 입력하세요.')
      .matches(/^[a-zA-Z가-힣]{2,8}$/, '2~8글자 이내에 한글 또는 영문을 입력해주세요.')
      .test('isUniqueNickname', '이미 사용중인 닉네임입니다.', () => !isDuplicate)
      .test('isValidNickname', '중복 체크를 해주세요.', () => isSameCheck),
    clubCount: yup.string().required('동아리 수를 선택하세요.'),
    path: yup.string(),
  });

export const campusClubInfoSchema = yup.object().shape({
  clubType: yup.string(),
  campusClubType: yup.string().when('clubType', {
    is: 'campus',
    then: (schema) => schema.required('동아리 종류를 선택하세요.').min(1, '동아리 종류를 선택하세요.'),
    otherwise: (schema) => schema.notRequired().strip(),
  }),
  name: yup.string().required('이름을 입력하세요.'),
  category: yup.string().required('카테고리를 선택하세요.'),
  location: yup.string().required('동아리 위치를 입력하세요.'),
  description: yup.string().max(50, '최대 50자까지 입력 가능합니다').required('한 줄 소개를 입력하세요.'),
  tags: yup.array().required('태그를 추가하세요.'),
});

export const clubDetailSchema = yup.object().shape({
  logo: yup.mixed<File>().required('로고를 선택하세요.'),
  activity: yup
    .array()
    .min(1, '활동 사진을 선택하세요.')
    .max(5, '최대 5장까지만 업로드할 수 있습니다.')
    .required('활동 사진을 선택하세요.'),
  description: yup.string().max(300, '최대 300자까지 입력 가능합니다').required('동아리 상세 설명을 입력하세요.'),
});
