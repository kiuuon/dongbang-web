import * as yup from 'yup';

export const getSignUpInfoSchema = (
  universityList: { id: number; name: string }[],
  isDuplicate: boolean,
  isSameCheck: boolean,
) =>
  yup.object().shape({
    avatar: yup.mixed<File>().notRequired(),
    name: yup
      .string()
      .required('이름을 입력하세요')
      .matches(/^[a-zA-Z가-힣]{2,10}$/, '2~10글자 이내의 한글 또는 영문을 입력하세요'),
    gender: yup.string().required('성별을 선택하세요'),
    university: yup
      .string()
      .required('학교를 입력하세요')
      .test('isValidUniversity', '존재하지 않는 대학교입니다', (value) =>
        universityList.some((university: { id: number; name: string }) => university.name === value),
      ),
    major: yup.string().required('학과를 입력하세요'),
    nickname: yup
      .string()
      .required('사용자명을 입력하세요')
      .matches(/^[a-z0-9._]{2,8}$/, '2~8글자 이내의 소문자, 숫자, 밑줄(_), 마침표(.)만 입력하세요')
      .test('isUniqueNickname', '이미 사용중인 닉네임입니다', () => !isDuplicate)
      .test('isValidNickname', '중복 체크를 해주세요', () => isSameCheck),
  });

export const campusClubInfoSchema = yup.object().shape({
  clubType: yup.string(),
  campusClubType: yup.string().when('clubType', {
    is: 'campus',
    then: (schema) => schema.required('동아리 종류를 선택하세요').min(1, '동아리 종류를 선택하세요'),
    otherwise: (schema) => schema.notRequired().strip(),
  }),
  name: yup
    .string()
    .required('동아리명을 입력하세요')
    .matches(/^[a-zA-Z가-힣\s]+$/, '특수문자를 제외한 한글이나 영문으로 입력하세요'),
  category: yup.string().required('카테고리를 선택하세요'),
  location: yup.string().when('clubType', {
    is: 'campus',
    then: (schema) => schema.required('동아리 위치를 입력하세요'),
    otherwise: (schema) => schema.required('동아리 활동 지역을 선택하세요'),
  }),
  description: yup.string().max(30, '최대 30자까지 입력 가능합니다').required('한 줄 소개를 입력하세요'),
  tags: yup.array().required('태그를 추가하세요'),
});

export const clubDetailSchema = yup.object().shape({
  logo: yup.mixed<File>().required('로고를 선택하세요'),
  activity: yup
    .array()
    .min(1, '활동 사진을 선택하세요')
    .max(5, '최대 5장 이하로 업로드 해주세요')
    .required('활동 사진을 선택하세요'),
  description: yup.string().max(300, '최대 300자까지 입력 가능합니다').required('동아리 상세 설명을 입력하세요'),
});
