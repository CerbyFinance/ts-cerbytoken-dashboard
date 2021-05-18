import { Box } from "grommet";
import React from "react";

export const CheckBox = ({
  active,
  onClick,
}: {
  active?: boolean;
  onClick?: () => void;
}) => {
  if (active) {
    return (
      <Box
        onClick={onClick}
        style={{
          cursor: "pointer",
        }}
      >
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M1 5.5C1 3.29086 2.79086 1.5 5 1.5H19C21.2091 1.5 23 3.29086 23 5.5V19.5C23 21.7091 21.2091 23.5 19 23.5H5C2.79086 23.5 1 21.7091 1 19.5V5.5ZM5 3.5H19C20.1046 3.5 21 4.39543 21 5.5V19.5C21 20.6046 20.1046 21.5 19 21.5H5C3.89543 21.5 3 20.6046 3 19.5V5.5C3 4.39543 3.89543 3.5 5 3.5Z"
            fill="#5ECA62"
          />
          <path
            d="M10.1313 17.702C9.93607 17.8973 9.61949 17.8973 9.42422 17.702L4.57453 12.8523C4.37975 12.6575 4.3792 12.3419 4.57328 12.1465L5.43534 11.2783C5.6304 11.0818 5.94794 11.0813 6.14369 11.277L9.42422 14.5576C9.61949 14.7528 9.93607 14.7528 10.1313 14.5576L17.8563 6.83258C18.0521 6.63683 18.3696 6.63739 18.5647 6.83383L19.4267 7.70201C19.6208 7.89747 19.6202 8.21309 19.4255 8.40786L10.1313 17.702ZM19.7778 2.5H4.22222C2.98889 2.5 2 3.48889 2 4.72222V20.2778C2 20.8671 2.23413 21.4324 2.65087 21.8491C3.06762 22.2659 3.63285 22.5 4.22222 22.5H19.7778C20.3671 22.5 20.9324 22.2659 21.3491 21.8491C21.7659 21.4324 22 20.8671 22 20.2778V4.72222C22 3.48889 21 2.5 19.7778 2.5Z"
            fill="#5ECA62"
          />
        </svg>
      </Box>
    );
  }

  return (
    <Box
      onClick={onClick}
      style={{
        cursor: "pointer",
      }}
    >
      <svg
        width="22"
        height="23"
        viewBox="0 0 22 23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 4.5C0 2.29086 1.79086 0.5 4 0.5H18C20.2091 0.5 22 2.29086 22 4.5V18.5C22 20.7091 20.2091 22.5 18 22.5H4C1.79086 22.5 0 20.7091 0 18.5V4.5ZM4 2.5H18C19.1046 2.5 20 3.39543 20 4.5V18.5C20 19.6046 19.1046 20.5 18 20.5H4C2.89543 20.5 2 19.6046 2 18.5V4.5C2 3.39543 2.89543 2.5 4 2.5Z"
          fill="#A1A1A1"
        />
      </svg>
    </Box>
  );
};
