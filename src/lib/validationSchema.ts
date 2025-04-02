import * as yup from 'yup';

export const campusClubInfoSchema = yup.object().shape({
  // campusClubType: yup.string().required('동아리 종류를 선택하세요.'),
  campusClubType: yup.string().when('clubType', {
    is: 'campus',
    then: (schema) => schema.required('동아리 종류를 선택하세요.'),
    otherwise: (schema) => schema.notRequired().strip(),
  }),
  name: yup.string().required('이름을 입력하세요.'),
  category: yup.string().required('카테고리를 선택하세요.'),
  location: yup.string().required('동아리 위치를 입력하세요.'),
  description: yup.string().max(50, '최대 50자까지 입력 가능합니다').required('한 줄 소개를 입력하세요.'),
  tags: yup.array().required('태그를 추가하세요.'),
});

export const clubDetailSchema = yup.object().shape({
  logo: yup.string().required('로고를 선택하세요.'),
  activity: yup
    .array()
    .min(1, '활동 사진을 선택하세요.')
    .max(5, '최대 5장까지만 업로드할 수 있습니다.')
    .required('활동 사진을 선택하세요.'),
  description: yup.string().max(300, '최대 300자까지 입력 가능합니다').required('동아리 상세 설명을 입력하세요.'),
});
