import { Box, Text } from "grommet";
import React from "react";
import { toast } from "react-toastify";
import { Chains } from "./chains";

// type ChainId = 1 | 3 | 4 | 5 | 42;

// TODO: add bsc
const ETHERSCAN_PREFIXES: { [chainId in Chains]: string } = {
  1: "etherscan.io",
  3: "ropsten.etherscan.io",
  // 4: "rinkeby.etherscan.io",
  // 5: "goerli.etherscan.io",
  42: "kovan.etherscan.io",
  56: "bscscan.com",
  97: "testnet.bscscan.com",
};

export function getEtherscanLink(
  chainId: Chains,
  data: string,
  type: "transaction" | "token" | "address" | "block",
): string {
  const prefix = `https://${
    ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]
  }`;

  // const prefix = "https://testnet.bscscan.com";
  // const prefix = "https://ropsten.etherscan.io/";
  // const prefix = "https://etherscan.io/";

  switch (type) {
    case "transaction": {
      return `${prefix}/tx/${data}`;
    }
    case "token": {
      return `${prefix}/token/${data}`;
    }
    case "block": {
      return `${prefix}/block/${data}`;
    }
    case "address":
    default: {
      return `${prefix}/address/${data}`;
    }
  }
}

const X = ({ fill }: { fill: string }) => (
  <svg
    width="13"
    height="14"
    viewBox="0 0 13 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.37435 5.34277L2.14038 1.1088C1.71731 0.685737 1.03138 0.685737 0.608317 1.1088C0.185249 1.53187 0.185249 2.2178 0.608317 2.64087L4.84228 6.87484L0.608317 11.1088C0.185249 11.5319 0.185249 12.2178 0.608316 12.6409C1.03138 13.0639 1.71731 13.0639 2.14038 12.6409L6.37435 8.4069L10.6083 12.6409C11.0314 13.0639 11.7173 13.0639 12.1404 12.6409C12.5634 12.2178 12.5634 11.5319 12.1404 11.1088L7.90641 6.87484L12.1404 2.64087C12.5634 2.2178 12.5634 1.53187 12.1404 1.10881C11.7173 0.685737 11.0314 0.685737 10.6083 1.1088L6.37435 5.34277Z"
      fill={fill}
      stroke={fill}
      stroke-width="0.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const Check = ({ fill }: { fill: string }) => (
  <svg
    width="16"
    height="13"
    viewBox="0 0 16 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M13.5673 0.81813C14.1165 0.268956 15.0069 0.268956 15.5561 0.81813C16.0985 1.36057 16.1052 2.23591 15.576 2.78651L8.09064 12.1432C8.07984 12.1567 8.0683 12.1696 8.05607 12.1819C7.50689 12.731 6.6165 12.731 6.06733 12.1819L1.10524 7.21978C0.556066 6.67061 0.556066 5.78022 1.10524 5.23104C1.65442 4.68187 2.5448 4.68187 3.09398 5.23104L7.01933 9.15639L13.53 0.860196C13.5416 0.845441 13.5541 0.831394 13.5673 0.81813Z"
      fill={fill}
    />
  </svg>
);

const Hourglass = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="hourglass-start"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
  >
    <path
      fill="currentColor"
      d="M360 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24 0 90.965 51.016 167.734 120.842 192C75.016 280.266 24 357.035 24 448c-13.255 0-24 10.745-24 24v16c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24 0-90.965-51.016-167.734-120.842-192C308.984 231.734 360 154.965 360 64c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24zm-64 448H88c0-77.458 46.204-144 104-144 57.786 0 104 66.517 104 144z"
    ></path>
  </svg>
);

const Fail = () => (
  <svg
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="ban"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M256 8C119.034 8 8 119.033 8 256s111.034 248 248 248 248-111.034 248-248S392.967 8 256 8zm130.108 117.892c65.448 65.448 70 165.481 20.677 235.637L150.47 105.216c70.204-49.356 170.226-44.735 235.638 20.676zM125.892 386.108c-65.448-65.448-70-165.481-20.677-235.637L361.53 406.784c-70.203 49.356-170.226 44.736-235.638-20.676z"
    ></path>
  </svg>
);

export const txnToast = (
  chainId: Chains,
  type: "fail" | "error" | "pending" | "success",
  title: string,
  txn?: string,
  reason?: string,
) => {
  toast.success(
    <Box direction="row" align="center">
      <Box
        style={{
          transform: "scale(1.2)",
        }}
      >
        {type === "success" && <Check fill="#2AB930" />}
        {type === "pending" && (
          <Box
            height="16px"
            width="16px"
            style={{
              color: "#ED9526",
            }}
          >
            <Hourglass />
          </Box>
        )}
        {/* {type === "pending" && <Check fill="#ED9526" />} */}
        {type === "fail" && (
          <Box
            height="16px"
            width="16px"
            style={{
              color: "#F83245",
            }}
          >
            <Fail />
          </Box>
        )}
        {type === "error" && <X fill="#F83245" />}
      </Box>
      <Box width="20px" />
      <Box justify="center">
        <Text size="14px" weight={600}>
          {title}
        </Text>
        <Box height="2px" />
        {reason && <Text size="14px">{reason}</Text>}
        {txn && (
          <a
            href={getEtherscanLink(chainId, txn, "transaction")}
            target="_blank"
            style={{
              display: "inline-flex",
              color: "#4a7fff",
              textDecoration: "none",
            }}
          >
            <Text size="14px">View on Etherscan</Text>
          </a>
        )}
      </Box>
    </Box>,
    {
      style: {
        fontFamily: "inherit",
        background: "white",
        color: "#444444",
      },
      progressStyle: {
        background: "#e2e0e0",
      },
    },
  );
};
