export default function ProfileIcon({ color }: { color: string }) {
  return (
    <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.5002 13.766C16.6382 13.766 19.182 10.9082 19.182 7.38298C19.182 3.85776 16.6382 1 13.5002 1C10.3622 1 7.81836 3.85776 7.81836 7.38298C7.81836 10.9082 10.3622 13.766 13.5002 13.766Z"
        fill={color}
        stroke={color}
        strokeMiterlimit="10"
      />
      <path
        d="M25.999 25.9988V25.4835C25.999 19.6243 21.7411 14.8298 16.538 14.8298H10.461C5.25781 14.8298 1 19.6243 1 25.4835V26H26L25.999 25.9988Z"
        fill={color}
        stroke={color}
        strokeMiterlimit="10"
      />
    </svg>
  );
}
