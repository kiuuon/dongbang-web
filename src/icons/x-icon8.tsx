export default function XIcon8({ isActive }: { isActive: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 10.5L10.5 3.5M3.5 3.5L10.5 10.5"
        stroke={isActive ? '#F40707' : '#C3C3C3'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
