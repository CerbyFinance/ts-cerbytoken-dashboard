import { Box, Text } from "grommet";
import React, { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.min.css";
import useMedia from "use-media";
import { Chains } from "./chains";
import { Hint } from "./components/Hint";
import {
  AvaxLogo,
  BinanceLogo,
  BuyIcon,
  Direction,
  DollarIcon,
  EthereumLogo,
  ExclamationIcon,
  FantomLogo,
  PolygonLogo,
  SellIcon,
} from "./Icons";

//

type Arbitrage = {
  from: string;
  to: string;
  buyAmount: number;
  sellAmount: number;
  profit: number;
};

type ApiResponse<T> = {
  data: T;
  message: string;
  status: string;
};

const chainNameToId = {
  eth: 1,
  bsc: 56,
  avax: 43114,
  ftm: 250,
  poly: 137,
} as {
  [key: string]: Chains;
};

const chainIdToIcon = {
  1: <EthereumLogo />,
  56: <BinanceLogo />,
  43114: <AvaxLogo />,
  250: <FantomLogo />,

  137: <PolygonLogo />,

  3: <EthereumLogo />,
  42: <EthereumLogo />,
  97: <BinanceLogo />,
} as {
  [key in Chains]: JSX.Element;
};

export const Arbitrage = () => {
  const [combos, setCombos] = useState([] as Arbitrage[]);
  const isMobileOrTablet = useMedia({ maxWidth: "600px" });

  useEffect(() => {
    const fire = async () => {
      const result: ApiResponse<Arbitrage[]> = await fetch(
        "https://supply.cerby.fi/cerby/arbitrage-opportunities",
      ).then(r => r.json());

      if (result.data) {
        const combos = result.data;

        setCombos(combos);
      }
    };

    fire();

    const timer = setInterval(() => {
      fire();
    }, 3100);

    return () => clearInterval(timer);
  }, []);

  return (
    <React.Fragment>
      <Box
        width="350px"
        align="center"
        direction="row"
        pad="8px 4px"
        background="#ebebeb"
        round="8px"
        justify="center"
        margin={
          isMobileOrTablet
            ? {}
            : {
                top: "-50px",
              }
        }
      >
        <ExclamationIcon />
        <Text
          size="13px"
          textAlign="center"
          style={{
            maxWidth: "280px",
          }}
        >
          BSC might be showing out of sync values, double check yourself in DEX
          please.
        </Text>
      </Box>
      <Box height="20px" />
      <Text size="16px">Arbitrage Opportunities</Text>
      <Box height="20px" />

      <Box direction="row" width="300px">
        <Box width="110px" align="center">
          <Text size="13px">from / to</Text>
        </Box>
        <Box width="150px" align="center">
          <Text size="13px">buy / sell</Text>
        </Box>
        <Box width="60px" align="center">
          <Text size="13px">profit</Text>
        </Box>
        {/* <Box width="10px" />
        <Text size="13px">profit</Text> */}
      </Box>
      <Box height="20px" />
      <Box>
        {combos.map(item => {
          const fromId = chainNameToId[item.from];
          const toId = chainNameToId[item.to];

          const fromIcon = chainIdToIcon[fromId];
          const toIcon = chainIdToIcon[toId];

          return (
            <Box margin={{ bottom: "30px" }} direction="row" align="center">
              <Box
                direction="row"
                style={{
                  transform: "scale(0.8)",
                }}
                justify="center"
                width="110px"
              >
                <Hint
                  offset={[]}
                  placement="top"
                  description={
                    <Text
                      size="13px"
                      style={{
                        lineHeight: "22px",
                      }}
                      textAlign="center"
                    >
                      {item.from}
                    </Text>
                  }
                >
                  <Text>{fromIcon}</Text>
                </Hint>
                <Box height="40px" width="40px" align="center" justify="center">
                  <Direction />
                </Box>
                <Hint
                  offset={[]}
                  placement="top"
                  description={
                    <Text
                      size="13px"
                      style={{
                        lineHeight: "22px",
                      }}
                      textAlign="center"
                    >
                      {item.to}
                    </Text>
                  }
                >
                  <Text>{toIcon}</Text>
                </Hint>
              </Box>
              <Box width="14px"></Box>
              <Box>
                <Box direction="row" align="center">
                  <BuyIcon />
                  <Box width="10px"></Box>
                  <DollarIcon sm />
                  <Box width="4px"></Box>
                  <Text color="#414141" size="15px">
                    {item.buyAmount.asCurrency(2)}
                  </Text>
                  {/* <Box width="4px"></Box>
                  <Text size="11px">(buy)</Text> */}
                </Box>
                <Box direction="row" align="center">
                  <SellIcon />
                  <Box width="10px"></Box>
                  <DollarIcon sm />
                  <Box width="4px"></Box>
                  <Text color="#414141" size="15px">
                    {item.sellAmount.asCurrency(2)}
                  </Text>
                  {/* <Box width="4px"></Box>
                  <Text size="11px">(sell)</Text> */}
                </Box>
              </Box>
              <Box width="24px"></Box>
              <Box direction="row" align="center">
                <DollarIcon sm />
                <Box width="4px"></Box>
                <Text size="14px" color="#414141">
                  {item.profit.asCurrency(2)}
                </Text>
                {/* <Box width="4px"></Box>
                <Text size="11px">(profit)</Text> */}
              </Box>
            </Box>
          );
        })}
      </Box>
    </React.Fragment>
  );
};
