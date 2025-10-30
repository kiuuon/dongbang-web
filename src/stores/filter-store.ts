import { create } from 'zustand';

type ClubType = 'campus' | 'union';

export type Filters = {
  keyword?: string;
  clubType?: ClubType | null;
  universityName?: string | null;
  detailTypes?: string[];
  location?: string | null;
  categories?: string[];
};

const DEFAULT_FILTERS: Filters = {
  clubType: null,
  universityName: null,
  detailTypes: [],
  location: null,
  categories: [],
};

type FiltersStore = {
  filters: Filters;
  patch: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  toggle: (key: keyof Filters, value: any) => void;
  draftFilters: Filters;
  draftPatch: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  draftToggle: (key: keyof Filters, value: any) => void;
  reset: () => void;
  apply: () => void;
  discard: () => void;
};

const filtersStore = create<FiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  patch: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  toggle: (key, value) =>
    set((state) => {
      if (value === '__CLEAR__') {
        return { filters: { ...state.filters, [key]: [] } };
      }

      const arr = new Set(state.filters[key] ?? []);

      if (arr.has(value)) {
        arr.delete(value);
      } else {
        arr.add(value);
      }

      return { filters: { ...state.filters, [key]: Array.from(arr) as any } };
    }),
  draftFilters: DEFAULT_FILTERS,
  draftPatch: (key, value) => set((state) => ({ draftFilters: { ...state.draftFilters, [key]: value } })),
  draftToggle: (key, value) =>
    set((state) => {
      if (value === '__CLEAR__') {
        return { draftFilters: { ...state.draftFilters, [key]: [] } };
      }

      const arr = new Set(state.draftFilters[key] ?? []);

      if (arr.has(value)) {
        arr.delete(value);
      } else {
        arr.add(value);
      }

      return { draftFilters: { ...state.draftFilters, [key]: Array.from(arr) as any } };
    }),
  reset: () => set({ draftFilters: DEFAULT_FILTERS }),
  apply: () => set((state) => ({ filters: state.draftFilters })),
  discard: () => set((state) => ({ draftFilters: state.filters })),
}));

export default filtersStore;
