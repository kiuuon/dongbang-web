import { create } from 'zustand';

interface ClubPageStoreType {
  viewType: Record<string, string>;
  selectedTab: Record<string, string>;

  setViewType: (clubId: string, viewType: string) => void;
  setSelectedTab: (clubId: string, tab: string) => void;
}

const clubPageStore = create<ClubPageStoreType>()((set) => ({
  viewType: {},
  selectedTab: {},

  setViewType: (clubId, viewType) =>
    set((state) => ({
      viewType: { ...state.viewType, [clubId]: viewType },
    })),

  setSelectedTab: (clubId, tab) =>
    set((state) => ({
      selectedTab: { ...state.selectedTab, [clubId]: tab },
    })),
}));

export default clubPageStore;
