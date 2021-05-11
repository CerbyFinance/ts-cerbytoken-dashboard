import Dialog from "rc-dialog";
import React, { createContext, useContext } from "react";

const InitialState = {
  activeModal: null as null | Modals,
  activeModalPayload: null as ModalPayloads,
};

export type Modals = "scrape-or-close-modal" | "common-modal" | "foobar-modal";
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

export type FoobarModalPayload = {
  templateName: string;
  action: "add" | "edit" | "view";
};

// TODO: typings
const ModalsContext = createContext({
  activeModal: null as null | Modals,
  activeModalPayload: null as ModalPayloads,
  // showModal: (modal: Modals, payload?: object) => {},
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

  showScrapeOrCloseModal = (payload: any) => {
    this.showModal("scrape-or-close-modal", payload);
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

export const ModalsCreatedApp = () => {
  return (
    <ModalsApp
      modals={[
        {
          name: "scrape-or-close-modal",
          element: props => {
            // const { type } = props.payload as CloseStakeModalPayload;
            return (
              <ModalDialog
                closeModal={props.closeModal}
                visible={props.visible}
              >
                {/* <StakeClosingModal {...props.payload} /> */}
              </ModalDialog>
            );
          },
        },
      ]}
    />
  );
};

export { ModalsState, ModalsContext };
