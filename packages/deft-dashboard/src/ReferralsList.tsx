import { useWeb3React } from "@web3-react/core";
import dayjs from "dayjs";
import { serializeError } from "eth-rpc-errors";
import { Box, BoxProps, Text } from "grommet";
import React, { CSSProperties, useState } from "react";
import styled from "styled-components";
import { CheckBox } from "./CheckBox";
import { readableErrors } from "./contractErrors";
import { HoveredElement } from "./shared/hooks";
import { useDeftContract } from "./shared/useContract";
import { txnToast } from "./toaster";

type Reeeee = {
  id: string;
  lvl: 1 | 2;
  createdAt: number;
  referralsCount: number;
  reward: number | undefined;
  referrer: {
    id: string | undefined;
    referralsCount: number | undefined;
  };
};

const ChevronRight = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5.33398 4.22894L6.27679 3.28613L10.9908 8.00018L6.27679 12.7142L5.33398 11.7714L9.10522 8.00018L5.33398 4.22894Z"
      fill="black"
    />
  </svg>
);

const lvlListStyles = {
  1: {
    color: "#2AB930",
    bg: "#E2F8E3",
  },

  2: {
    color: "#1672EC",
    bg: "#E8F1FD",
  },
};

const Sort = () => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 8.35693C6 7.80465 6.44772 7.35693 7 7.35693H17C17.5523 7.35693 18 7.80465 18 8.35693C18 8.90922 17.5523 9.35693 17 9.35693H7C6.44772 9.35693 6 8.90922 6 8.35693Z"
      fill="black"
    />
    <path
      d="M8 12.3569C8 11.8046 8.44772 11.3569 9 11.3569H15C15.5523 11.3569 16 11.8046 16 12.3569C16 12.9092 15.5523 13.3569 15 13.3569H9C8.44772 13.3569 8 12.9092 8 12.3569Z"
      fill="black"
    />
    <path
      d="M11 15.3569C10.4477 15.3569 10 15.8046 10 16.3569C10 16.9092 10.4477 17.3569 11 17.3569H13C13.5523 17.3569 14 16.9092 14 16.3569C14 15.8046 13.5523 15.3569 13 15.3569H11Z"
      fill="black"
    />
  </svg>
);

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => start + i);
};

export const makePages = (count: number, page: number) => {
  const boundaryCount = 1;

  const siblingCount = 1;

  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count,
  );

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );

  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  );

  const itemList = [
    ...startPages,

    // Start ellipsis
    ...(siblingsStart > boundaryCount + 2
      ? ["start-ellipsis"]
      : boundaryCount + 1 < count - boundaryCount
      ? [boundaryCount + 1]
      : []),

    // Sibling pages
    ...range(siblingsStart, siblingsEnd),

    // End ellipsis
    ...(siblingsEnd < count - boundaryCount - 1
      ? ["end-ellipsis"]
      : count - boundaryCount > boundaryCount
      ? [count - boundaryCount]
      : []),

    ...endPages,
  ];

  return itemList as ("start-ellipsis" | "end-ellipsis" | number)[];
};

const ColumnWithOrder = ({
  title,
  active,
  direction,
  end,
}: {
  title: string;
  active: boolean;
  direction: "asc" | "desc";
  end?: boolean;
}) => {
  const Icon = (
    <Box
      style={
        direction === "asc"
          ? {
              transform: "rotate(180deg)",
            }
          : {}
      }
      margin={{
        right: "2px",
      }}
    >
      <Sort />
    </Box>
  );
  return (
    <React.Fragment>
      <Box
        direction="row"
        align="center"
        width="100%"
        justify={end ? "end" : "start"}
      >
        {active && end && Icon}
        <Text weight={800} size="13px">
          {title}
        </Text>
        {active && !end && Icon}
      </Box>
      {active && (
        <Box
          width="100%"
          style={{
            position: "absolute",
            left: 0,
            bottom: -2,

            boxShadow:
              "0px 1px 2px rgba(15, 86, 179, 0.2), 0px 2px 4px rgba(15, 86, 179, 0.2)",
          }}
          height={"2px"}
          background="#1672EC"
        ></Box>
      )}
    </React.Fragment>
  );
};

const HoveredBox = styled(Box)`
  &:hover {
    background: ${(props: { hoverColor: string }) => props.hoverColor};
  }
`;

type OrderBy =
  | "referralsCount"
  | "referrerReferralsCount"
  | "lvl"
  | "createdAt"
  | "reward";

const noop = () => {};

const Row = ({
  items,
}: {
  items: {
    content: JSX.Element | null;
    width: string;
    isTitle?: boolean;
    align?: BoxProps["align"];
    style?: CSSProperties;
    onClick?: () => void;
  }[];
}) => {
  return (
    <Box direction="row" align="center" height="48px" width="100%">
      {items.map(item => (
        <Box
          onClick={item.onClick || noop}
          width={item.width}
          height="100%"
          justify="center"
          style={{
            cursor: "pointer",
            userSelect: "none",
            position: "relative",
            borderBottom: item.isTitle
              ? "2px solid #E0E0E0"
              : "1px solid #E0E0E0",
            ...item.style,
          }}
          pad={{
            horizontal: "10px",
          }}
          {...(item.align
            ? {
                align: item.align,
              }
            : {})}
        >
          {item.content}
        </Box>
      ))}
    </Box>
  );
};

export const ReferralsList = ({
  items,
  zeroAmounts,
}: {
  items: Reeeee[];
  zeroAmounts: (walletsToZero: string[], account: string) => Promise<void>;
}) => {
  const { account } = useWeb3React();

  const maxRows = 10;

  const [order, setOrder] = useState({
    orderBy: "reward" as OrderBy,
    direction: "desc" as "desc" | "asc",
  });

  const [page, setPage] = useState(1);

  const [activeSum, setActiveSum] = useState(0);
  const [activeRows, setActiveRows] = useState<string[]>([]);
  const [loader, setLoader] = useState(false);

  const deftContract = useDeftContract();

  const collectRewards = async (referrals: string[], account: string) => {
    try {
      setLoader(true);
      const result = await deftContract.claimReferrerRewards(referrals);

      txnToast(1, "pending", "Transaction Sent", result.hash);

      const result2 = await result.wait();

      // todo: maybe just  update it locally ?
      // todo: refetch just those who collected

      await zeroAmounts(referrals, account);
      // todo: can just compute them from rewards
      setActiveRows([]);
      setActiveSum(0);

      // await nobotsClient.query({
      //   query: UserReferrals2lvlDocument,
      //   variables: {
      //     address: account.toLowerCase(),
      //   },
      //   fetchPolicy: "network-only",
      // });

      setLoader(false);

      if (result2.status === 1) {
        txnToast(
          1,
          "success",
          "Transaction Successful",
          result2.transactionHash,
        );
      } else {
        txnToast(1, "fail", "Transaction Canceled", result2.transactionHash);
      }

      console.log(result2.status); // 1 = 0k, 0 = failure
    } catch (error) {
      setLoader(false);

      const serializedError = serializeError(error);
      const originalErrorMessage = (serializedError.data as any)?.originalError
        ?.error?.message;

      if (originalErrorMessage && originalErrorMessage.includes("!")) {
        const message = originalErrorMessage.split("!")[1];

        // @ts-ignore
        const readableError = readableErrors[message] || "Unknown error";
        txnToast(1, "error", "Transaction Error", undefined, readableError);
      } else {
        txnToast(1, "fail", "Transaction Canceled");
      }
    }
  };

  const selectedAll = activeRows.length === items.length;

  const handleSetActiveAll = () => {
    if (selectedAll) {
      setActiveRows([]);
      setActiveSum(0);
    } else {
      setActiveRows(items.map(item => item.id));
      const activeSum = items.reduce(
        (acc, item) => acc + (item.reward || 0),
        0,
      );
      setActiveSum(activeSum);
    }
  };

  const handleSetActiveRow = (rowId: string) => {
    const included = activeRows.includes(rowId);
    const item = items.find(item => item.id === rowId)!;
    if (!included) {
      setActiveRows(prev => [...prev, rowId]);
      setActiveSum(prev => prev + (item.reward || 0));
    } else {
      setActiveRows(prev => prev.filter(item => item !== rowId));
      setActiveSum(prev => prev - (item.reward || 0));
    }
  };

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
    referralsCount: (a, b) => {
      [a, b] = order.direction === "desc" ? [b, a] : [a, b];

      return a.referralsCount - b.referralsCount;
    },
    referrerReferralsCount: (a, b) => {
      [a, b] = order.direction === "desc" ? [b, a] : [a, b];

      return (
        (a.referrer?.referralsCount || 0) - (b.referrer?.referralsCount || 0)
      );
    },
    createdAt: (a, b) => {
      [a, b] = order.direction === "desc" ? [b, a] : [a, b];

      return a.createdAt - b.createdAt;
    },
    lvl: (a, b) => {
      [a, b] = order.direction === "desc" ? [b, a] : [a, b];

      return a.lvl - b.lvl;
    },
    reward: (a, b) => {
      [a, b] = order.direction === "desc" ? [b, a] : [a, b];

      return (a.reward || 0) - (b.reward || 0);
    },
  } as {
    [key in OrderBy]: (a: Reeeee, b: Reeeee) => number;
  };

  const sort = sorts[order.orderBy];

  const itemsCount = items.length;

  const [sliceFrom, sliceTo] = [maxRows * (page - 1), maxRows * page];
  // todo: use memo

  const itemsSorted = items.slice().sort(sort).slice(sliceFrom, sliceTo);
  const pagesCount = Math.ceil(itemsCount / maxRows);

  console.log({
    count: itemsSorted.length,
    itemsSorted,
    items: items.length,
    pages: Math.ceil(items.length / itemsSorted.length),
    sliceFrom,
    sliceTo,
  });

  return (
    <React.Fragment>
      <Box
        // width="1008px"
        // height="622px"
        style={{
          boxShadow: "0px 4px 8px rgba(97, 97, 97, 0.14)",
          width: "712px",
          minWidth: "712px",
        }}
        background="white"
        round="4px"
      >
        {/* header */}
        <Row
          items={[
            {
              content: (
                <Box>
                  {
                    <CheckBox
                      active={selectedAll}
                      onClick={handleSetActiveAll}
                    />
                  }
                </Box>
              ),
              isTitle: true,
              align: "center",
              width: "56px",
            },
            {
              content: (
                <ColumnWithOrder
                  active={order.orderBy === "referralsCount"}
                  title="Referral"
                  direction={order.direction}
                />
              ),
              onClick: () => {
                handleSetOrder("referralsCount");
              },
              isTitle: true,
              width: "120px",
            },
            {
              content: (
                <ColumnWithOrder
                  active={order.orderBy === "referrerReferralsCount"}
                  title="Refferer"
                  direction={order.direction}
                />
              ),
              onClick: () => {
                handleSetOrder("referrerReferralsCount");
              },
              isTitle: true,
              width: "120px",
            },
            {
              content: (
                <ColumnWithOrder
                  active={order.orderBy === "lvl"}
                  title="LvL"
                  direction={order.direction}
                  end
                />
              ),
              onClick: () => {
                handleSetOrder("lvl");
              },
              isTitle: true,
              width: "80px",
            },
            {
              content: (
                <ColumnWithOrder
                  active={order.orderBy === "createdAt"}
                  title="Reffered at"
                  direction={order.direction}
                  end
                />
              ),
              onClick: () => {
                handleSetOrder("createdAt");
              },
              isTitle: true,
              width: "140px",
              // align: "end",
            },
            {
              content: (
                <ColumnWithOrder
                  active={order.orderBy === "reward"}
                  title="Reward"
                  direction={order.direction}
                  end
                />
              ),
              onClick: () => {
                handleSetOrder("reward");
              },
              isTitle: true,
              width: "140px",
              // align: "end",
            },

            {
              content: null,
              isTitle: true,
              width: "56px",
              // align: "end",
            },
          ]}
        />
        {itemsSorted.map(referral => {
          const { lvl } = referral;

          const { color, bg } = lvlListStyles[lvl as 1 | 2];

          const referredAt = dayjs(new Date(referral.createdAt * 1000)).format(
            "MMM D, YYYY",
          );

          const isYesterdayReferred = dayjs(
            new Date(referral.createdAt * 1000),
          ).isYesterday();

          const isTodayReferred = dayjs(
            new Date(referral.createdAt * 1000),
          ).isToday();

          const referredAtDiff = dayjs(Date.now()).diff(
            new Date(referral.createdAt * 1000),
            "days",
          );

          // console.log({
          //   isYesterdayReferred,
          //   isTodayReferred,
          //   referredAtDiff,
          // });

          const referrerId = referral.referrer.id!;
          const referrerReferralsCount = referral.referrer.referralsCount || 0;

          const included = activeRows.includes(referral.id);
          const currentRowStyle = included
            ? {
                background: "#FAF9FA",
              }
            : {};

          return (
            <React.Fragment>
              <Row
                items={[
                  {
                    content: <Box>{<CheckBox active={included} />}</Box>,
                    style: {
                      ...currentRowStyle,
                    },
                    onClick: () => handleSetActiveRow(referral.id),
                    align: "center",
                    isTitle: false,
                    width: "56px",
                  },
                  {
                    content: (
                      <Box>
                        <Text
                          weight={500}
                          size="14px"
                          style={{
                            lineHeight: "142%",
                          }}
                          color="#414141"
                        >
                          {referral.id.slice(0, 5) +
                            "..." +
                            referral.id.slice(
                              referral.id.length - 3,
                              referral.id.length,
                            )}
                        </Text>
                        <Text
                          weight={600}
                          size="14px"
                          style={{
                            lineHeight: "142%",
                          }}
                          color={color}
                        >
                          {referral.referralsCount}
                        </Text>
                      </Box>
                    ),
                    style: {
                      ...currentRowStyle,
                    },
                    onClick: () => handleSetActiveRow(referral.id),
                    isTitle: false,
                    width: "120px",
                  },
                  {
                    content: (
                      <Box>
                        <Text
                          weight={500}
                          size="14px"
                          style={{
                            lineHeight: "142%",
                          }}
                          color="#414141"
                        >
                          {referrerId.slice(0, 5) +
                            "..." +
                            referrerId.slice(
                              referrerId.length - 3,
                              referrerId.length,
                            )}
                        </Text>
                        <Text
                          weight={600}
                          size="14px"
                          style={{
                            lineHeight: "142%",
                          }}
                          color={color}
                        >
                          {referrerReferralsCount}
                        </Text>
                      </Box>
                    ),
                    style: {
                      ...currentRowStyle,
                    },
                    onClick: () => handleSetActiveRow(referral.id),
                    isTitle: false,
                    width: "120px",
                  },
                  {
                    content: (
                      <Box
                        width="100%"
                        height="100%"
                        pad={{
                          horizontal: "10px",
                        }}
                        justify="center"
                        background={bg}
                        style={{
                          position: "relative",
                        }}
                        align="end"
                      >
                        <Text
                          weight={600}
                          size="16px"
                          color={color}
                          style={{
                            lineHeight: "110%",
                          }}
                        >
                          {lvl} lvl
                        </Text>
                      </Box>
                    ),
                    style: {
                      padding: "0px",
                      margin: "0px",
                      // background: progress.bg,
                    },
                    onClick: () => handleSetActiveRow(referral.id),
                    isTitle: false,
                    width: "80px",
                    align: "end",
                  },
                  {
                    content: (
                      <Box align="end">
                        <Text
                          weight={600}
                          size="14px"
                          style={{
                            lineHeight: "142%",
                          }}
                          color="#3E3E3E"
                          truncate
                        >
                          {isTodayReferred
                            ? "Today"
                            : isYesterdayReferred
                            ? "Yesterday"
                            : `${referredAtDiff + 1} days ago`}
                        </Text>
                        <Text
                          weight={400}
                          size="14px"
                          style={{
                            lineHeight: "142%",
                          }}
                          color="#3E3E3E"
                        >
                          {referredAt}
                        </Text>
                      </Box>
                    ),
                    style: {
                      ...currentRowStyle,
                    },
                    onClick: () => handleSetActiveRow(referral.id),
                    isTitle: false,
                    width: "140px",
                    align: "end",
                  },
                  {
                    content: (
                      <Text weight={700} size="14px" color={color}>
                        {typeof referral.reward === "number"
                          ? `+${referral.reward.toFixed(2)} DEFT`
                          : "..."}
                      </Text>
                    ),
                    style: {
                      ...currentRowStyle,
                    },
                    onClick: () => handleSetActiveRow(referral.id),
                    isTitle: false,
                    width: "140px",
                    align: "end",
                  },
                  {
                    content: <Box>{}</Box>,
                    style: {
                      ...currentRowStyle,
                    },
                    onClick: () => handleSetActiveRow(referral.id),
                    align: "center",
                    isTitle: false,
                    width: "56px",
                  },
                ]}
              />
            </React.Fragment>
          );
        })}
        {/* bottom of table */}

        <Box
          direction="row"
          align="center"
          height="46px"
          width="100%"
          pad={{
            horizontal: "16px",
          }}
          style={{
            userSelect: "none",
          }}
          justify="center"
        >
          <HoveredBox
            width="32px"
            height="32px"
            align="center"
            justify="center"
            round="50%"
            style={{
              cursor: "pointer",
              transition: "none",
              transform: "rotate(180deg)",
              // background: "#f2f2f2",
            }}
            onClick={handleSetPrevPage}
            hoverColor="#f2f2f2"
            margin={{
              right: "12px",
            }}
          >
            <ChevronRight />
          </HoveredBox>
          <Box direction="row">
            {makePages(pagesCount, page).map(item => {
              const isEllips =
                item === "end-ellipsis" || item === "start-ellipsis";

              const isActive = item === page;

              if (isEllips) {
                return (
                  <Box
                    margin={{ right: "12px" }}
                    width="32px"
                    height="32px"
                    align="center"
                    justify="center"
                    round="50%"
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    <Text size="15px" weight={600} color="#3E3E3E">
                      ...
                    </Text>
                  </Box>
                );
              }

              return (
                <Box
                  margin={{ right: "12px" }}
                  width="32px"
                  height="32px"
                  align="center"
                  justify="center"
                  round="50%"
                  border={
                    isActive
                      ? {
                          color: "#C0C0C0",
                          side: "all",
                          size: "1px",
                        }
                      : undefined
                  }
                  style={{
                    cursor: "pointer",
                    transition: "none",
                  }}
                  onClick={() => setPage(item as number)}
                >
                  <Text
                    size="15px"
                    weight={isActive ? 600 : 500}
                    color="#3E3E3E"
                  >
                    {item}
                  </Text>
                </Box>
              );
            })}
          </Box>
          <HoveredBox
            width="32px"
            height="32px"
            align="center"
            justify="center"
            round="50%"
            style={{
              cursor: "pointer",
              transition: "none",
              // background: "#f2f2f2",
            }}
            margin={{
              left: "12px",
            }}
            onClick={handleSetNextPage}
            hoverColor="#f2f2f2"
          >
            <ChevronRight />
          </HoveredBox>
        </Box>
      </Box>

      <Box height="16px" />
      {activeRows.length > 0 && (
        <Box
          width="100%"
          height="60px"
          round="4px"
          style={{
            boxShadow: "0px 4px 8px rgba(97, 97, 97, 0.14)",
            background: "white",
          }}
          pad="0px 16px"
          direction="row"
          align="center"
        >
          <Text color="#616161" size="14px" weight={500}>
            {activeRows.length} referrals selected
          </Text>
          <Box
            margin={{
              left: "auto",
            }}
          />
          <Box>
            <Text
              color="#2AB930"
              weight={700}
              size="14px"
              style={{
                lineHeight: "142%",
              }}
            >
              {activeSum.toFixed(2)} Total DEFT
            </Text>
            <Text
              color="#3E3E3E"
              weight={400}
              size="14px"
              style={{
                lineHeight: "142%",
              }}
            >
              Selected to Collect
            </Text>
          </Box>
          <Box width="40px"></Box>
          <HoveredElement
            render={binder => {
              return (
                <Box
                  {...binder.bind}
                  height="36px"
                  round="8px"
                  background={binder.hovered ? "#2AB930" : "#E1F8E2"}
                  align="center"
                  justify="center"
                  style={{
                    minWidth: "132px",
                    cursor: "pointer",
                    boxShadow: "0px 2px 4px rgba(0, 55, 3, 0.18)",
                    ...(loader
                      ? {
                          pointerEvents: "none",
                        }
                      : {}),
                  }}
                  pad="0px 16px"
                  onClick={() => collectRewards(activeRows, account || "")}
                >
                  {loader && (
                    <div
                      className="loader"
                      style={{
                        borderTop: "4px solid #2AB930",
                      }}
                    ></div>
                  )}
                  {!loader && (
                    <Text
                      size="14px"
                      color={binder.hovered ? "#E1F8E2" : "#2AB930"}
                      style={{
                        letterSpacing: "0.05em",
                      }}
                      weight={600}
                    >
                      Collect
                    </Text>
                  )}
                </Box>
              );
            }}
          />
        </Box>
      )}
    </React.Fragment>
  );
};
