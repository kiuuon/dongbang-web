import { create } from 'zustand';

interface ClubPageStore {
  viewType: string;
  setViewType: (viewType: string) => void;
  selectedTab: string;
  setSelectedTab: (selectedTab: string) => void;
}

const clubPageStore = create<ClubPageStore>((set) => ({
  viewType: 'grid',
  setViewType: (viewType) => set({ viewType }),
  selectedTab: 'feed',
  setSelectedTab: (selectedTab) => set({ selectedTab }),
}));

export default clubPageStore;
