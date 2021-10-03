import { Box } from "grommet";
import Dialog from "rc-dialog";
import React, { createContext, useContext } from "react";
import { CreateStakeModal } from "../CreateStake";
import { ScrapeOrEndModal } from "../ScrapeOrEnd";
import { TransferStakesModal } from "../TransferStakes";

const InitialState = {
  activeModal: null as null | Modals,
  // activeModal: "create-stake-modal" as Modals | null,
  activeModalPayload: null as ModalPayloads,
};

export type Modals =
  | "scrape-or-end-stakes-modal"
  | "create-stake-modal"
  | "transfer-stakes-modal";
export type ModalPayloads = TransferStakesModalPayload | null;

export type TransferStakesModalPayload = {};

const ModalsContext = createContext({
  activeModal: null as null | Modals,
  activeModalPayload: null as ModalPayloads,
  showTransferStakesModal: (payload: TransferStakesModalPayload) => {},
  createStakeModal: () => {},
  showScrapeOrEndStakesModal: () => {},
  closeModal: () => {},
});

type State = {} & typeof InitialState;

class ModalsState extends React.Component<
  {
    children: React.ReactNode;
  },
  State
> {
  state = InitialState;

  showModal = (modal: Modals, payload?: ModalPayloads) => {
    this.setState({
      activeModal: modal,
      activeModalPayload: typeof payload === "undefined" ? null : payload,
    });
  };

  showTransferStakesModal = (payload: any) => {
    this.showModal("transfer-stakes-modal", payload);
  };

  createStakeModal = () => {
    this.showModal("create-stake-modal", {});
  };

  showScrapeOrEndStakesModal = () => {
    this.showModal("scrape-or-end-stakes-modal", {});
  };

  closeModal = () => {
    this.setState({ activeModal: null });
  };

  render() {
    const { children } = this.props;
    const { activeModal, activeModalPayload } = this.state;

    return (
      <ModalsContext.Provider
        value={{
          activeModal,
          activeModalPayload,
          closeModal: this.closeModal,
          showTransferStakesModal: this.showTransferStakesModal,
          createStakeModal: this.createStakeModal,
          showScrapeOrEndStakesModal: this.showScrapeOrEndStakesModal,
        }}
      >
        {children}
      </ModalsContext.Provider>
    );
  }
}

const X = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 10L10 30"
      stroke="white"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M10 10L30 30"
      stroke="white"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

export const ModalDialog = (props: {
  visible: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}) => {
  const { closeModal, visible } = props;

  return (
    <Dialog
      visible={visible}
      // onClose={closeModal}
      wrapClassName="dialog-center"
      bodyStyle={{
        padding: "0px",
      }}
      maskStyle={{
        background: "rgba(0,0,0, 0.7)",
      }}
      style={{
        position: "relative",
      }}
      closable={false}
    >
      <Box
        style={{
          position: "absolute",
          right: "-60px",
          cursor: "pointer",
        }}
        onClick={closeModal}
      >
        <X />
      </Box>
      {props.children}
    </Dialog>
  );
};

export const ModalsApp = (props: {
  modals: {
    name: Modals;
    element: (props: {
      payload: any;
      visible: boolean;
      closeModal: any;
    }) => JSX.Element;
  }[];
}) => {
  const { activeModal, closeModal, activeModalPayload } =
    useContext(ModalsContext);

  return (
    <>
      {props.modals.map(modal => {
        const { element: Modal, name } = modal;
        const visible = activeModal === name;
        if (!visible) {
          return null;
        }

        return (
          <Modal
            closeModal={closeModal}
            visible={activeModal === name}
            key={name}
            // TODO: add typings
            payload={activeModalPayload as any}
          />
        );
      })}
    </>
  );
};

export const ModalsCreatedApp = () => {
  return (
    <ModalsApp
      modals={[
        {
          name: "transfer-stakes-modal",
          element: props => {
            return (
              <ModalDialog
                closeModal={props.closeModal}
                visible={props.visible}
              >
                <TransferStakesModal {...props.payload} />
              </ModalDialog>
            );
          },
        },
        {
          name: "create-stake-modal",
          element: props => {
            return (
              <ModalDialog
                closeModal={props.closeModal}
                visible={props.visible}
              >
                <CreateStakeModal {...props.payload} />
              </ModalDialog>
            );
          },
        },
        {
          name: "scrape-or-end-stakes-modal",
          element: props => {
            return (
              <ModalDialog
                closeModal={props.closeModal}
                visible={props.visible}
              >
                <ScrapeOrEndModal {...props.payload} />
              </ModalDialog>
            );
          },
        },
      ]}
    />
  );
};

export { ModalsState, ModalsContext };
