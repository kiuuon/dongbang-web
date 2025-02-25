import { create } from 'zustand';

interface UserInfoStoreType {
  name: string;
  setName: (name: string) => void;
  birth: string;
  setBirth: (birth: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  nickname: string;
  setNickname: (nickname: string) => void;
  university: string;
  setUniversity: (university: string) => void;
  clubCount: string;
  setClubCount: (clubCount: string) => void;
  mbti: string;
  setMbti: (mbti: string) => void;
  path: string;
  setPath: (path: string) => void;
}

const userInfoStore = create<UserInfoStoreType>((set) => ({
  name: '',
  setName: (name) => set({ name }),
  birth: '',
  setBirth: (birth) => set({ birth }),
  gender: '',
  setGender: (gender) => set({ gender }),
  nickname: '',
  setNickname: (nickname) => set({ nickname }),
  university: '',
  setUniversity: (university) => set({ university }),
  clubCount: '',
  setClubCount: (clubCount) => set({ clubCount }),
  mbti: '',
  setMbti: (mbti) => set({ mbti }),
  path: '',
  setPath: (path) => set({ path }),
}));

export default userInfoStore;
