export interface UserType {
  id: string;
  avatar?: string | null;
  name: string;
  gender: string | null;
  nickname: string;
  university_id: number;
  major: string;
  term_of_use?: boolean;
  privacy_policy?: boolean;
  third_party_consent?: boolean;
  marketing?: boolean;
}
