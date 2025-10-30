export default function ListIcon({ isActive }: { isActive: boolean }) {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="12" height="4" rx="1" fill={isActive ? 'black' : '#C3C3C3'} />
      <rect x="13" width="4" height="4" rx="1" fill={isActive ? 'black' : '#C3C3C3'} />
      <rect y="6.5" width="12" height="4" rx="1" fill={isActive ? 'black' : '#C3C3C3'} />
      <rect x="13" y="6.5" width="4" height="4" rx="1" fill={isActive ? 'black' : '#C3C3C3'} />
      <rect y="13" width="12" height="4" rx="1" fill={isActive ? 'black' : '#C3C3C3'} />
      <rect x="13" y="13" width="4" height="4" rx="1" fill={isActive ? 'black' : '#C3C3C3'} />
    </svg>
  );
}
