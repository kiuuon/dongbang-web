import { create } from 'zustand';

interface MyPageStoreType {
  viewType: string;
  setViewType: (viewType: string) => void;
  selectedFeedType: string;
  setSelectedFeedType: (selectedFeedType: string) => void;
}

const myPageStore = create<MyPageStoreType>((set) => ({
  viewType: 'grid',
  setViewType: (viewType) => set({ viewType }),
  selectedFeedType: 'authored',
  setSelectedFeedType: (selectedFeedType) => set({ selectedFeedType }),
}));

export default myPageStore;
