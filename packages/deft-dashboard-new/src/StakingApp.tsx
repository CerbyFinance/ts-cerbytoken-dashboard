import { Box, Text } from "grommet";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import useMedia from "use-media";
import { HoveredElement } from "./shared/hooks";
import { ModalsContext } from "./shared/modals";
import { ThemeContext } from "./shared/theme";
import stakes from "./stakes.json";

const Check = () => (
  <svg
    width="18"
    height="13"
    viewBox="0 0 18 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 1L6 12L1 7"
      stroke="#29343E"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const ArrowLeft = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.687 5L8.68701 12L15.687 19"
      stroke="#9CA3AF"
      stroke-linecap="square"
    />
  </svg>
);

const CheckBox = ({
  checked,
  onClick,
}: {
  checked?: boolean;
  onClick: () => void;
}) => (
  <Box
    height="24px"
    width="24px"
    round="5px"
    align="center"
    justify="center"
    style={{
      border: "1px solid #c4c4c4",
      cursor: "pointer",
    }}
    background="white"
    onClick={onClick}
  >
    {checked && <Check />}
  </Box>
);

const Order = () => (
  <svg
    width="7"
    height="14"
    viewBox="0 0 7 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      marginTop: "2px",
    }}
  >
    <path d="M3.5 0L6.53109 5.25H0.468911L3.5 0Z" fill="#5294FF" />
    <path d="M3.5 14L6.53109 8.75H0.468911L3.5 14Z" fill="#BDBDBD" />
  </svg>
);

const BoxBorderBottom = styled(Box)`
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: 0px;
    left: 11px;
    right: 10px;
    height: 1px;
    background: ${({ isDark }: { isDark: boolean }) =>
      isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(41, 52, 62, 0.3)"};
  }

  &:not(.noop):hover {
    height: 84px;
    cursor: pointer;
    /* height: 90px; */
    margin: -1px 0px -1px;
    /* background: #f2f2f2; */
    /* margin-top: -1px; */
    border-radius: 5px;

    &::after {
      content: none;
    }
  }
`;

const SelectedStakesMobile = ({
  transferSelected,
  scrapeOrEnd,
  removeSelected,
}: {
  transferSelected: () => void;
  scrapeOrEnd: () => void;
  removeSelected: () => void;
}) => {
  return (
    <Box
      direction="row"
      height="133px"
      background="#101E33"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 22,
        boxShadow: "0px -4px 4px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Box
        // align="center"
        pad={"16px 16px 19px"}
        width="100%"
        // justify="between"
      >
        <Box direction="row" align="center">
          <Text color="white" weight={500} size="16px">
            Selected 2 Stakes
          </Text>
          <Box
            margin={{
              left: "auto",
            }}
          ></Box>
          <Text
            color="#EB5757"
            size="14px"
            style={{
              cursor: "pointer",
            }}
            weight={500}
            onClick={removeSelected}
          >
            Remove selection
          </Text>
        </Box>
        <Box height="11px"></Box>
        <Box
          direction="row"
          round="5px"
          background="rgba(255, 255, 255, 0.1)"
          align="center"
          justify="center"
          pad="0px 20px"
          height="22px"
        >
          <Box round="50%" height="6px" width="6px" background="#219653"></Box>
          <Box width="5px"></Box>
          <Text size="12px" color="white">
            Completed: 1 Stake
          </Text>
          <Box width="40px"></Box>
          <Box round="50%" height="6px" width="6px" background="#F2994A"></Box>
          <Box width="5px"></Box>
          <Text size="12px" color="white">
            In Progress: 1 Stake
          </Text>
        </Box>
        <Box height="16px"></Box>
        <Box direction="row" justify="between">
          <HoveredElement
            render={binder => (
              <Box
                pad="9px 14px 8px"
                background={
                  binder.hovered
                    ? "linear-gradient(133.2deg, #BD29E9 0%, #782AFF 97.05%)"
                    : "linear-gradient(133.2deg, #782AFF 0%, #BD29E9 97.05%)"
                }
                round="5px"
                style={{
                  cursor: "pointer",
                }}
                align="center"
                onClick={transferSelected}
                {...binder.bind}
              >
                <Text size="14px" weight={500}>
                  Transfer Selected
                </Text>
              </Box>
            )}
          ></HoveredElement>
          <Box height="13px"></Box>
          <HoveredElement
            render={binder => (
              <Box
                pad="9px 14px 8px"
                background={
                  binder.hovered
                    ? "linear-gradient(133.2deg, #29E994 0%, #5294FF 97.05%)"
                    : "linear-gradient(133.2deg, #5294FF 0%, #29E994 97.05%)"
                }
                round="5px"
                style={{
                  cursor: "pointer",
                }}
                align="center"
                onClick={scrapeOrEnd}
                {...binder.bind}
              >
                <Text size="14px" weight={500}>
                  Scrape Or End Selected
                </Text>
              </Box>
            )}
          ></HoveredElement>
        </Box>
      </Box>
    </Box>
  );
};

const SelectedStakesTablet = ({
  transferSelected,
  scrapeOrEnd,
  removeSelected,
}: {
  transferSelected: () => void;
  scrapeOrEnd: () => void;
  removeSelected: () => void;
}) => {
  return (
    <Box
      direction="row"
      height="113px"
      background="#101E33"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 22,
        boxShadow: "0px -4px 4px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Box
        direction="row"
        align="center"
        pad={"0px 11px 0px 21px"}
        width="100%"
        justify="between"
      >
        <Box>
          <Box direction="row">
            <Text color="white" weight={500} size="16px">
              Selected 2 Stakes
            </Text>
            <Box width="20px"></Box>
            <Text
              color="#EB5757"
              size="14px"
              style={{
                cursor: "pointer",
              }}
              weight={500}
              onClick={removeSelected}
            >
              Remove selection
            </Text>
          </Box>
          <Box height="18px"></Box>
          <Box
            direction="row"
            round="5px"
            background="rgba(255, 255, 255, 0.1)"
            align="center"
            pad="0px 20px"
            height="36px"
          >
            <Box
              round="50%"
              height="12px"
              width="12px"
              background="#219653"
            ></Box>
            <Box width="5px"></Box>
            <Text size="12px" color="white">
              Completed: 1 Stake
            </Text>
            <Box width="50px"></Box>
            <Box
              round="50%"
              height="12px"
              width="12px"
              background="#F2994A"
            ></Box>
            <Box width="5px"></Box>
            <Text size="12px" color="white">
              In Progress: 1 Stake
            </Text>
          </Box>
        </Box>
        <Box>
          <HoveredElement
            render={binder => (
              <Box
                pad="9px 18px 8px"
                background={
                  binder.hovered
                    ? "linear-gradient(133.2deg, #BD29E9 0%, #782AFF 97.05%)"
                    : "linear-gradient(133.2deg, #782AFF 0%, #BD29E9 97.05%)"
                }
                round="5px"
                style={{
                  cursor: "pointer",
                }}
                align="center"
                onClick={transferSelected}
                {...binder.bind}
              >
                <Text size="14px" weight={500}>
                  Transfer Selected
                </Text>
              </Box>
            )}
          ></HoveredElement>
          <Box height="13px"></Box>
          <HoveredElement
            render={binder => (
              <Box
                pad="9px 18px 8px"
                background={
                  binder.hovered
                    ? "linear-gradient(133.2deg, #29E994 0%, #5294FF 97.05%)"
                    : "linear-gradient(133.2deg, #5294FF 0%, #29E994 97.05%)"
                }
                round="5px"
                style={{
                  cursor: "pointer",
                }}
                onClick={scrapeOrEnd}
                align="center"
                {...binder.bind}
              >
                <Text size="14px" weight={500}>
                  Scrape Or End Selected
                </Text>
              </Box>
            )}
          ></HoveredElement>
        </Box>
      </Box>
    </Box>
  );
};

const SelectedStakesDesktop = ({
  transferSelected,
  scrapeOrEnd,
  removeSelected,
}: {
  transferSelected: () => void;
  scrapeOrEnd: () => void;
  removeSelected: () => void;
}) => {
  return (
    <Box
      direction="row"
      height="80px"
      background="#101E33"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 22,
        boxShadow: "0px -4px 4px rgba(0, 0, 0, 0.15)",
      }}
      justify="center"
    >
      <Box
        width={"1065px"}
        direction="row"
        align="center"
        pad={"0px 11px 0px 21px"}
      >
        <Box>
          <Text color="white" weight={500} size="16px">
            Selected 2 Stakes
          </Text>
          <Box height="6px"></Box>
          <Text
            color="#EB5757"
            size="14px"
            style={{
              cursor: "pointer",
            }}
            weight={500}
            onClick={removeSelected}
          >
            Remove selection
          </Text>
        </Box>
        <Box width="104px"></Box>
        <Box
          direction="row"
          round="5px"
          background="rgba(255, 255, 255, 0.1)"
          align="center"
          pad="0px 20px"
          height="36px"
        >
          <Box
            round="50%"
            height="12px"
            width="12px"
            background="#219653"
          ></Box>
          <Box width="5px"></Box>
          <Text size="12px" color="white">
            Completed: 1 Stake
          </Text>
          <Box width="50px"></Box>
          <Box
            round="50%"
            height="12px"
            width="12px"
            background="#F2994A"
          ></Box>
          <Box width="5px"></Box>
          <Text size="12px" color="white">
            In Progress: 1 Stake
          </Text>
        </Box>
        <Box
          margin={{
            left: "auto",
          }}
        ></Box>
        <HoveredElement
          render={binder => (
            <Box
              pad="9px 18px 8px"
              background={
                binder.hovered
                  ? "linear-gradient(133.2deg, #BD29E9 0%, #782AFF 97.05%)"
                  : "linear-gradient(133.2deg, #782AFF 0%, #BD29E9 97.05%)"
              }
              round="5px"
              style={{
                cursor: "pointer",
              }}
              onClick={transferSelected}
              {...binder.bind}
            >
              <Text size="14px" weight={500}>
                Transfer Selected
              </Text>
            </Box>
          )}
        ></HoveredElement>
        <Box width="12px"></Box>
        <HoveredElement
          render={binder => (
            <Box
              pad="9px 18px 8px"
              background={
                binder.hovered
                  ? "linear-gradient(133.2deg, #29E994 0%, #5294FF 97.05%)"
                  : "linear-gradient(133.2deg, #5294FF 0%, #29E994 97.05%)"
              }
              round="5px"
              style={{
                cursor: "pointer",
              }}
              onClick={scrapeOrEnd}
              {...binder.bind}
            >
              <Text size="14px" weight={500}>
                Scrape Or End Selected
              </Text>
            </Box>
          )}
        ></HoveredElement>
      </Box>
    </Box>
  );
};

export const RootStaking = () => {
  // const {
  //   data: data1,
  //   loading: loading1,
  //   error: error1,
  // } = useStakesQueryQuery();
  // const stakes = data1?.stakes || [];

  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const isTablet = useMedia({
    maxWidth: "1023px",
  });

  const isMobile = useMedia({
    maxWidth: "600px",
  });

  const {
    showTransferStakesModal,
    createStakeModal,
    showScrapeOrEndStakesModal,
  } = useContext(ModalsContext);

  const transferSelected = () => showTransferStakesModal({});
  const scrapeOrEnd = () => showScrapeOrEndStakesModal();

  const [active, setActive] = useState([] as number[]);

  const removeSelected = () => setActive([]);

  return (
    <Box
      margin={"0 auto"}
      style={{
        minWidth: "1065px",
        width: "1065px",
      }}
      pad="65px 0px"
    >
      <Box direction="row">
        <Text size="30px">Staking</Text>
        <Box width="36px"></Box>
        <HoveredElement
          render={binder => (
            <Box
              height="36px"
              width="200px"
              align="center"
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
              onClick={createStakeModal}
              {...binder.bind}
            >
              <Text size="14px" weight={500} color="white">
                Create Regular stake
              </Text>
            </Box>
          )}
        ></HoveredElement>
        <Box width="10px"></Box>
        <Box
          height="36px"
          align="center"
          justify="center"
          round="5px"
          pad="0px 18px"
          style={{
            cursor: "pointer",
          }}
          background={"#5294FF"}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Text size="14px" weight={500} color="white">
            Change theme
          </Text>
        </Box>
      </Box>
      {active.length > 0 ? (
        isMobile ? (
          <SelectedStakesMobile
            transferSelected={transferSelected}
            scrapeOrEnd={scrapeOrEnd}
            removeSelected={removeSelected}
          ></SelectedStakesMobile>
        ) : isTablet ? (
          <SelectedStakesTablet
            transferSelected={transferSelected}
            scrapeOrEnd={scrapeOrEnd}
            removeSelected={removeSelected}
          />
        ) : (
          <SelectedStakesDesktop
            transferSelected={transferSelected}
            scrapeOrEnd={scrapeOrEnd}
            removeSelected={removeSelected}
          />
        )
      ) : (
        <></>
      )}
      <Box height="20px"></Box>
      <Box
        round="5px"
        className="bg-white dark:bg-transparent"
        pad="0px 10px 0px 11px"
      >
        <BoxBorderBottom
          height="70px"
          direction="row"
          width="100%"
          align="center"
          className="noop"
          isDark={isDark}
        >
          <Box width="10px"></Box>
          <CheckBox onClick={() => {}} />
          <Box width="27px"></Box>
          <Box width="146px" direction="row">
            <Text
              color="#5294FF"
              size="16px"
              weight={500}
              style={{
                cursor: "pointer",
              }}
              alignSelf="start"
            >
              Stake ID
            </Text>
            <Box width="5px"></Box>
            <Order />
          </Box>
          <Box width="181px">
            <Text
              size="16px"
              weight={500}
              style={{
                cursor: "pointer",
              }}
              alignSelf="start"
            >
              Start Date
            </Text>
          </Box>
          <Box width="168px">
            <Text
              size="16px"
              weight={500}
              style={{
                cursor: "pointer",
              }}
              alignSelf="start"
            >
              Stake End
            </Text>
          </Box>
          <Box width="190px">
            <Text
              size="16px"
              weight={500}
              style={{
                cursor: "pointer",
              }}
              alignSelf="start"
            >
              Progress
            </Text>
          </Box>
          <Box width="154px">
            <Text
              size="16px"
              weight={500}
              style={{
                cursor: "pointer",
              }}
              alignSelf="start"
            >
              Reward / APY
            </Text>
          </Box>
          <Box width="144px">
            <Text
              size="16px"
              weight={500}
              style={{
                cursor: "pointer",
              }}
              alignSelf="start"
            >
              Staked amount
            </Text>
          </Box>
        </BoxBorderBottom>
        {stakes.slice(0, 10).map(item => {
          return (
            <BoxBorderBottom
              height="83px"
              direction="row"
              width="100%"
              pad="20px 0px 23px"
              className="hover:bg-staking-item dark:hover:bg-staking-item"
              isDark={isDark}
            >
              {/* <Box
                style={{
                  position: "absolute",
                  bottom: "0px",
                  left: "11px",
                  right: "10px",
                  height: "1px",
                }}
                className="bg-staking-divider"
              ></Box> */}
              <Box width="10px"></Box>
              {[36, 37].includes(item.id) ? (
                <CheckBox
                  checked={active.includes(item.id)}
                  onClick={() => {
                    if (active.includes(item.id)) {
                      setActive(prev =>
                        prev.filter(item2 => item2 !== item.id),
                      );
                    } else {
                      setActive(prev => [...prev, item.id]);
                    }
                  }}
                />
              ) : (
                <Box height="24px" width="24px"></Box>
              )}
              <Box width="27px"></Box>
              <Box width="146px">
                <Text size="16px">12312451</Text>
              </Box>
              <Box width="181px">
                <Text size="16px">March 18, 2021</Text>
                <Box height="6px"></Box>
                <Text color="#A9A9A9" size="14px">
                  333 days ago
                </Text>
              </Box>
              <Box width="168px">
                <Text size="16px">April 20, 2021</Text>
                <Box height="6px"></Box>
                <Text color="#A9A9A9" size="14px">
                  2 days ago
                </Text>
              </Box>
              <Box width="190px">
                {item.id === 37 && (
                  <>
                    <Text color="#219653" size="16px">
                      100%
                    </Text>
                    <Box height="7px"></Box>
                    <Box
                      width="150px"
                      round="4px"
                      background="#219653"
                      height="15px"
                    ></Box>
                  </>
                )}
                {item.id === 36 && (
                  <>
                    <Text color="#F2994A" size="16px">
                      80%
                    </Text>
                    <Box height="7px"></Box>
                    <Box round="4px" background="#A9A9A9" width="150px">
                      <Box
                        width="80%"
                        round="4px"
                        background="#F2994A"
                        height="15px"
                      ></Box>
                    </Box>
                  </>
                )}

                {item.id < 36 && <Text size="16px">Closed</Text>}
              </Box>
              <Box width="154px">
                <Text size="16px">+ 0.05 DEFT</Text>
                <Box height="6px"></Box>
                <Text color="#A9A9A9" size="14px">
                  3.44% APY
                </Text>
              </Box>
              <Box width="144px">
                <Text size="16px">12,350.00 DEFT</Text>
              </Box>
            </BoxBorderBottom>
          );
        })}
        <Box height="30px"></Box>
        <Box
          direction="row"
          justify="between"
          pad={{
            left: "11px",
            right: "10px",
          }}
        >
          <Box width="145px">
            <Text size="16px" color="text">
              Show on page:
            </Text>
            <Box height="10px"></Box>
            <Box direction="row" justify="between">
              {[10, 25, 50, 100].map(item => (
                <Box>
                  <Text
                    size="16px"
                    style={
                      item === 10
                        ? {
                            // color: "#4F4F4F",
                            fontWeight: 500,
                            cursor: "pointer",
                          }
                        : {
                            color: "#2F80ED",
                            cursor: "pointer",
                          }
                    }
                  >
                    {item}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
          <Box
            width="200px"
            height="36px"
            round="5px"
            align="center"
            justify="center"
            background="#E5E7EB"
            style={
              isDark
                ? {
                    background: "#101E33",
                    color: "#5294FF",
                    fontWeight: 500,
                    cursor: "pointer",
                  }
                : {
                    border: "2px solid #9CA3AF",
                    cursor: "pointer",
                  }
            }
          >
            <Text color="29343E" size="14px" weight={500}>
              Show more
            </Text>
          </Box>
          <Box width="145px"></Box>
        </Box>
        <Box height="2px"></Box>
        <Box width="100%" align="center">
          <Box direction="row" align="center">
            <Box
              margin={{ right: "5px" }}
              style={{
                cursor: "pointer",
              }}
            >
              <ArrowLeft />
            </Box>
            <Box
              height="50px"
              width="50px"
              align="center"
              justify="center"
              round="5px"
              margin={{
                right: "10px",
              }}
              style={{
                cursor: "pointer",
                background: isDark ? "transparent" : "#F2F2F2",
                border: isDark ? "2px solid #707070" : "",
              }}
            >
              <Text size="14px" color="#9CA3AF">
                1
              </Text>
            </Box>
            <Box
              margin={{ right: "10px" }}
              width="24px"
              height="1px"
              background="#9CA3AF"
            ></Box>
            <Box
              height="50px"
              width="50px"
              align="center"
              justify="center"
              round="5px"
              background="#F2F2F2"
              margin={{
                right: "10px",
              }}
              style={{
                cursor: "pointer",
                background: isDark ? "transparent" : "#F2F2F2",
                border: isDark ? "2px solid #707070" : "",
              }}
            >
              <Text size="14px" color="#9CA3AF">
                55
              </Text>
            </Box>
            <Box
              height="50px"
              width="50px"
              align="center"
              justify="center"
              round="5px"
              background="#F2F2F2"
              margin={{
                right: "10px",
              }}
              style={{
                cursor: "pointer",
                background: isDark ? "transparent" : "#F2F2F2",
                border: isDark ? "2px solid #707070" : "",
              }}
            >
              <Text size="14px" color="#9CA3AF">
                56
              </Text>
            </Box>
            <Box
              height="50px"
              width="50px"
              align="center"
              justify="center"
              round="5px"
              background="#F2F2F2"
              margin={{
                right: "10px",
              }}
              style={
                isDark
                  ? {
                      background: "#101E33",
                      color: "#5294FF",
                      fontWeight: 500,
                      cursor: "pointer",
                    }
                  : {
                      border: "2px solid #9CA3AF",
                      cursor: "pointer",
                    }
              }
            >
              <Text size="14px" weight={500}>
                57
              </Text>
            </Box>
            <Box
              height="50px"
              width="50px"
              align="center"
              justify="center"
              round="5px"
              background="#F2F2F2"
              margin={{
                right: "10px",
              }}
              style={{
                cursor: "pointer",
                background: isDark ? "transparent" : "#F2F2F2",
                border: isDark ? "2px solid #707070" : "",
              }}
            >
              <Text size="14px" color="#9CA3AF">
                58
              </Text>
            </Box>
            <Box
              height="50px"
              width="50px"
              align="center"
              justify="center"
              round="5px"
              background="#F2F2F2"
              margin={{
                right: "10px",
              }}
              style={{
                cursor: "pointer",
                background: isDark ? "transparent" : "#F2F2F2",
                border: isDark ? "2px solid #707070" : "",
              }}
            >
              <Text size="14px" color="#9CA3AF">
                59
              </Text>
            </Box>
            <Box
              margin={{ right: "10px" }}
              width="24px"
              height="1px"
              background="#9CA3AF"
            ></Box>
            <Box
              height="50px"
              width="50px"
              align="center"
              justify="center"
              round="5px"
              background="#F2F2F2"
              style={{
                cursor: "pointer",
                background: isDark ? "transparent" : "#F2F2F2",
                border: isDark ? "2px solid #707070" : "",
              }}
            >
              <Text size="14px" color="#9CA3AF">
                356
              </Text>
            </Box>
            <Box
              margin={{ left: "5px" }}
              style={{
                transform: "rotate(180deg)",

                cursor: "pointer",
              }}
            >
              <ArrowLeft />
            </Box>
          </Box>
          <Box height="50px"></Box>
        </Box>
      </Box>
    </Box>
  );
};
