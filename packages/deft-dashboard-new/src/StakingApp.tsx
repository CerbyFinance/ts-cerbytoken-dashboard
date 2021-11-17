import { useApolloClient } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { Box, Text } from "grommet";
import mergeWith from "lodash.mergewith";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import useMedia from "use-media";
import { Chains } from "./chains";
import {
  StakesDocument,
  StakesQuery,
  StakesQueryVariables,
  useStakesQuery,
} from "./graphql/types";
import LinkIcon from "./icons/LinkIcon";
import {
  SelectedStakesDesktop,
  SelectedStakesMobile,
  SelectedStakesTablet,
} from "./SelectedStakes";
// import { stakingClient } from "./shared/client";
import { HoveredElement } from "./shared/hooks";
import { ModalsContext } from "./shared/modals";
import { makePages } from "./shared/shared";
import { SnapshotsInterest } from "./shared/snaphots-interest";
import { ThemeContext } from "./shared/theme";
import { getEtherscanLink } from "./shared/utils";
import {
  DAYS_IN_ONE_YEAR,
  deftShortCurrency,
  getCurrentDay,
  getInterestByStake,
  getPenaltyByStake,
  getSharesCountByStake,
  START_DATE,
} from "./staking-system";

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

// -----------

type OrderBy =
  | "stakedId"
  | "stakedAt"
  | "stakeEnd"
  // | "lockUp"
  | "progress"
  | "reward"
  | "staked";

type StakeOfList = StakesQuery["stakes"][number];

// const currentBlock = 27601054
// const launchBlock = 27272211

function _daysDiff(_startDate: number, _endDate: number) {
  return _startDate > _endDate ? 0 : _endDate - _startDate;
}

export function _daysLeft(finalDay: number) {
  return _daysDiff(getCurrentDay(), finalDay);
}

dayjs.extend(utc);

function getRelativeDate(e: number, a: number) {
  return dayjs
    .utc(new Date(new Date(a).setDate(new Date(a).getDate() + e)))
    .format("MMM D, YYYY");
}

const WithOrder = ({
  title,
  active,
  direction,
  onClick,
}: {
  title: string;
  active: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
}) => {
  return (
    <Box direction="row" onClick={onClick}>
      <Text
        color={active ? "#5294FF" : undefined}
        size="16px"
        weight={500}
        style={{
          cursor: "pointer",
          userSelect: "none",
        }}
        alignSelf="start"
      >
        {title}
      </Text>
      <Box width="5px"></Box>
      {active && (
        <Box
          style={
            direction === "asc"
              ? {
                  transform: "rotate(180deg)",
                }
              : {}
          }
        >
          <Order />
        </Box>
      )}
    </Box>
  );
};

const activeTemplate = {
  count: 0,
  staked: 0,
  interest: 0,
  apy: 0,
  apy2: 0,
  tShares: 0,
  payout: 0,
  penalty: 0,
  ids: [],
};

export const StakeList = ({
  items,
}: // inflations,
{
  items: StakesQuery["stakes"];
  // inflations: number[];
}) => {
  const { chainId } = useWeb3React();

  const { theme, setTheme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  const isTablet = useMedia({
    maxWidth: "1023px",
  });

  const isMobile = useMedia({
    maxWidth: "600px",
  });

  const { cachedInterestPerShare, dailySnapshots } =
    useContext(SnapshotsInterest);

  const [maxRows, setMaxRows] = useState(10);
  const [page, setPage] = useState(1);
  const handleSetNextPage = () => {
    const nextPage = page + 1;
    if (nextPage <= pagesCount) {
      setPage(nextPage);
    }
  };

  const handleSetPrevPage = () => {
    const prevPage = page - 1;
    if (prevPage >= 1) {
      setPage(prevPage);
    }
  };

  const {
    showTransferStakesModal,
    createStakeModal,
    showScrapeOrEndStakesModal,
  } = useContext(ModalsContext);

  const allAllowedIds = items
    .filter(item => item.endDay === 0)
    .map(item => item.id);

  const [active, setActive] = useState([] as string[]);

  const setActiveAll = () => {
    if (active.length === allAllowedIds.length) {
      setActive([]);
    } else {
      setActive(allAllowedIds);
    }
  };

  const removeSelected = () => setActive([]);

  const { closeModal } = useContext(ModalsContext);

  const scrapeOrEnd = () =>
    showScrapeOrEndStakesModal({
      completed,
      inProgress,
      successCb: () => {
        removeSelected();
        closeModal();
      },
    });

  const activeItems = items.filter(item => active.includes(item.id));
  const [completedCount, inProgressCount] = items.reduce(
    ([a, b], item) => {
      const isCompleted = getCurrentDay() >= item.startDay + item.lockDays;

      if (isCompleted) {
        return [a + 1, b];
      }

      return [a, b + 1];
    },
    [0, 0],
  );
  const totalStaked = activeItems.reduce(
    (acc, item) => acc + item.stakedAmount,
    0,
  );

  const [completed, inProgress] = activeItems.reduce(
    ([completed, inProgress], item) => {
      const isCompleted = getCurrentDay() >= item.startDay + item.lockDays;

      const startDay = item.startDay;

      const stake = {
        lockedForXDays: item.lockDays,
        stakedAmount: Number(item.stakedAmount),
        startDay,
        sharesCount: item.sharesCount,
      };

      // TODO: lift
      const interest = item.interest;

      const penalty = getPenaltyByStake(stake, getCurrentDay(), item.interest);

      const shareA = item.sharesCount;
      const shareB = getSharesCountByStake(
        dailySnapshots,
        {
          lockedForXDays: getCurrentDay() - item.startDay,
          startDay: item.startDay,
          stakedAmount: Number(item.stakedAmount),
        },
        0,
      );

      const decreaseShares = shareB - shareA;

      let numDaysServed = dailySnapshots.length - item.startDay;
      if (numDaysServed > item.lockDays) {
        numDaysServed = item.lockDays;
      }

      let apy = 0;
      if (numDaysServed > 0 && getCurrentDay() > item.startDay) {
        apy =
          (((interest - penalty) * DAYS_IN_ONE_YEAR) /
            (item.stakedAmount * numDaysServed)) *
          100;
      }

      let apy2 = 0;
      if (numDaysServed > 0 && getCurrentDay() > item.startDay) {
        apy2 =
          ((interest * DAYS_IN_ONE_YEAR) /
            (item.stakedAmount * numDaysServed)) *
          100;
      }

      const divApyWith = isCompleted ? completedCount : inProgressCount;

      const addWith = {
        count: 1,
        staked: item.stakedAmount,
        interest: interest,
        apy: apy / divApyWith,
        apy2: apy2 / divApyWith,
        tShares: decreaseShares,
        payout: item.stakedAmount + interest - penalty,
        penalty,
        ids: [Number(item.id)],
      };

      const merged = mergeWith(
        isCompleted ? completed : inProgress,
        addWith,
        (a, b) => (Array.isArray(a) ? [...a, ...b] : a + b),
      );

      if (isCompleted) {
        return [merged, inProgress];
      }

      return [completed, merged];
    },

    [{ ...activeTemplate }, { ...activeTemplate }],
  );

  const transferSelected = () =>
    showTransferStakesModal({
      completedCount: completed.count,
      inProgressCount: inProgress.count,
      stakeIds: active.map(item => Number(item)),
      totalStaked,
      successCb: () => {
        removeSelected();
        closeModal();
      },
    });

  const [order, setOrder] = useState({
    orderBy: "stakedAt" as OrderBy,
    direction: "desc" as "desc" | "asc",
  });

  const handleSetOrder = (newOrderBy: OrderBy) => {
    if (newOrderBy !== order.orderBy) {
      setOrder({
        orderBy: newOrderBy,
        direction: "desc",
      });
    } else {
      setOrder({
        orderBy: order.orderBy,
        direction: order.direction === "asc" ? "desc" : "asc",
      });
    }
  };

  const sorts = {
    stakedId: (a, b) => {
      [a, b] = order.direction === "desc" ? [b, a] : [a, b];
      return Number(a.id) - Number(b.id);
    },
    stakedAt: (a, b) => {
      [a, b] = order.direction === "desc" ? [b, a] : [a, b];

      return a.startedAt! - b.startedAt!;
    },
    stakeEnd: (a, b) => {
      [a, b] = order.direction === "desc" ? [b, a] : [a, b];

      // return a.endDay - b.endDay;
      const endDayLeft = a.endDay > 0 ? a.endDay : a.startDay + a.lockDays;
      const endDayRight = b.endDay > 0 ? b.endDay : b.startDay + b.lockDays;

      return endDayLeft - endDayRight;
    },

    progress: (a, b) => {
      [a, b] = order.direction === "desc" ? [b, a] : [a, b];

      // TODO: handle if ended earlier
      const daysLeftLeft = _daysLeft(a.startDay + a.lockDays);
      const daysLeftRight = _daysLeft(b.startDay + b.lockDays);

      const progressRateLeft = Math.max(
        0,
        100 - (daysLeftLeft * 100) / a.lockDays,
      );

      const progressRateRight = Math.max(
        0,
        100 - (daysLeftRight * 100) / b.lockDays,
      );

      if (a.endDay > 0 || b.endDay > 0) {
        return order.direction === "desc" ? 0 : -1;
      }

      return progressRateLeft - progressRateRight;
    },
    reward: (a, b) => {
      [a, b] = order.direction === "desc" ? [b, a] : [a, b];

      return a.interest - b.interest;
    },
    staked: (a, b) => {
      [a, b] = order.direction === "desc" ? [b, a] : [a, b];

      return a.stakedAmount - b.stakedAmount;
    },
  } as {
    [key in OrderBy]: (a: StakeOfList, b: StakeOfList) => number;
  };

  const sort = sorts[order.orderBy];
  const itemsCount = items.length;

  const [sliceFrom, sliceTo] = [maxRows * (page - 1), maxRows * page];

  const itemsSorted = items.slice().sort(sort).slice(sliceFrom, sliceTo);
  const pagesCount = Math.ceil(itemsCount / maxRows);

  return (
    <Box
      margin={"0 auto"}
      style={{
        minWidth: "1065px",
        width: "1065px",
      }}
      pad="20px 0px"
      // pad="65px 0px"
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
                ...(chainId === 56 || chainId === 137
                  ? {}
                  : {
                      pointerEvents: "none",
                      opacity: 0.5,
                    }),
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
        <Box width="16px"></Box>
        <HoveredElement
          render={binder => (
            <Box
              height="36px"
              width="100px"
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
              onClick={() => {
                let link = "";

                if (chainId === 1) {
                  link =
                    "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xdef1fac7bf08f173d286bbbdcbeeade695129840";
                } else if (chainId === 56) {
                  link =
                    "https://pancakeswap.finance/swap?inputCurrency=BNB&outputCurrency=0xdef1fac7bf08f173d286bbbdcbeeade695129840";
                } else if (chainId === 137) {
                  link =
                    "https://quickswap.exchange/#/swap?inputCurrency=Matic&outputCurrency=0xdef1fac7Bf08f173D286BbBDcBeeADe695129840";
                }

                window.open(link);
              }}
              {...binder.bind}
            >
              <Text size="14px" weight={500} color="white">
                Buy Cerby
              </Text>
            </Box>
          )}
        ></HoveredElement>
        {/* <Box width="10px"></Box> */}
        {/* <Box
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
        </Box> */}
      </Box>
      {active.length > 0 ? (
        isMobile ? (
          <SelectedStakesMobile
            completedCount={completed.count}
            inProgressCount={inProgress.count}
            transferSelected={transferSelected}
            scrapeOrEnd={scrapeOrEnd}
            removeSelected={removeSelected}
          ></SelectedStakesMobile>
        ) : isTablet ? (
          <SelectedStakesTablet
            completedCount={completed.count}
            inProgressCount={inProgress.count}
            transferSelected={transferSelected}
            scrapeOrEnd={scrapeOrEnd}
            removeSelected={removeSelected}
          />
        ) : (
          <SelectedStakesDesktop
            completedCount={completed.count}
            inProgressCount={inProgress.count}
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
          <CheckBox
            checked={active.length === allAllowedIds.length}
            onClick={() => setActiveAll()}
          />
          <Box width="27px"></Box>
          <Box width="146px">
            <WithOrder
              active={order.orderBy === "stakedId"}
              direction={order.direction}
              title="Stake ID"
              onClick={() => {
                handleSetOrder("stakedId");
              }}
            />
          </Box>
          <Box width="181px">
            <WithOrder
              active={order.orderBy === "stakedAt"}
              direction={order.direction}
              title="Start Date"
              onClick={() => {
                handleSetOrder("stakedAt");
              }}
            />
          </Box>
          <Box width="168px">
            <WithOrder
              active={order.orderBy === "stakeEnd"}
              direction={order.direction}
              title="Stake Ends"
              onClick={() => {
                handleSetOrder("stakeEnd");
              }}
            />
          </Box>
          <Box width="190px">
            <WithOrder
              active={order.orderBy === "progress"}
              direction={order.direction}
              title="Progress"
              onClick={() => {
                handleSetOrder("progress");
              }}
            />
          </Box>
          <Box width="154px">
            <WithOrder
              active={order.orderBy === "reward"}
              direction={order.direction}
              title="Reward / APY"
              onClick={() => {
                handleSetOrder("reward");
              }}
            />
          </Box>
          <Box width="144px">
            <WithOrder
              active={order.orderBy === "staked"}
              direction={order.direction}
              title="Staked amount"
              onClick={() => {
                handleSetOrder("staked");
              }}
            />
          </Box>
        </BoxBorderBottom>
        {itemsSorted.map(item => {
          const startDay = item.startDay;
          const finalDay = item.startDay + item.lockDays;
          const lockDays = item.lockDays;
          const endDay = item.endDay;

          const daysLeft = _daysLeft(finalDay);
          const progress = Math.max(0, 100 - (daysLeft * 100) / lockDays);

          const startDayDate = getRelativeDate(startDay, START_DATE * 1000);
          const stakeCreatedAgo = getCurrentDay() - startDay;

          // const endDayDate = getRelativeDate(endDay, START_DATE * 1000)
          // const endDayAgo = startDay - endDay

          const endsDayDate =
            endDay > 0
              ? getRelativeDate(endDay, START_DATE * 1000)
              : getRelativeDate(finalDay, START_DATE * 1000);

          const endsDayAgo = daysLeft === 0 ? getCurrentDay() - finalDay : 0;
          const endDayAgo = endDay > 0 ? getCurrentDay() - endDay : endsDayAgo;

          // const endsIn = "";
          const interestComputed = item.interest;
          const interest = deftShortCurrency(interestComputed);
          const stakedAmount = deftShortCurrency(item.stakedAmount);

          const sharesCount = deftShortCurrency(item.sharesCount, "Shares");

          let numDaysServed = dailySnapshots.length - item.startDay;
          if (numDaysServed > item.lockDays) {
            numDaysServed = item.lockDays;
          }

          let apy = 0;
          if (numDaysServed > 0 && getCurrentDay() > item.startDay) {
            apy =
              ((interestComputed * DAYS_IN_ONE_YEAR) /
                (item.stakedAmount * numDaysServed)) *
              100;
          }

          return (
            <BoxBorderBottom
              height="83px"
              direction="row"
              width="100%"
              pad="20px 0px 23px"
              className="hover:bg-staking-item dark:hover:bg-staking-item"
              isDark={isDark}
            >
              <Box width="10px"></Box>
              {endDay === 0 ? (
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
              <Box width="146px" direction="row">
                <Text size="16px">{item.id}</Text>
                <Box
                  height="18px"
                  margin={{
                    left: "8px",
                  }}
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const tx: string = item.endTx ? item.endTx : item.startTx;
                    const link = getEtherscanLink(chainId as Chains, tx, "tx");
                    window.open(link);
                  }}
                >
                  <LinkIcon />
                </Box>
              </Box>
              <Box width="181px">
                <Text size="16px">{startDayDate}</Text>
                <Box height="6px"></Box>
                <Text color="#A9A9A9" size="14px">
                  {stakeCreatedAgo} days ago
                </Text>
              </Box>
              <Box width="168px">
                <Text size="16px">{endsDayDate}</Text>
                <Box height="6px"></Box>
                <Text color="#A9A9A9" size="14px">
                  {endDayAgo > 0
                    ? `${endDayAgo} days ago`
                    : `in ${daysLeft} days`}
                </Text>
              </Box>
              <Box width="190px">
                {endDay === 0 && (
                  <>
                    <Text
                      color={progress === 100 ? "#219653" : "#F2994A"}
                      size="16px"
                    >
                      {Math.floor(progress)}%
                    </Text>
                    <Box height="7px"></Box>
                    <Box round="4px" background="#A9A9A9" width="150px">
                      <Box
                        width={progress + "%"}
                        round="4px"
                        background={progress === 100 ? "#219653" : "#F2994A"}
                        height="15px"
                      ></Box>
                    </Box>
                  </>
                )}
                {endDay > 0 && (
                  <>
                    <Text size="16px">Closed</Text>
                  </>
                )}
              </Box>
              <Box width="154px">
                <Text size="16px">+ {interest}</Text>
                <Box height="6px"></Box>
                <Text color="#A9A9A9" size="14px">
                  {apy.asCurrency(2)}% APY
                </Text>
              </Box>
              <Box width="144px">
                <Text size="16px">{stakedAmount}</Text>
                <Box height="6px"></Box>
                <Text color="#A9A9A9" size="14px">
                  {sharesCount}
                </Text>
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
                    onClick={() => setMaxRows(item)}
                    style={
                      item === maxRows
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
          <Box width="100%" align="center">
            <Box direction="row" align="center">
              <Box
                margin={{ right: "5px" }}
                style={{
                  cursor: "pointer",
                }}
                onClick={handleSetPrevPage}
              >
                <ArrowLeft />
              </Box>
              {makePages(pagesCount, page).map((item, i, __items) => {
                const isEllips =
                  item === "end-ellipsis" || item === "start-ellipsis";

                const isActive = item === page;

                if (isEllips) {
                  return (
                    <Box
                      margin={{ right: "10px" }}
                      width="24px"
                      height="1px"
                      background="#9CA3AF"
                    ></Box>
                  );
                }

                return (
                  <Box
                    height="50px"
                    width="50px"
                    align="center"
                    justify="center"
                    round="5px"
                    margin={
                      i === __items.length - 1
                        ? {}
                        : {
                            right: "10px",
                          }
                    }
                    style={{
                      cursor: "pointer",
                      ...(isActive
                        ? {
                            ...(isDark
                              ? {
                                  background: "#101E33",
                                  color: "#5294FF",
                                  fontWeight: 500,
                                }
                              : {
                                  border: "2px solid #9CA3AF",
                                }),
                          }
                        : {
                            background: isDark ? "transparent" : "#F2F2F2",
                            border: isDark ? "2px solid #707070" : "",
                          }),
                    }}
                    onClick={() => setPage(item as number)}
                  >
                    <Text size="14px" color="#9CA3AF">
                      {item}
                    </Text>
                  </Box>
                );
              })}

              <Box
                margin={{ left: "5px" }}
                style={{
                  transform: "rotate(180deg)",
                  cursor: "pointer",
                }}
                onClick={handleSetNextPage}
              >
                <ArrowLeft />
              </Box>
            </Box>
            <Box height="50px"></Box>
          </Box>
          <Box width="145px"></Box>
        </Box>
        <Box height="2px"></Box>
      </Box>
    </Box>
  );
};

export const RootStaking = () => {
  const { account, chainId } = useWeb3React();

  const {
    data: data1,
    loading: loading1,
    error: error1,
  } = useStakesQuery({
    variables: {
      address: account?.toLowerCase() || "",
    },
    fetchPolicy: "cache-and-network",
    skip: !account,
  });

  const items = data1?.stakes || [];

  // const [interests, setInterests] = useState([] as number[]);

  const stakingClient = useApolloClient();

  useEffect(() => {
    const timer = setInterval(async () => {
      const resultQuery = await stakingClient
        .query<StakesQuery, StakesQueryVariables>({
          query: StakesDocument,
          variables: {
            address: account?.toLowerCase() || "",
          },
          fetchPolicy: "network-only",
        })
        .catch(e => null);
    }, 20000);

    return () => clearInterval(timer);
  }, [account, chainId]);

  const { cachedInterestPerShare, dailySnapshots } =
    useContext(SnapshotsInterest);

  const itemsWithInterest = items.map((item, i) => {
    const interest = item.interest
      ? item.interest
      : getInterestByStake(
          dailySnapshots,
          cachedInterestPerShare,
          {
            lockedForXDays: item.lockDays,
            stakedAmount: item.stakedAmount,
            startDay: item.startDay,
          },
          getCurrentDay(),
        );

    return { ...item, interest };
  });

  return <StakeList items={itemsWithInterest} />;
};
