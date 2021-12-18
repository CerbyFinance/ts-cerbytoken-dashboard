import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { serializeError } from "eth-rpc-errors";
import { Box, Text } from "grommet";
import React, { CSSProperties, useContext, useEffect, useState } from "react";
import AutosizeInput from "react-input-autosize";
import { useHistory } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
import styled from "styled-components";
import { Chains, switchToNetwork } from "./chains";
import { BridgeContext } from "./Shared";
import { noopApollo } from "./shared/client";
import { injected } from "./shared/connectors";
import { HoveredElement, useLocalStorage } from "./shared/hooks";
import { BURN_TOPIC, useBridgeContractOld } from "./shared/useContract";
import { chunkSubstr } from "./shared/utils";
import { txnToast } from "./toaster";

const Input = styled(AutosizeInput)`
  input {
    border: none;
    /* height: 48px; */
    border-radius: 6px;
    font-size: 18px;
    font-weight: 500;
    padding-right: 6px;
    padding-left: 1px;
    outline: none;
    color: #414141;

    font-weight: 600;

    /* background: #f6f2e9; */

    &::placeholder {
      color: #c1c1c1;
    }

    transition: none;
  }
  overflow: hidden;
`;

const chainIdToShort = {
  1: "ETH",
  56: "BSC",
  137: "Polygon",
  43114: "AVAX",
  250: "FTM",

  3: "ETH (ROP)",
  42: "ETH (KOV)",
  97: "BSC (TEST)",
} as {
  [key in Chains]: string;
};

const HoverScale = styled(Box)`
  &:hover {
    transform: scale(1.048);
  }
`;

type Proof = {
  sender: string;
  token: string;
  amount: string;
  amountAsFee: string;
  nonce: string;
  src: string;
  dest: string;
  transactionHash: string;
};

const TX_REGEX = /^0x([A-Fa-f0-9]{64})$/;

export const RecoverOld = () => {
  const { account, activate, chainId, library, connector, error } =
    useWeb3React();

  const { refetchBalance } = useContext(BridgeContext);

  const [tx, setTx] = useState("");

  const changeHandler = (evt: any) => {
    setTx(evt.target.value);
  };

  const history = useHistory();

  const [loader, setLoader] = useState(false);

  const srcClient = noopApollo;
  const destClient = noopApollo;

  const connected = account ? true : false;

  const bridgeContract = useBridgeContractOld();

  const unsupportedNetwork = error?.message.includes("Unsupported chain id");
  const { value: proof, setValue: setProof } = useLocalStorage(
    "proof",
    null as Proof | null,
  );

  const srcId = (Number(proof?.src) || 0) as Chains;
  const destId = (Number(proof?.dest) || 0) as Chains;

  const src = chainIdToShort[srcId] || "...";
  const dest = chainIdToShort[destId] || "...";

  const connectedToRightChain = account && destId === chainId;

  const recover = async () => {
    try {
      setLoader(true);

      const result = await bridgeContract.mintWithBurnProof({
        amountToBridge: proof!.amount!,
        amountAsFee: proof!.amountAsFee.toString(),
        sourceTokenAddr: proof!.token,
        sourceChainId: Number(proof!.src),
        sourceNonce: Number(proof!.nonce),
        transactionHash: proof!.transactionHash,
      });

      const result2 = await result.wait();

      await refetchBalance(account!);

      if (result2.status === 1) {
        txnToast(
          destId,
          "success",
          "Transaction Successful",
          result2.transactionHash,
        );
      }

      setLoader(false);
    } catch (error) {
      console.log(error);

      setLoader(false);
      const serializedError = serializeError(error);
      const originalErrorMessage =
        (serializedError.data as any)?.originalError?.error?.message ||
        (serializedError.data as any)?.message;

      if (originalErrorMessage && originalErrorMessage.includes("CWS: ")) {
        const message = originalErrorMessage.split("CWS: ")[1];

        // @ts-ignore
        txnToast(chainId, "error", "Transaction Error", undefined, message);
      } else {
        txnToast(chainId as Chains, "fail", "Transaction Canceled");
      }
    }
  };

  useEffect(() => {
    const fire = async (txHash: string) => {
      const result = await (library as Web3Provider).getTransactionReceipt(
        txHash,
      );

      console.log(result);

      const burnEvent = result.logs.find(
        item => item.topics[0] === BURN_TOPIC,
      )!;

      let [
        sender,
        token,
        amount,
        amountAsFee,
        nonce,
        src,
        dest,
        transactionHash,
      ] = chunkSubstr(burnEvent.data.slice(2), 64).map(
        item => "0x" + item.replace(/^0+/, ""),
      );

      const proof = {
        sender,
        token,
        amount,
        amountAsFee,
        nonce,
        src,
        dest,
        transactionHash,
      };

      setProof(proof);
    };

    const matches = tx.match(TX_REGEX);
    if (matches && matches[1]) {
      fire(tx).catch(e => null);
    }
  }, [tx, chainId]);

  let actionButton = {} as {
    text: string;
    onClick: () => void;
    style?: CSSProperties;
  };

  if (connected) {
    if (connectedToRightChain) {
      actionButton = {
        text: "Recover",
        onClick: () => {
          recover();
        },
      };
    } else {
      actionButton = {
        text: "Switch to " + dest,
        onClick: () => {
          switchToNetwork({
            library,
            chainId: destId,
          });
        },
        style: {
          background: "#F83245",
        },
      };
    }
  } else if (unsupportedNetwork) {
    actionButton = {
      text: "Switch to " + dest,
      onClick: () => {
        switchToNetwork({
          library,
          chainId: destId,
        });
      },
      style: {
        background: "#F83245",
      },
    };
  } else {
    actionButton = {
      text: "Connect",
      onClick: () => activate(injected),
    };
  }

  return (
    <Box
      style={{
        width: "405px",
        boxShadow:
          "0px 8px 16px 2px rgba(97, 97, 97, 0.1), 0px 16px 32px 2px rgba(97, 97, 97, 0.1)",
        position: "relative",
        alignSelf: "center",

        // margin: "40px 20px 0px 0px",
      }}
      background="white"
      round="12px"
      pad="20px 22px 20px"
    >
      <Text
        textAlign="center"
        weight={800}
        size="20px"
        color="#414141"
        style={{
          lineHeight: "150%",
        }}
      >
        Old Bridge Recover
      </Text>
      <Box height="15px" />
      <Text
        textAlign="center"
        weight={600}
        size="16px"
        color="#414141"
        style={{
          lineHeight: "150%",
        }}
      >
        Enter transaction hash below:
      </Text>
      <Text
        textAlign="center"
        weight={600}
        size="12px"
        color="#414141"
        style={{
          lineHeight: "150%",
        }}
      >
        (Be sure to switch to appropriate network)
      </Text>
      <Box height="15px" />
      {!proof && (
        <Box
          width="360px"
          style={{
            border: "1px solid #C0C0C0",
          }}
          round="8px"
          height="56px"
          pad="10px 12px 0px"
        >
          <Input
            // injectStyles={false}
            minWidth={30}
            placeholder="0xfa....ab"
            value={tx}
            onChange={changeHandler}
            onKeyPress={e => {
              console.log(e.key);
            }}
          />
        </Box>
      )}
      <Box height="15px" />

      {proof && (
        <HoveredElement
          render={binder => {
            return (
              <Box
                {...binder.bind}
                width="100%"
                height="48px"
                round="8px"
                background={binder.hovered ? "#4d9aff" : "#2B86FF"}
                // background={
                //   binder.hovered ? actionButton.bgHover : actionButton.bg
                // }
                align="center"
                justify="center"
                style={{
                  ...(binder.hovered
                    ? {
                        transform: "scale(1.01)",
                      }
                    : {}),
                  ...actionButton.style,

                  cursor: "pointer",
                  boxShadow:
                    "0px 1px 2px rgba(97, 97, 97, 0.2), 0px 2px 4px rgba(97, 97, 97, 0.2)",
                  ...(loader
                    ? {
                        pointerEvents: "none",
                      }
                    : {}),
                }}
                pad="0px 16px"
                onClick={() => actionButton.onClick()}
              >
                {loader && <div className="loader"></div>}

                {!loader && (
                  <Text
                    size="16px"
                    color="white"
                    style={{
                      letterSpacing: "0.05em",
                    }}
                    weight={600}
                  >
                    {actionButton.text}
                  </Text>
                )}
              </Box>
            );
          }}
        />
      )}
      {proof && (
        <>
          <Box height="15px" />
          <Text
            textAlign="center"
            weight={600}
            size="14px"
            color="#414141"
            style={{
              lineHeight: "150%",
              cursor: "pointer",
            }}
            onClick={() => setProof(null)}
          >
            Reset
          </Text>
        </>
      )}
    </Box>
  );
};
