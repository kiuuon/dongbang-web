import { create } from 'zustand';

type RecruitmentStatus = 'open' | 'closed' | 'always';
type ClubType = 'campus' | 'union';
type EndDateOption = 'D-Day' | '7일 이내' | '15일 이내' | '30일 이내' | '장기 모집' | null;
type DuesOption = '0원 ~ 5만원' | '5만원 ~ 10만원' | '10만원 이상' | null;

export type Filters = {
  keyword?: string;
  clubType?: ClubType | null;
  universityName?: string | null;
  detailTypes?: string[];
  location?: string | null;
  categories?: string[];
  recruitmentStatuses?: RecruitmentStatus[];
  endDateOption?: EndDateOption;
  duesOption?: DuesOption;
  meeting?: string | null;
};

const DEFAULT_FILTERS: Filters = {
  clubType: null,
  universityName: null,
  detailTypes: [],
  location: null,
  categories: [],
  recruitmentStatuses: [],
  endDateOption: null,
  meeting: null,
  duesOption: null,
};

type FiltersStore = {
  filters: Filters;
  draftFilters: Filters;
  patch: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  toggle: (key: keyof Filters, value: any) => void;
  reset: () => void;
  apply: () => void;
  discard: () => void;
};

const filtersStore = create<FiltersStore>((set) => ({
  filters: DEFAULT_FILTERS,
  draftFilters: DEFAULT_FILTERS,
  patch: (key, value) => set((state) => ({ draftFilters: { ...state.draftFilters, [key]: value } })),
  toggle: (key, value) =>
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
