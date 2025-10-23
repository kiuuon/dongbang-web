import { create } from 'zustand';

interface LoginModalStoreType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const loginModalStore = create<LoginModalStoreType>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));

export default loginModalStore;
