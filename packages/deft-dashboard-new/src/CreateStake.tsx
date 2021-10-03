import { Box, Text } from "grommet";
import Tooltip from "rc-tooltip";
import React, { useContext } from "react";
import styled from "styled-components";
import { HoveredElement } from "./shared/hooks";
import { ThemeContext } from "./shared/theme";

const Input = styled.input`
  border: none;
  height: 50px;
  border-radius: 6px;
  font-size: 16px;

  padding: 0px 15px 0px 15px;
  outline: none;

  background: transparent;

  /* background: #f6f2e9; */

  &::placeholder {
    color: #c1c1c1;
  }

  &:active,
  &:focus {
    border: 2px solid #5294ff !important;
  }

  transition: none;
`;
//
const Input2 = styled.input`
  background: transparent;
  & {
    height: 36px;
    -webkit-appearance: none;
    margin: 10px 0;
    width: 100%;
  }
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 10px;
    cursor: pointer;
    animate: 0.2s;
    box-shadow: 0px 0px 0px #000000;
    background: #e5e7eb;
    border-radius: 5px;
    border: 0px solid #000000;
  }
  &::-webkit-slider-thumb {
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #000000;
    height: 30px;
    width: 30px;
    border-radius: 48px;
    background: #5294ff;
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -10px;
  }

  &::-ms-thumb {
    margin-top: 1px;
    box-shadow: 0px 0px 0px #000000;
    border: 0px solid #000000;
    height: 30px;
    width: 30px;
    border-radius: 48px;
    background: #5294ff;
    cursor: pointer;
  }
`;

const ArrowUp = ({ color }: { color: string }) => (
  <svg
    width="33"
    height="21"
    viewBox="0 0 33 21"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16.5 0L32.5215 20.25H0.478531L16.5 0Z" />
  </svg>
);

{
  /* <Box>
<Grommet
  theme={{
    global: {
      size: {
        medium: "220px",
      },
    },
    calendar: {
      heading: {
        level: "14px",
      },
      medium: {
        daySize: "30px",
      },
    },
  }}
>
  <Calendar
    size="medium"
    date={undefined}
    dates={["2019-11-12", "2019-11-17"]}
  />
</Grommet>
</Box> */
}

const TooltipCalendar = ({ isDark }: { isDark: boolean }) => {
  return (
    <Tooltip
      placement="bottom"
      trigger={["click"]}
      align={{
        offset: [0, 20],
      }}
      overlay={
        <Box
          style={{
            position: "relative",
            boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.07)",
          }}
          align="center"
        >
          <Box
            style={{
              position: "absolute",
              top: "-13px",
            }}
          >
            <ArrowUp color={isDark ? "black" : "white"} />
          </Box>
          <Box
            background={isDark ? "black" : "white"}
            style={
              isDark
                ? {
                    border: "1px solid #707070",
                  }
                : {}
            }
            width="190px"
            pad="20px 20px 23px"
            round="5px"
            // alignSelf="start"
            align="start"
          >
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
            >
              1 month
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              weight={600}
              style={{
                cursor: "pointer",
              }}
            >
              6 months
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
            >
              1 years
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
            >
              2 years
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
            >
              5 years
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
            >
              10 years
            </Text>
            <Box height="20px"></Box>
            <Text
              size="16px"
              style={{
                cursor: "pointer",
              }}
            >
              Choose period
            </Text>
            <Box height="20px"></Box>

            <HoveredElement
              render={binder => (
                <Box
                  height="36px"
                  align="center"
                  pad="0px 18px"
                  justify="center"
                  round="5px"
                  style={{
                    cursor: "pointer",
                  }}
                  background={
                    binder.hovered
                      ? "linear-gradient(91.86deg, #71A7FF 0%, #1F67DB 100%)"
                      : "#5294FF"
                  }
                  onClick={() => {}}
                  {...binder.bind}
                >
                  <Text size="14px" weight={500} color="white">
                    Continue
                  </Text>
                </Box>
              )}
            ></HoveredElement>
          </Box>
        </Box>
      }
      // overlay={<Overlay>{overlayContent} </Overlay>}
    >
      <div>
        <CalendarIcon stroke={isDark ? "white" : "#29343E"} />
      </div>
    </Tooltip>
  );
};

const CalendarIcon = ({ stroke }: { stroke: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16 2V6"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8 2V6"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M3 10H21"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const CreateStakeModal = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  return (
    <Box
      pad="30px 30px 33px"
      width="510px"
      round="10px"
      className="bg-white dark:bg-black"
      style={
        isDark
          ? {
              border: "1px solid #707070",
            }
          : {}
      }
    >
      <Text size="30px" color="text">
        Create Stake
      </Text>
      <Box height="36px"></Box>
      <Box direction="row" justify="between">
        <Text size="14px" color="text">
          Stake Amount in DEFT
        </Text>

        <Text size="14px" color="#C4C4C4">
          24.356 DEFT available
        </Text>
      </Box>
      <Box height="13px"></Box>
      <Input
        style={{
          border: isDark ? "2px solid #707070" : "2px solid #c4c4c4",
          color: isDark ? "white" : "#29343E",
        }}
      />

      <Box
        direction="row"
        align="center"
        style={{
          position: "relative",
        }}
      >
        <Input2
          type="range"
          min={0}
          max={100}
          // onChange={e => console.log(e.target.value)}
        />

        <Box width="8px"></Box>
        <Text size="16px" weight={500} color="#5294FF">
          100%
        </Text>
      </Box>
      <Box height="23px"></Box>

      <Box direction="row" align="center" justify="between">
        <Text size="14px" color="text">
          Stake length in days
        </Text>

        <Box
          style={{
            position: "relative",
          }}
          align="center"
          direction="row"
        >
          <Input
            style={{
              border: isDark ? "2px solid #707070" : "2px solid #c4c4c4",
              color: isDark ? "white" : "#29343E",
              width: "200px",
            }}
          />
          <Box
            style={{
              position: "absolute",
              right: "12px",
              cursor: "pointer",
            }}
          >
            <TooltipCalendar isDark={isDark} />
          </Box>
        </Box>
      </Box>
      <Box height="15px"></Box>
      <Box background={isDark ? "#101E33" : "#E5E7EB"} round="10px" pad="20px">
        <Text size="16px">Stake Bonuses</Text>
        <Box height="23px"></Box>
        <Box
          direction="row"
          justify="between"
          margin={{
            bottom: "13px",
          }}
        >
          <Text size="14px">Longer pays better</Text>
          <Text size="14px" weight={500}>
            +16.48 DEFT
          </Text>
        </Box>
        <Box
          direction="row"
          justify="between"
          margin={{
            bottom: "13px",
          }}
        >
          <Text size="14px">Effective DEFT:</Text>
          <Text size="14px" weight={500}>
            1,016 DEFT
          </Text>
        </Box>
        <Box
          direction="row"
          justify="between"
          margin={{
            bottom: "13px",
          }}
        >
          <Text size="14px">Share Price:</Text>
          <Text size="14px" weight={500}>
            18,634 DEFT / T-share
          </Text>
        </Box>
        <Box
          direction="row"
          justify="between"
          margin={{
            bottom: "13px",
          }}
        >
          <Text size="14px">Stake T-Shares:</Text>
          <Text size="14px" weight={500}>
            0.0545
          </Text>
        </Box>
        <Box direction="row" justify="between">
          <Text size="14px">Date end of stake</Text>
          <Text size="14px" weight={500}>
            25.05.2020 5:00 AM
          </Text>
        </Box>
      </Box>

      <Box height="20px"></Box>
      <Box direction="row" justify="between">
        <HoveredElement
          render={binder => (
            <Box
              pad="9px 18px 8px"
              background={
                binder.hovered
                  ? "linear-gradient(133.2deg, #FF5252 0%, #E83838 54.74%, #D62424 97.05%)"
                  : "transparent"
              }
              round="5px"
              style={{
                cursor: "pointer",
                border: "1px solid #FF5252",
              }}
              {...binder.bind}
            >
              <Text
                size="14px"
                weight={500}
                color={binder.hovered ? "white" : "#FF5252"}
              >
                Cancel
              </Text>
            </Box>
          )}
        ></HoveredElement>
        <HoveredElement
          render={binder => (
            <Box
              height="36px"
              align="center"
              justify="center"
              round="5px"
              style={{
                cursor: "pointer",
              }}
              pad={"0px 18px"}
              background={
                binder.hovered
                  ? "linear-gradient(91.86deg, #71A7FF 0%, #1F67DB 100%)"
                  : "#5294FF"
              }
              {...binder.bind}
            >
              <Text size="14px" weight={500} color="white">
                Create Stake
              </Text>
            </Box>
          )}
        ></HoveredElement>
      </Box>
    </Box>
  );
};
