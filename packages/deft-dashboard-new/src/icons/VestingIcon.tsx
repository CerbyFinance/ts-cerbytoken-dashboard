function VestingIcon({ className }: { className: String }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20.077"
      height="20.077"
      viewBox="0 0 20.077 20.077"
      className={`${className} fill-current`}
    >
      <g id="Group_42" data-name="Group 42" transform="translate(-0.09 0)">
        <path
          id="Path_1868"
          data-name="Path 1868"
          d="M14,18.583a4.583,4.583,0,0,0,4.583,4.583V14A4.583,4.583,0,0,0,14,18.583Z"
          transform="translate(-8.5 -8.5)"
          // fill={`${theme === "light" ? "#8d97a0" : "#646464"}`}
        />
        <path
          id="Path_1869"
          data-name="Path 1869"
          d="M12.083,2a10.038,10.038,0,1,0,7.144,2.94A10.038,10.038,0,0,0,12.083,2ZM3.833,12.083a8.3,8.3,0,0,1,8.25-8.25V7.5a4.583,4.583,0,1,1,0,9.167v3.667a8.3,8.3,0,0,1-8.25-8.25Z"
          transform="translate(-2 -2)"
          // fill={`${theme === "light" ? "#8d97a0" : "#646464"}`}
        />
      </g>
    </svg>
  );
}

export default VestingIcon;
