export default function TaggedFeedIcon({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 7H13.5V17H5.5V7Z" fill="#F9A825" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.3999 5.99998C2.3999 4.67449 3.47442 3.59998 4.7999 3.59998H14.3999C15.7254 3.59998 16.7999 4.67449 16.7999 5.99998V18C16.7999 19.3255 17.8744 20.4 19.1999 20.4H4.7999C3.47442 20.4 2.3999 19.3255 2.3999 18V5.99998ZM5.9999 7.19998H13.1999V12H5.9999V7.19998ZM13.1999 14.4H5.9999V16.8H13.1999V14.4Z"
        fill="#F9A825"
      />
      <path
        d="M17.9999 8.39998H19.1999C20.5254 8.39998 21.5999 9.47449 21.5999 10.8V17.4C21.5999 18.3941 20.794 19.2 19.7999 19.2C18.8058 19.2 17.9999 18.3941 17.9999 17.4V8.39998Z"
        fill="#F9A825"
      />
      <path
        d="M12 9.5C12 10.6046 11.1046 11.5 10 11.5C8.89543 11.5 8 10.6046 8 9.5C8 8.39543 8.89543 7.5 10 7.5C11.1046 7.5 12 8.39543 12 9.5Z"
        fill="white"
      />
      <path d="M10 13C8.067 13 6.5 14.567 6.5 16.5H13.5C13.5 14.567 11.933 13 10 13Z" fill="white" />
      <path
        d="M12 9.5C12 10.6046 11.1046 11.5 10 11.5C8.89543 11.5 8 10.6046 8 9.5C8 8.39543 8.89543 7.5 10 7.5C11.1046 7.5 12 8.39543 12 9.5Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13C8.067 13 6.5 14.567 6.5 16.5H13.5C13.5 14.567 11.933 13 10 13Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19 20H5C3.89543 20 3 19.1046 3 18L3 6C3 4.89543 3.89543 4 5 4L15 4C16.1046 4 17 4.89543 17 6V7M19 20C17.8954 20 17 19.1046 17 18L17 7M19 20C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7L17 7M13 4L9 4M7 16H13M7 8H13V12H7V8Z"
        stroke="#989898"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="5" y="6" width="10" height="12" fill="white" />
      <path
        d="M12 9.5C12 10.6046 11.1046 11.5 10 11.5C8.89543 11.5 8 10.6046 8 9.5C8 8.39543 8.89543 7.5 10 7.5C11.1046 7.5 12 8.39543 12 9.5Z"
        stroke="#989898"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 13C8.067 13 6.5 14.567 6.5 16.5H13.5C13.5 14.567 11.933 13 10 13Z"
        stroke="#989898"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
