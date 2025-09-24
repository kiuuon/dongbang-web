import XIcon5 from '@/icons/x-icon5';

function FilterItem({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <div className="flex flex-row items-center justify-center gap-[6px] whitespace-nowrap">
      <span className="text-regular14 text-gray2">{label}</span>
      <button type="button" onClick={onRemove}>
        <XIcon5 />
      </button>
    </div>
  );
}

export default FilterItem;
