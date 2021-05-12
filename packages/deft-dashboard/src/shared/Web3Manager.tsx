import { useWeb3React } from "@web3-react/core";
import "rc-dialog/assets/index.css";
import { useEffect } from "react";
import { injected } from "./connectors";
import { useEagerConnect, useInactiveListener } from "./hooks";

export default function Web3ReactManager({
  children,
}: {
  children: JSX.Element;
}) {
  const { active } = useWeb3React();

  const {
    active: networkActive,
    error: networkError,
    activate: activateNetwork,
  } = useWeb3React();

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // after eagerly trying injected, if the network connect ever isn't active or in an error state, activate itd
  useEffect(() => {
    if (triedEager && !networkActive && !networkError && !active) {
      activateNetwork(injected);
    }
  }, [triedEager, networkActive, networkError, activateNetwork, active]);

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager);

  return children;
}
