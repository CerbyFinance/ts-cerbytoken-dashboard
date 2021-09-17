function InfoIcon({ className }: { className: String }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className={`${className} fill-current`}
    >
      <path
        id="Subtraction_1"
        data-name="Subtraction 1"
        d="M9,18a9,9,0,1,1,9-9A9.01,9.01,0,0,1,9,18ZM8.433,8.275h0L7.168,12.67a1.364,1.364,0,0,0,1.2,1.832h.006a1.2,1.2,0,0,0,.893-.4L10.6,13a.233.233,0,0,0-.16-.4.238.238,0,0,0-.039,0l-1.5.133c0-.005.021-.08.056-.2.19-.675.768-2.73,1.21-4.193a1.366,1.366,0,0,0-1.2-1.832H8.96a1.2,1.2,0,0,0-.893.4l-1.332,1.1a.233.233,0,0,0,.2.4l1.5-.133ZM10.339,3a1,1,0,1,0,1,1A1,1,0,0,0,10.339,3Z"
        // fill={`${theme === "light" ? "#8d97a0" : "#646464"}`}
      />
    </svg>
  );
}

export default InfoIcon;
