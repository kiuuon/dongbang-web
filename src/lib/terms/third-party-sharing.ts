import TermsType from './terms-type';

export const THIRD_PARTY_SHARING: TermsType[] = [
  {
    id: '1',
    content: [
      {
        text: '동방(이하 ”회사”)은 회원의 개인정보를 원칙적으로 제 3 자에게 제공하지 않습니다. 다만, 서비스의 본질적인 기능인 ',
        bold: false,
      },
      { text: '동아리 가입 및 활동', bold: true },
      { text: '을 위하여 다음과 같은 개인정보 제 3 자 제공에 동의합니다.', bold: false },
    ],
  },
  {
    id: '2',
    title: '1. 개인정보를 제공받는 자',
    content: [
      { text: 'o ', bold: false },
      { text: '가입 신청 및 소속된 동아리의 운영진(회장 및 관리자)', bold: true },
    ],
  },
  {
    id: '3',
    title: '2. 제공받는 자의 이용 목적',
    content: [
      { text: 'o ', bold: false },
      { text: '동아리 가입 승인 심사, 회원 명부 관리, 신원 확인', bold: true },
    ],
  },
  {
    id: '4',
    title: '3. 제공 항목',
    content: [
      { text: 'o ', bold: false },
      { text: '이름, 사용자명', bold: true },
    ],
  },
  {
    id: '5',
    title: '4. 보유 및 이용 기간',
    content: [
      { text: 'o ', bold: false },
      { text: '동아리 탈퇴 시 또는 서비스 회원 탈퇴 시까지', bold: true },
    ],
  },
  {
    id: '6',
    title: '5. 동의를 거부할 권리 및 불이익',
    content: [
      {
        text: 'o 귀하는 개인정보 제 3 자 제공에 대한 동의를 거부할 권리가 있습니다.\no 다만, 본 제공 동의는 동아리 기반 서비스 제공을 위해 ',
        bold: false,
      },
      { text: '필수적인 사항', bold: true },
      { text: '이므로, 동의를 거부하실 경우 서비스 가입 및 이용이 불가능합니다.', bold: false },
    ],
  },
];
