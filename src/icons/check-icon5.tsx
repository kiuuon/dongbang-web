export default function CheckIcon5({ isActive }: { isActive: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.91675 7.5835L5.25008 9.91683L11.0834 4.0835"
        stroke={isActive ? '#009E25' : '#C3C3C3'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
