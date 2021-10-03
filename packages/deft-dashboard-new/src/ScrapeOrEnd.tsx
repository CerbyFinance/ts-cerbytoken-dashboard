import { Box, Text } from "grommet";
import React, { useContext, useState } from "react";
import { HoveredElement } from "./shared/hooks";
import { ThemeContext } from "./shared/theme";

const ChevronDown = ({ color }: { color: string }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const Item = ({
  status,
  isDark,
  open,
  setOpen,
}: {
  status: string;
  isDark: boolean;
  open: boolean;
  setOpen: () => void;
}) => {
  const isCompleted = status === "completed";
  const color = isCompleted ? "#219653" : "#F2994A";
  return (
    <Box
      round="10px"
      style={
        isDark
          ? {
              background: "#101E33",
            }
          : {
              boxShadow: "0px 4px 5px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(196, 196, 196, 0.3)",
            }
      }
      width="100%"
      direction="row"
      onClick={setOpen}
    >
      <Box
        background={color}
        width="10px"
        height="auto"
        round={{
          corner: "left",
          size: "10px",
        }}
      ></Box>
      <Box width="20px"></Box>
      <Box pad="20px 20px 22px 0px" width="100%">
        <Box direction="row" width="100%" justify="between" align="center">
          <Box>
            <Text color={color} weight={600} size="16px">
              {isCompleted ? "Completed" : "In progress"}
            </Text>
            <Box height="8px"></Box>
            <Text size="14px" color="#C4C4C4">
              2 stakes
            </Text>
          </Box>

          <Box
            style={
              open
                ? {
                    transform: "rotate(180deg)",
                  }
                : {}
            }
          >
            <ChevronDown color={isDark ? "white" : "#29343E"} />
          </Box>
        </Box>
        {open && (
          <Box>
            <Box
              direction="row"
              align="center"
              margin={{
                top: "17px",
              }}
            >
              <Box
                width="100%"
                style={{
                  maxWidth: "283px",
                }}
              >
                <Box direction="row" justify="between">
                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    Total Staked Amount:
                  </Text>

                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    1,234,567.89 DEFT
                  </Text>
                </Box>
                <Box direction="row" justify="between">
                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    Total Interest & APY:
                  </Text>

                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    1,234,567.89 (14.8%) DEFT
                  </Text>
                </Box>
                <Box direction="row" justify="between">
                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    Total T-Shares decrease:
                  </Text>

                  <Text
                    size="12px"
                    style={{
                      lineHeight: "130%",
                    }}
                  >
                    -123,456.98 (-30.1%) DEFT
                  </Text>
                </Box>
              </Box>
              {/*  */}
              <Box width="9px"></Box>
              <HoveredElement
                render={binder => (
                  <Box
                    pad="9px 0px 8px"
                    width={"108px"}
                    background={
                      binder.hovered
                        ? "linear-gradient(96.34deg, #219653 0%, #08D660 100%)"
                        : "#219653"
                    }
                    round="5px"
                    style={{
                      cursor: "pointer",
                    }}
                    align="center"
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    {...binder.bind}
                  >
                    <Text
                      size="14px"
                      weight={500}
                      color={binder.hovered ? "white" : "white"}
                    >
                      {isCompleted ? "End Stakes" : "Scrape Stakes"}
                    </Text>
                  </Box>
                )}
              ></HoveredElement>
            </Box>
            {/* --- */}
            {!isCompleted && (
              <>
                <Box height="40px" align="center" direction="row">
                  <Box
                    height="1px"
                    width="100%"
                    background={isDark ? "rgba(255, 255, 255, 0.3)" : "#C4C4C4"}
                  ></Box>
                </Box>
                <Box direction="row" align="center">
                  <Box
                    width="100%"
                    style={{
                      maxWidth: "283px",
                    }}
                  >
                    <Box direction="row" justify="between">
                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        Total Staked Amount:
                      </Text>

                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        1,234,567.89 DEFT
                      </Text>
                    </Box>
                    <Box direction="row" justify="between">
                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        Total Interest & APY:
                      </Text>

                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        1,234,567.89 (14.8%) DEFT
                      </Text>
                    </Box>
                    <Box direction="row" justify="between">
                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        Total T-Shares decrease:
                      </Text>

                      <Text
                        size="12px"
                        style={{
                          lineHeight: "130%",
                        }}
                      >
                        -123,456.98 (-30.1%) DEFT
                      </Text>
                    </Box>
                  </Box>
                  {/*  */}
                  <Box width="9px"></Box>
                  <HoveredElement
                    render={binder => (
                      <Box
                        pad="9px 0px 8px"
                        width={"108px"}
                        background={
                          binder.hovered
                            ? "linear-gradient(96.34deg, #EB5757 0%, #BA2C2C 100%)"
                            : "#EB5757"
                        }
                        round="5px"
                        style={{
                          cursor: "pointer",
                        }}
                        align="center"
                        onClick={e => {
                          e.stopPropagation();
                        }}
                        {...binder.bind}
                      >
                        <Text
                          size="14px"
                          weight={500}
                          color={binder.hovered ? "white" : "white"}
                        >
                          {"End Stakes"}
                        </Text>
                      </Box>
                    )}
                  ></HoveredElement>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export const ScrapeOrEndModal = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

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
        Selected 6 stakes
      </Text>
      <Box height="26px"></Box>
      <Item
        isDark={isDark}
        open={open1}
        setOpen={() => setOpen1(!open1)}
        status="completed"
      />
      <Box height="15px"></Box>
      <Item
        isDark={isDark}
        open={open2}
        setOpen={() => setOpen2(!open2)}
        status="in-progress"
      />
    </Box>
  );
};
