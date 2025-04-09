export default function ProfileIcon({ color }: { color: string }) {
  return (
    <svg width="44" height="37" viewBox="0 0 44 37" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.4789 18.8723C26.6199 18.8723 30.7874 14.8715 30.7874 9.93617C30.7874 5.00086 26.6199 1 21.4789 1C16.338 1 12.1704 5.00086 12.1704 9.93617C12.1704 14.8715 16.338 18.8723 21.4789 18.8723Z"
        fill={color}
        stroke={color}
        strokeMiterlimit="10"
      />
      <path
        d="M41.9557 35.9984V35.2769C41.9557 27.0741 34.9802 20.3617 26.4558 20.3617H16.4999C7.97556 20.3617 1 27.0741 1 35.2769V36H41.9574L41.9557 35.9984Z"
        fill={color}
        stroke={color}
        strokeMiterlimit="10"
      />
    </svg>
  );
}
