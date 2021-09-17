function ETHIcon({
  className,
  active,
}: {
  className: String;
  active?: boolean;
}) {
  return (
    <svg
      id="Group_39"
      data-name="Group 39"
      xmlns="http://www.w3.org/2000/svg"
      width="11.99"
      height="22.707"
      viewBox="0 0 11.99 22.707"
      className={`${className} fill-current`}
    >
      <path
        id="Path_32"
        data-name="Path 32"
        d="M893-33.156l5.995,9.475,5.995-9.475-5.995,3.729Z"
        transform="translate(-893 46.388)"
        // // fill={`${theme === "light" ? "#8d97a0" : "#646464"} ${active ? 'positive': 'negative'}`}
      />
      <path
        id="Path_33"
        data-name="Path 33"
        d="M893.641-34.824l5.444,3.293,5.269-3.293-5.269-2.467Z"
        transform="translate(-893.089 47.442)"
        // // fill={`${theme === "light" ? "#8d97a0" : "#646464"} ${active ? 'positive': 'negative'}`}
      />
      <path
        id="Path_34"
        data-name="Path 34"
        d="M899.013-48.125l-5.981,12.072,5.981-2.859,5.928,2.859Z"
        transform="translate(-893.004 48.125)"
        // // fill={`${theme === "light" ? "#8d97a0" : "#646464"} ${active ? 'positive': 'negative'}`}
      />
    </svg>
  );
}

export default ETHIcon;
