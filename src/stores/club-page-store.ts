import { create } from 'zustand';

interface ClubPageStoreType {
  viewType: Record<string, string>;
  selectedTab: Record<string, string>;
  clubPageTop: number;

  setViewType: (clubId: string, viewType: string) => void;
  setSelectedTab: (clubId: string, tab: string) => void;
  setClubPageTop: (top: number) => void;
}

const clubPageStore = create<ClubPageStoreType>()((set) => ({
  viewType: {},
  selectedTab: {},
  clubPageTop: 0,

  setViewType: (clubId, viewType) =>
    set((state) => ({
      viewType: { ...state.viewType, [clubId]: viewType },
    })),

  setSelectedTab: (clubId, tab) =>
    set((state) => ({
      selectedTab: { ...state.selectedTab, [clubId]: tab },
    })),

  setClubPageTop: (top) => set({ clubPageTop: top }),
}));

export default clubPageStore;
