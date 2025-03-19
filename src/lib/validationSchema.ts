import * as yup from 'yup';

export const campusClubInfoSchema = yup.object().shape({
  campusClubType: yup.string().required('동아리 종류를 선택하세요.'),
  name: yup.string().required('이름을 입력하세요.'),
  category: yup.string().required('카테고리를 선택하세요.'),
  location: yup.string().required('동아리 위치를 입력하세요.'),
  description: yup.string().max(50, '최대 50자까지 입력 가능합니다').required('한 줄 소개를 입력하세요.'),
  tags: yup.array().required('태그를 추가하세요.'),
});
