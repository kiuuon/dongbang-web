import { CLUB_ROLE_PERMISSIONS, PERMISSION_LABELS, ClubRole, ClubPermission } from './constants';

export function hasPermission(role: ClubRole, permission: ClubPermission): boolean {
  return CLUB_ROLE_PERMISSIONS[role].includes(permission) ?? false;
}

export function getPermissionLabels(role: ClubRole) {
  return CLUB_ROLE_PERMISSIONS[role].map((permission) => PERMISSION_LABELS[permission]);
}
