import { create } from 'zustand';

interface UserInfoErrorStoreType {
  nameError: boolean;
  setNameError: (nameError: boolean) => void;
  birthError: boolean;
  setBirthError: (birthError: boolean) => void;
  nicknameError: boolean;
  setNicknameError: (nicknameError: boolean) => void;
  isSameCheck: boolean;
  setIsSameCheck: (isSameCheck: boolean) => void;
  isAvailableNickname: boolean;
  setIsAvailableNickname: (isAvailableNickname: boolean) => void;
  universityError: boolean;
  setUniversityError: (universityError: boolean) => void;
  mbtiError: boolean;
  setMbtiError: (mbtiError: boolean) => void;
}

const userInfoErrorStore = create<UserInfoErrorStoreType>((set) => ({
  nameError: false,
  setNameError: (nameError) => set({ nameError }),
  birthError: false,
  setBirthError: (birthError) => set({ birthError }),
  nicknameError: false,
  setNicknameError: (nicknameError) => set({ nicknameError }),
  isSameCheck: false,
  setIsSameCheck: (isSameCheck) => set({ isSameCheck }),
  isAvailableNickname: false,
  setIsAvailableNickname: (isAvailableNickname) => set({ isAvailableNickname }),
  universityError: false,
  setUniversityError: (universityError) => set({ universityError }),
  mbtiError: false,
  setMbtiError: (mbtiError) => set({ mbtiError }),
}));

export default userInfoErrorStore;
