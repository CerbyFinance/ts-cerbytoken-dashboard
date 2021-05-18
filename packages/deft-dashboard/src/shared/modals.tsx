import { Box, Text } from "grommet";
import Dialog from "rc-dialog";
import React, { createContext, useContext, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

const InitialState = {
  activeModal: null as null | Modals,
  activeModalPayload: null as ModalPayloads,
};

export type Modals = "referral-address-modal" | "common-modal" | "foobar-modal";
export type ModalPayloads = CommonModalPayload | FoobarModalPayload | null;

export type CommonModalValues = {
  modal?: Record<string, string>;
  group?: Record<string, string>;
};

export type CommonModalPayload = {
  actions: {
    callback: (values: CommonModalValues) => void;
    name: string;
  }[];
  values: CommonModalValues;
  title: string;
};

export type RefModalPayload = {
  address: string;
};

export type FoobarModalPayload = {
  templateName: string;
  action: "add" | "edit" | "view";
};

// TODO: typings
const ModalsContext = createContext({
  activeModal: null as null | Modals,
  activeModalPayload: null as ModalPayloads,
  // showModal: (modal: Modals, payload?: object) => {},
  showRefAddressModal: (payload: RefModalPayload) => {},
  showCommonModal: (payload: CommonModalPayload) => {},
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

  showCommonModal = (payload: any) => {
    this.showModal("common-modal", payload);
  };

  showRefAddressModal = (payload: any) => {
    this.showModal("referral-address-modal", payload);
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
          showRefAddressModal: this.showRefAddressModal,
          showCommonModal: this.showCommonModal,
        }}
      >
        {children}
      </ModalsContext.Provider>
    );
  }
}

export const ModalDialog = (props: {
  visible: boolean;
  closeModal: () => void;
  children: React.ReactNode;
}) => {
  const { closeModal, visible } = props;

  return (
    <Dialog
      visible={visible}
      onClose={closeModal}
      wrapClassName="dialog-center"
      bodyStyle={{
        padding: "0px",
      }}
      maskStyle={{
        background: "rgba(96, 96, 96, 0.4)",
      }}
      closable={false}
    >
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

const ReferralAddressModal = (props: RefModalPayload) => {
  const root = window.location.protocol + "//" + window.location.host;
  const link = root + "/become-referral/?" + `ref=${props.address}`;

  const [copied, setCopied] = useState(false);

  return (
    <Box
      style={{
        width: "405px",
        // height: "500px",
        boxShadow:
          "0px 8px 16px 2px rgba(97, 97, 97, 0.1), 0px 16px 32px 2px rgba(97, 97, 97, 0.1)",
        position: "relative",
        // margin: "40px 20px 0px 0px",
        background: "white",
      }}
      round="12px"
      pad="20px 23px 20px"
    >
      <Text textAlign="center" weight={800} size="24px" color="#414141">
        Your Referral Link
      </Text>
      <Box height="20px" />
      <Box
        style={{
          userSelect: "all",
        }}
      >
        <Text
          size="13px"
          textAlign="center"
          weight={500}
          color="#414141"
          truncate
        >
          {root}/become-referral/?
        </Text>
        <Text
          size="14px"
          textAlign="center"
          weight={600}
          color="#414141"
          truncate
        >
          ref={props.address}
        </Text>
      </Box>
      <Box height="20px" />
      <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
        <Box
          width="100%"
          height="48px"
          round="8px"
          background={copied ? "#325483" : "#2B86FF"}
          align="center"
          justify="center"
          style={{
            cursor: "pointer",
            boxShadow:
              "0px 2px 4px rgba(15, 86, 179, 0.18), 0px 4px 8px rgba(15, 86, 179, 0.18)",
          }}
        >
          <Text
            size="16px"
            color="white"
            style={{
              letterSpacing: "0.05em",
            }}
            weight={600}
          >
            {copied ? "Copied" : "Copy Referral Link"}
          </Text>
        </Box>
      </CopyToClipboard>
    </Box>
  );
};

export const ModalsCreatedApp = () => {
  return (
    <ModalsApp
      modals={[
        {
          name: "referral-address-modal",
          element: props => (
            <ModalDialog closeModal={props.closeModal} visible={props.visible}>
              <ReferralAddressModal {...props.payload} />
            </ModalDialog>
          ),
        },
      ]}
    />
  );
};

export { ModalsState, ModalsContext };
