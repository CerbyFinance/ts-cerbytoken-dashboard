function LeftArrowIcon() {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 28 28"
      >
        <defs>
          <filter
            id="Ellipse_25"
            x="0"
            y="0"
            width="28"
            height="28"
            filterUnits="userSpaceOnUse"
          >
            <feOffset dy="1" />
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feFlood floodOpacity="0.161" />
            <feComposite operator="in" in2="blur" />
            <feComposite in="SourceGraphic" />
          </filter>
        </defs>
        <g
          id="Group_298"
          data-name="Group 298"
          transform="translate(1541.5 -16407.5)"
        >
          <g
            transform="matrix(1, 0, 0, 1, -1541.5, 16407.5)"
            filter="url(#Ellipse_25)"
          >
            <circle
              id="Ellipse_25-2"
              data-name="Ellipse 25"
              cx="9.5"
              cy="9.5"
              r="9.5"
              transform="translate(4.5 3.5)"
              fill="#fff"
            />
          </g>
          <g
            id="Layer_2"
            data-name="Layer 2"
            transform="translate(-1535 16413.668)"
          >
            <g
              id="invisible_box"
              data-name="invisible box"
              transform="translate(0 0.334)"
            >
              <rect
                id="Rectangle_187"
                data-name="Rectangle 187"
                width="13"
                height="13"
                fill="none"
              />
            </g>
            <g
              id="icons_Q2"
              data-name="icons Q2"
              transform="translate(3.119 2.877)"
            >
              <path
                id="Path_74"
                data-name="Path 74"
                d="M12.352,13.976l3.01,3.01a.54.54,0,0,1-.057.852.6.6,0,0,1-.767-.057l-3.379-3.407a.54.54,0,0,1,0-.8l3.379-3.407a.6.6,0,0,1,.767-.057.54.54,0,0,1,.057.852Z"
                transform="translate(-10.985 -10.001)"
                fill="#29343e"
              />
              <path
                id="Path_75"
                data-name="Path 75"
                d="M24.352,13.976l3.01,3.01a.54.54,0,0,1-.057.852.6.6,0,0,1-.767-.057l-3.379-3.407a.54.54,0,0,1,0-.8l3.379-3.407a.6.6,0,0,1,.767-.057.54.54,0,0,1,.057.852Z"
                transform="translate(-19.577 -10.001)"
                fill="#29343e"
              />
            </g>
          </g>
        </g>
      </svg>
    </>
  );
}

export default LeftArrowIcon;
