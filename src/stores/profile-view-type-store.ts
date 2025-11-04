import { create } from 'zustand';

interface ProfileViewTypeStore {
  viewType: string;
  setViewType: (viewType: string) => void;
  selectedFeedType: string;
  setSelectedFeedType: (selectedFeedType: string) => void;
}

const profileViewTypeStore = create<ProfileViewTypeStore>((set) => ({
  viewType: 'grid',
  setViewType: (viewType) => set({ viewType }),
  selectedFeedType: 'authored',
  setSelectedFeedType: (selectedFeedType) => set({ selectedFeedType }),
}));

export default profileViewTypeStore;
