export default function ToggleIcon2({ active }: { active: boolean }) {
  return active ? (
    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="20" rx="10" fill="#F9A825" />
      <circle cx="29" cy="10" r="7" fill="white" />
    </svg>
  ) : (
    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="20" rx="10" fill="#EDF0F4" />
      <circle cx="11" cy="10" r="7" fill="white" />
    </svg>
  );
}
