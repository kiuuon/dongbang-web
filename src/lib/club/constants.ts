export const CLUB_PERMISSIONS = {
  VIEW_ANNOUNCEMENT: 'view_announcement',
  WRITE_FEED: 'write_feed',
  VIEW_PRIVATE_FEED: 'view_private_feed',
  MANAGE_MEMBERSHIP: 'manage_membership',
  CHANGE_MEMBER_ROLE: 'change_member_role',
  EXPEL_MEMBER: 'expel_member',
  EDIT_CLUB_PAGE: 'edit_club_page',
  DELETE_CLUB_FEED: 'delete_club_feed',
  ANSWER_INQUIRY: 'answer_inquiry',
  MANAGE_ANNOUNCEMENT: 'manage_announcement',
  JOIN_CHAT_ROOM: 'join_chat_room',
  MANAGE_CHAT_ROOM: 'manage_chat_room',
} as const;

export type ClubRole = 'president' | 'officer' | 'member' | 'on_leave' | 'graduate';
export type ClubPermission = (typeof CLUB_PERMISSIONS)[keyof typeof CLUB_PERMISSIONS];

export const PERMISSION_LABELS: Record<ClubPermission, string> = {
  view_announcement: '공지 열람',
  write_feed: '피드 작성',
  view_private_feed: '비공개 피드 열람',
  manage_membership: '부원 초대 및 가입 승인',
  change_member_role: '부원 역할 변경',
  expel_member: '부원 추방',
  edit_club_page: '동아리 페이지 수정',
  delete_club_feed: '동아리 피드 삭제',
  answer_inquiry: '문의 답변',
  manage_announcement: '공지 관리',
  join_chat_room: '채팅방 참여',
  manage_chat_room: '채팅방 관리',
};

export const CLUB_ROLE_PERMISSIONS: Record<ClubRole, ClubPermission[]> = {
  president: Object.values(CLUB_PERMISSIONS),
  officer: [
    CLUB_PERMISSIONS.VIEW_ANNOUNCEMENT,
    CLUB_PERMISSIONS.MANAGE_ANNOUNCEMENT,
    CLUB_PERMISSIONS.WRITE_FEED,
    CLUB_PERMISSIONS.VIEW_PRIVATE_FEED,
    CLUB_PERMISSIONS.MANAGE_MEMBERSHIP,
    CLUB_PERMISSIONS.CHANGE_MEMBER_ROLE,
    CLUB_PERMISSIONS.EXPEL_MEMBER,
    CLUB_PERMISSIONS.EDIT_CLUB_PAGE,
    CLUB_PERMISSIONS.DELETE_CLUB_FEED,
    CLUB_PERMISSIONS.ANSWER_INQUIRY,
    CLUB_PERMISSIONS.JOIN_CHAT_ROOM,
    CLUB_PERMISSIONS.MANAGE_CHAT_ROOM,
  ],
  member: [
    CLUB_PERMISSIONS.VIEW_ANNOUNCEMENT,
    CLUB_PERMISSIONS.WRITE_FEED,
    CLUB_PERMISSIONS.VIEW_PRIVATE_FEED,
    CLUB_PERMISSIONS.JOIN_CHAT_ROOM,
  ],
  on_leave: [CLUB_PERMISSIONS.VIEW_ANNOUNCEMENT, CLUB_PERMISSIONS.VIEW_PRIVATE_FEED],
  graduate: [CLUB_PERMISSIONS.VIEW_ANNOUNCEMENT, CLUB_PERMISSIONS.VIEW_PRIVATE_FEED],
} as const;
