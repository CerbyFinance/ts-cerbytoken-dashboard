import React, { Fragment, useContext, useEffect } from "react";
import { ModalsContext } from "../../shared/modals";

const AppDev = () => {
  const { showConnectWalletModal } = useContext(ModalsContext);

  useEffect(() => {
    showConnectWalletModal();
  }, []);

  return <Fragment>root</Fragment>;
};

export { AppDev };
