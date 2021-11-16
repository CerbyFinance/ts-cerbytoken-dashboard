import { Box } from "grommet";
import Tooltip from "rc-tooltip";
import React from "react";

export const Hint = ({ children, description, placement }: any) => {
  return (
    <Tooltip
      placement={placement || "right"}
      mouseLeaveDelay={0}
      mouseEnterDelay={0}
      trigger={["hover"]}
      align={{
        offset: [8, 0],
      }}
      overlay={
        <HintOverlay>
          <Box pad="6px 8px">{description}</Box>
        </HintOverlay>
      }
    >
      {children}
    </Tooltip>
  );
};

export const HintOverlay = ({ children }: any) => (
  <Box
    background={"#444444"}
    round="4px"
    style={{
      boxShadow: "rgba(0, 0, 0, 0.176) 0px 0.1rem 0.3rem",
      // maxWidth: "140px",
      // minWidth: "140px",
      // width: "100%",
    }}
  >
    {children}
  </Box>
);
