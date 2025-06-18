export default function ToggleIcon({ active }: { active: boolean }) {
  return active ? (
    <svg width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="24" rx="12" fill="#F9A825" />
      <circle cx="32" cy="12" r="8" fill="white" />
    </svg>
  ) : (
    <svg width="44" height="24" viewBox="0 0 44 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="24" rx="12" fill="#EDF0F4" />
      <circle cx="12" cy="12" r="8" fill="white" />
    </svg>
  );
}
