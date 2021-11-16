import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import React, { createContext, useEffect, useState } from "react";
import { matchPath, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
import { useBridgeContract, useTokenContract } from "./shared/useContract";

export const IsActivePath = (path: string) => {
  const location = useLocation();

  const result = matchPath(location.pathname, {
    path,
    exact: false,
    strict: false,
  });

  return result ? true : false;
};

const bridgeTokens = [
  {
    name: "CERBY",
    address: "0xdef1fac7Bf08f173D286BbBDcBeeADe695129840",
  },
];

const wrapTokens = [
  {
    name: "Token1",
    address: "0xF89217f234434105b7f7a8912750D7CC612D7F9e",
    approvalNeeded: true,
  },
  {
    name: "Token2",
    address: "0x371934cea4f68e78455866325d5b0A7e31cB7387",
    approvalNeeded: false,
  },
];

type ContextState = {
  token: string;
  tokenAddress: string;
  balance: number;
  fee: number;
  setToken: (token: string) => void;
  setFee: (fee: number) => void;
  setBalance: (balance: number) => void;
  refetchBalance: (account: string) => Promise<void>;
};

export const BridgeContext = createContext({
  token: "",
  tokenAddress: "",
  balance: 0,
  fee: 0,
  // minAmount: 0,
  setToken: (token: string) => {},
  setFee: (fee: number) => {},
  setBalance: (balance: number) => {},
  refetchBalance: async (account: string) => {},
});

export const WrapContext = createContext({
  token: "",
  tokenAddress: "",
  balance: 0,
  fee: 0,
  // minAmount: 0,
  setToken: (token: string) => {},
  setFee: (fee: number) => {},
  setBalance: (balance: number) => {},
  refetchBalance: async (account: string) => {},
});

export const WrapState = ({ children }: { children: React.ReactNode }) => {
  const { account, chainId } = useWeb3React();

  const [balance, setBalance] = useState(0);
  const [fee, setFee] = useState(0);
  // const [minAmount, setMinAmount] = useState(0);

  const [token, setToken] = useState("Token1");

  const tokenAddress = wrapTokens.find(item => item.name === token)?.address!;

  console.log({
    tokenAddress,
  });

  const tokenContract = useTokenContract(tokenAddress);
  const bridgeContract = useBridgeContract();

  console.log({
    fee,
  });

  const refetchBalance = async (account: string) => {
    try {
      const balance = await tokenContract.balanceOf(account);

      setBalance(Math.floor(Number(ethers.utils.formatEther(balance))));
      console.log({
        balance: ethers.utils.formatEther(balance),
      });
    } catch (error) {
      setBalance(0);
      console.log(error);
    }
  };

  useEffect(() => {
    if (account) {
      refetchBalance(account);
    }
  }, [account, tokenAddress, chainId]);

  return (
    <WrapContext.Provider
      value={{
        token,
        tokenAddress,
        setToken,
        balance,
        fee,
        setFee,
        setBalance,
        refetchBalance,
      }}
    >
      {children}
    </WrapContext.Provider>
  );
};

export const BridgeState = ({ children }: { children: React.ReactNode }) => {
  const { account, chainId } = useWeb3React();

  const [balance, setBalance] = useState(0);
  const [fee, setFee] = useState(0);
  // const [minAmount, setMinAmount] = useState(0);

  const [token, setToken] = useState("CERBY");

  const tokenAddress = bridgeTokens.find(item => item.name === token)?.address!;

  console.log({
    tokenAddress,
  });

  const tokenContract = useTokenContract(tokenAddress);
  const bridgeContract = useBridgeContract();

  console.log({
    fee,
  });

  const refetchBalance = async (account: string) => {
    try {
      const balance = await tokenContract.balanceOf(account);

      setBalance(Math.floor(Number(ethers.utils.formatEther(balance))));
      console.log({
        balance: ethers.utils.formatEther(balance),
      });
    } catch (error) {
      setBalance(0);
      console.log(error);
    }
  };

  useEffect(() => {
    if (account) {
      refetchBalance(account);
    }
  }, [account, tokenAddress, chainId]);

  return (
    <BridgeContext.Provider
      value={{
        token,
        tokenAddress,
        setToken,
        balance,
        fee,
        setFee,
        setBalance,
        refetchBalance,
      }}
    >
      {children}
    </BridgeContext.Provider>
  );
};
