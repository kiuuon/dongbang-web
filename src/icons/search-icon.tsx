export default function SearchIcon({ color }: { color: string }) {
  return (
    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.1319 12.3159C22.1319 17.7371 17.7371 22.1319 12.3159 22.1319C6.89474 22.1319 2.5 17.7371 2.5 12.3159C2.5 6.89474 6.89474 2.5 12.3159 2.5C17.7371 2.5 22.1319 6.89474 22.1319 12.3159Z"
        stroke={color}
        strokeWidth="5"
        strokeMiterlimit="10"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.5151 22.3096L28.67 31.4645L32.2055 35.0001L34.9998 32.2058L31.4643 28.6703L22.3094 19.5154C21.534 20.5898 20.5896 21.5342 19.5151 22.3096Z"
        fill={color}
      />
    </svg>
  );
}
