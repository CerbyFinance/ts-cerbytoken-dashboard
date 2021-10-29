import { useApolloClient } from "@apollo/client";
import { useWeb3React } from "@web3-react/core";
import { createContext, useEffect } from "react";
import {
  CachedInterestPerShare,
  DailySnapshot,
  SnapshotsAndInterestDocument,
  useSnapshotsAndInterestQuery,
} from "../graphql/types";

type State = {
  dailySnapshots: DailySnapshot[];
  cachedInterestPerShare: CachedInterestPerShare[];
};

export const SnapshotsInterest = createContext({
  cachedInterestPerShare: [],
  dailySnapshots: [],
} as State);

export const SnapshotsInterestProvider = ({
  children,
}: {
  children: JSX.Element;
}) => {
  const { account, chainId } = useWeb3React();

  const {
    data: data2,
    loading: loading2,
    error: error2,
  } = useSnapshotsAndInterestQuery({
    variables: {},
    fetchPolicy: "cache-and-network",
    skip: !account, // can be fetched in parallel
  });

  const stakingClient = useApolloClient();

  useEffect(() => {
    const timer = setInterval(async () => {
      const resultQuery = await stakingClient
        .query({
          query: SnapshotsAndInterestDocument,
          variables: {},
          fetchPolicy: "network-only",
        })
        .catch(e => null);
    }, 60000);

    return () => clearInterval(timer);
  }, [account, chainId]);

  return (
    <SnapshotsInterest.Provider
      value={{
        cachedInterestPerShare: data2?.cachedInterestPerShares || [],
        dailySnapshots: data2?.dailySnapshots || [],
      }}
    >
      {children}
    </SnapshotsInterest.Provider>
  );
};
