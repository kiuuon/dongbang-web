const ERROR_MESSAGE = {
  SESSION: {
    FETCH_FAILED: '세션 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
    SET_FAILED: '세션 정보를 설정하는 데 실패했습니다. 다시 시도해주세요.',
  },
  AUTH: {
    LOGIN_STATUS_CHECK_FAILED: '로그인 상태를 확인하는 데 실패했습니다. 다시 시도해주세요.',
    LOGOUT_FAILED: '로그아웃에 실패했습니다. 다시 시도해주세요.',
  },
  USER: {
    ID_FETCH_FAILED: '사용자 ID를 불러오는 데 실패했습니다. 다시 시도해주세요.',
    ROLE_FETCH_FAILED: '내 역할을 불러오는 데 실패했습니다. 다시 시도해주세요.',
    INFO_FETCH_FAILED: '사용자 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
    SIGN_UP_FAILED: '회원가입에 실패했습니다. 다시 시도해주세요.',
    NICKNAME_DUPLICATE_CHECK_FAILED: '닉네임 중복 확인에 실패했습니다. 다시 시도해주세요.',
  },
  CLUB: {
    INFO_FETCH_FAILED: '동아리 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
    MEMBERS_FETCH_FAILED: '동아리 멤버 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.',
    COUNT_FETCH_FAILED: '동아리 수를 불러오는 데 실패했습니다. 다시 시도해주세요.',
    LIST_FETCH_FAILED: '동아리 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.',
    RECOMMEND_FETCH_FAILED: '동아리 추천을 불러오는 데 실패했습니다. 다시 시도해주세요.',
    JOIN_STATUS_FETCH_FAILED: '동아리 가입 상태 확인을 실패했습니다. 다시 시도해주세요.',
    INVITE_CODE_FETCH_FAILED: '초대 코드를 불러오는 데 실패했습니다. 다시 시도해주세요.',
    INVITE_LINK_CREATE_FAILED: '초대 링크 발급에 실패했습니다. 다시 시도해주세요.',
    INVITE_LINK_DELETE_FAILED: '초대 링크 삭제에 실패했습니다. 다시 시도해주세요.',
    CREATE_FAILED: '동아리 개설에 실패했습니다. 다시 시도해주세요.',
    JOIN_FAILED: '동아리 가입에 실패했습니다. 다시 시도해주세요.',
  },
  UNIVERSITY: {
    LIST_FETCH_FAILED: '대학 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.',
  },
  FEED: {
    DETAIL_FETCH_FAILED: '피드 정보를 불러오는 데 실패했습니다. 다시 시도해주세요.',
    LIST_FETCH_FAILED: '피드 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.',
    WRITE_FAILED: '피드 작성에 실패했습니다. 다시 시도해주세요.',
    EDIT_FAILED: '피드 수정에 실패했습니다. 다시 시도해주세요.',
    DELETE_FAILED: '피드 삭제에 실패했습니다. 다시 시도해주세요.',
  },
  HASHTAG: {
    FETCH_FAILED: '해시태그를 불러오는 데 실패했습니다. 다시 시도해주세요.',
  },
  COMMENT: {
    COUNT_FETCH_FAILED: '댓글 수를 불러오는 데 실패했습니다. 다시 시도해주세요.',
    LIST_FETCH_FAILED: '댓글 목록을 불러오는 데 실패했습니다. 다시 시도해주세요.',
    WRITE_FAILED: '댓글 작성에 실패했습니다. 다시 시도해주세요.',
    DELETE_FAILED: '댓글 삭제에 실패했습니다. 다시 시도해주세요.',
  },
  IMAGE: {
    LOGO_UPLOAD_FAILED: '로고 업로드에 실패했습니다. 다시 시도해주세요.',
    ACTIVITY_UPLOAD_FAILED: '활동 사진 업로드에 실패했습니다. 다시 시도해주세요.',
    PHOTO_UPLOAD_FAILED: '사진 업로드에 실패했습니다. 다시 시도해주세요.',
  },
  LIKE: {
    USERS_FETCH_FAILED: '좋아요 유저 리스트를 불러오는 데 실패했습니다. 다시 시도해주세요.',
    COUNT_FETCH_FAILED: '좋아요 수를 불러오는 데 실패했습니다. 다시 시도해주세요.',
    MY_LIKE_FETCH_FAILED: '내 좋아요 여부를 불러오는 데 실패했습니다. 다시 시도해주세요.',
    ADD_FAILED: '좋아요 추가에 실패했습니다. 다시 시도해주세요.',
    DELETE_FAILED: '좋아요 삭제에 실패했습니다. 다시 시도해주세요.',
  },
  FEEDBACK: {
    SEND_FAILED: '피드백 전송에 실패했습니다. 다시 시도해주세요.',
  },
};

const SPORTS_CATEGORIES = [
  '축구',
  '농구',
  '야구',
  '탁구',
  '배구',
  '볼링',
  '수영',
  '런닝',
  '등산',
  '테니스',
  '자전거',
  '유도',
  '주짓수',
  '태권도',
  '복싱',
  '스키',
  '보드',
  '서핑',
  '배드민턴',
  '클라이밍',
  '기타운동',
];

const ART_CATEGORIES = [
  '밴드',
  '댄스',
  '연극',
  '뮤지컬',
  '합창',
  '악기',
  '국악',
  '작곡',
  '응원단',
  '드로잉',
  '공예',
  '만화',
  '영상제작',
  '마술',
  '기타예술',
];

const HOBBY_CATEGORIES = [
  '게임',
  '독서',
  '영화',
  '사진',
  '여행',
  '요리',
  '보드게임',
  '맛집탐방',
  '주류',
  '경기직관',
  '전시관람',
  '기타취미',
];

const SOCIETY_CATEGORIES = ['봉사', '종교', '기타사회'];

const ACADEMIC_CATEGORIES = [
  '인문',
  '경제',
  '금융',
  '법',
  '공학',
  '자연과학',
  '수학',
  '환경',
  '창업',
  '주식',
  '회화',
  '토론',
  '의학',
  'IT',
  '기타학술',
];

export { SPORTS_CATEGORIES, ART_CATEGORIES, HOBBY_CATEGORIES, SOCIETY_CATEGORIES, ACADEMIC_CATEGORIES, ERROR_MESSAGE };
