import { create } from 'zustand';

interface ProfilePageStoreType {
  viewType: Record<string, string>;
  selectedFeedType: Record<string, string>;
  setViewType: (clubId: string, viewType: string) => void;
  setSelectedFeedType: (clubId: string, tab: string) => void;
}

const profilePageStore = create<ProfilePageStoreType>()((set) => ({
  viewType: {},
  selectedFeedType: {},

  setViewType: (clubId, viewType) =>
    set((state) => ({
      viewType: { ...state.viewType, [clubId]: viewType },
    })),

  setSelectedFeedType: (clubId, tab) =>
    set((state) => ({
      selectedFeedType: { ...state.selectedFeedType, [clubId]: tab },
    })),
}));

export default profilePageStore;
