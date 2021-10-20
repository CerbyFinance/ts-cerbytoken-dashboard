import { Box, Text } from "grommet";
import React from "react";
import { HoveredElement } from "./shared/hooks";

export const SelectedStakesMobile = ({
  transferSelected,
  scrapeOrEnd,
  removeSelected,
  completedCount,
  inProgressCount,
}: {
  completedCount: number;
  inProgressCount: number;
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
            Selected {completedCount + inProgressCount} Stakes
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
            Completed: {completedCount} Stakes
          </Text>
          <Box width="40px"></Box>
          <Box round="50%" height="6px" width="6px" background="#F2994A"></Box>
          <Box width="5px"></Box>
          <Text size="12px" color="white">
            In Progress: {inProgressCount} Stakes
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

export const SelectedStakesTablet = ({
  transferSelected,
  scrapeOrEnd,
  removeSelected,
  completedCount,
  inProgressCount,
}: {
  completedCount: number;
  inProgressCount: number;
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
              Selected {completedCount + inProgressCount} Stakes
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
              Completed: {completedCount} Stakes
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
              In Progress: {inProgressCount} Stakes
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

export const SelectedStakesDesktop = ({
  completedCount,
  inProgressCount,
  transferSelected,
  scrapeOrEnd,
  removeSelected,
}: {
  completedCount: number;
  inProgressCount: number;
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
            Selected {completedCount + inProgressCount} Stakes
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
            Completed: {completedCount} Stakes
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
            In Progress: {inProgressCount} Stakes
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
