import { useWeb3React } from "@web3-react/core";
import { createContext, useEffect, useState } from "react";
import {
  CachedInterestPerShare,
  DailySnapshot,
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

  const [state, setState] = useState({
    cachedInterestPerShare: [],
    dailySnapshots: [],
  } as State);

  const {
    data: data2,
    loading: loading2,
    error: error2,
  } = useSnapshotsAndInterestQuery({
    variables: {},
    fetchPolicy: "cache-and-network",
    skip: !account, // can be fetched in parallel
  });

  useEffect(() => {
    if (data2) {
      console.log("foo111");
      setState({
        cachedInterestPerShare: data2.cachedInterestPerShares,
        dailySnapshots: data2.dailySnapshots,
      });
    }
  }, [data2]);

  return (
    <SnapshotsInterest.Provider value={state}>
      {children}
    </SnapshotsInterest.Provider>
  );
};
