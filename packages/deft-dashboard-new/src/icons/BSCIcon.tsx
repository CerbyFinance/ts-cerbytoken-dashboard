function BSCIcon({
  className,
  color,
  active,
}: {
  className: String;
  color?: string;
  active?: boolean;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19.333"
      height="22.65"
      viewBox="0 0 19.333 22.65"
      className={` ${className} fill-current`}
    >
      <path
        id="binancedex"
        d="M573.974,1046.044v2.54l-2.215,1.3-2.152-1.3v-2.54l2.152,1.3Zm-11.85-8.785,2.152,1.3v4.356l3.705,2.215v2.54l-5.857-3.453Zm19.27,0v6.969l-5.92,3.453v-2.54l3.705-2.215v-4.356Zm-5.93-3.453,2.215,1.3h0v2.54l-3.705,2.215v4.419l-2.152,1.3-2.141-1.3v-4.429l-3.841-2.215v-2.54l2.215-1.3,3.705,2.215Zm-9.625,5.657,2.152,1.3v2.54l-2.152-1.3Zm11.839,0V1042l-2.152,1.3v-2.54Zm-13.4-7.872,2.215,1.3-2.215,1.3v2.54l-2.152-1.3v-2.54Zm14.967,0,2.215,1.3v2.54l-2.215,1.3v-2.54l-2.152-1.3Zm-7.484,0,2.215,1.3-2.215,1.3-2.152-1.3Zm0-4.356,5.92,3.453-2.152,1.3-3.705-2.215-3.779,2.215-2.152-1.3Z"
        transform="translate(-562.124 -1027.235)"
        // // fill={`${theme === "light" ? "#8d97a0" : "#646464"} ${active ? 'positive': 'negative'}`}
      />
    </svg>
  );
}

export default BSCIcon;
