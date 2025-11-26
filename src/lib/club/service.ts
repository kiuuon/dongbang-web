import { CLUB_ROLE_PERMISSIONS, PERMISSION_LABELS, ClubRole, ClubPermission } from './constants';

export function hasPermission(role: ClubRole, permission: ClubPermission): boolean {
  return CLUB_ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissionLabels(role: ClubRole) {
  return CLUB_ROLE_PERMISSIONS[role].map((permission) => PERMISSION_LABELS[permission]);
}

export function getRole(role: ClubRole) {
  if (role === 'president') {
    return '회장';
  }

  if (role === 'officer') {
    return '임원';
  }

  if (role === 'member') {
    return '부원';
  }

  if (role === 'on_leave') {
    return '휴학생';
  }

  if (role === 'graduate') {
    return '졸업생';
  }

  return '';
}
