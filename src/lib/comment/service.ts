import { shuffleArray } from '../utils';

export function sortMentionUsers(keyword: string, users: { name: string; nickname: string; avatar: string }[]) {
  const lower = keyword.toLowerCase();

  const nicknameStarts: { name: string; nickname: string; avatar: string }[] = [];
  const nicknameIncludes: { name: string; nickname: string; avatar: string }[] = [];
  const nameStarts: { name: string; nickname: string; avatar: string }[] = [];
  const nameIncludes: { name: string; nickname: string; avatar: string }[] = [];

  users.forEach((user) => {
    const nk = user.nickname.toLowerCase();
    const nm = user.name.toLowerCase();

    if (nk.startsWith(lower)) nicknameStarts.push(user);
    else if (nk.includes(lower)) nicknameIncludes.push(user);
    else if (nm.startsWith(lower)) nameStarts.push(user);
    else if (nm.includes(lower)) nameIncludes.push(user);
  });

  shuffleArray(nameStarts);
  shuffleArray(nameIncludes);

  return [...nicknameStarts, ...nicknameIncludes, ...nameStarts, ...nameIncludes];
}
