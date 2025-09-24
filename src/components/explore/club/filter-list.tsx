import filtersStore from '@/stores/filter-store';
import FilterItem from './filter-item';

function FilterList() {
  const { filters, patch, toggle } = filtersStore();

  return (
    <div className="scrollbar-hide mr-[8px] flex w-full flex-row gap-[16px] overflow-x-scroll py-[8px]">
      {filters.clubType && (
        <FilterItem
          label={filters.clubType === 'campus' ? '교내' : '연합'}
          onRemove={() => {
            patch('clubType', null);
            patch('universityName', null);
            patch('location', null);
            toggle('detailTypes', '__CLEAR__');
          }}
        />
      )}
      {filters.universityName && (
        <FilterItem label={filters.universityName} onRemove={() => patch('universityName', null)} />
      )}
      {filters.detailTypes?.map((dt) => <FilterItem key={dt} label={dt} onRemove={() => toggle('detailTypes', dt)} />)}
      {filters.location && <FilterItem label={filters.location} onRemove={() => patch('location', null)} />}
      {filters.categories?.map((category) => (
        <FilterItem key={category} label={category} onRemove={() => toggle('categories', category)} />
      ))}
      {(filters.recruitmentStatuses?.length as number) > 0 && (
        <FilterItem
          label={filters.recruitmentStatuses?.includes('closed') ? '모집 완료' : '모집중'}
          onRemove={() => {
            toggle('recruitmentStatuses', '__CLEAR__');
            patch('endDateOption', null);
          }}
        />
      )}
      {filters.endDateOption && (
        <FilterItem label={filters.endDateOption} onRemove={() => patch('endDateOption', null)} />
      )}
      {filters.meeting && <FilterItem label={filters.meeting} onRemove={() => patch('meeting', null)} />}
      {filters.duesOption && <FilterItem label={filters.duesOption} onRemove={() => patch('duesOption', null)} />}
    </div>
  );
}

export default FilterList;
