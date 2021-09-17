function NightModeIcon({ className }: { className: String }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15.446"
      height="15.385"
      viewBox="0 0 15.446 15.385"
      className={`${className} fill-current`}
    >
      <path
        id="Path_19"
        data-name="Path 19"
        d="M8.25,3.119S-.312,9.119,6,15.931s13.125-2.062,13.125-2.062-4.312,1.813-8.562-2.25S8.25,3.119,8.25,3.119Z"
        transform="translate(-3.679 -3.119)"
        // fill={`${theme === "light" ? "#8d97a0" : "#646464"}`}
      />
    </svg>
  );
}

export default NightModeIcon;
