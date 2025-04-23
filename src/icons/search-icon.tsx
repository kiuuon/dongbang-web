export default function SearchIcon({ color }: { color: string }) {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16.5942 8.79709C16.5942 13.1033 13.1033 16.5942 8.79709 16.5942C4.49087 16.5942 1 13.1033 1 8.79709C1 4.49088 4.49088 1 8.79709 1C13.1033 1 16.5942 4.49088 16.5942 8.79709Z"
        stroke={color}
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <path
        d="M25.0001 23.004L23.004 25.0001L13.9386 15.9337C14.7059 15.3799 15.3799 14.7059 15.9337 13.9385L25.0001 23.004Z"
        fill={color}
      />
    </svg>
  );
}
