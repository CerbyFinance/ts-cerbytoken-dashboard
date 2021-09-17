function CloseMenuIcon({ className }: { className: String }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20.109"
      height="20.202"
      viewBox="0 0 20.109 20.202"
      className={`${className} fill-current`}
    >
      <path
        id="Path_36"
        data-name="Path 36"
        d="M28.184,25.06l6.257-6.145a2.346,2.346,0,0,0,.223-3.017,2.123,2.123,0,0,0-3.352-.223l-6.257,6.257L18.8,15.675a2.123,2.123,0,0,0-3.352.223,2.346,2.346,0,0,0,.223,3.017l6.257,6.145L15.67,31.205a2.346,2.346,0,0,0-.223,3.017,2.123,2.123,0,0,0,3.352.223l6.257-6.257,6.257,6.257a2.123,2.123,0,0,0,3.352-.223,2.346,2.346,0,0,0-.223-3.017Z"
        transform="translate(-15.001 -14.959)"
        // fill={`${theme === "light" ? "#8d97a0" : "#646464"}`}
      />
    </svg>
  );
}

export default CloseMenuIcon;
