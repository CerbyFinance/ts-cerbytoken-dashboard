import { ApolloProvider } from "@apollo/react-hooks";
import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { Grommet } from "grommet";
import React, { useContext } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Filter } from "./components/Filter";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Nav } from "./components/Nav";
import { Results } from "./components/Results";
import { stakingClient } from "./shared/client";
import { ModalsCreatedApp, ModalsState } from "./shared/modals";
import { NavContext, NavProvider } from "./shared/nav";
import { PresaleProvider } from "./shared/presale";
import { globalTheme, ThemeContext, ThemeProvider } from "./shared/theme";
import { useReferrer } from "./shared/useReferrer";
import { classNames } from "./shared/utils";
import Web3ReactManager from "./shared/Web3Manager";
import { RootStaking } from "./StakingApp";

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const SectionWrapper = ({ children }: { children: JSX.Element }) => {
  const { sidebar } = useContext(NavContext);

  return (
    <div className={classNames(sidebar ? "lg:pl-56" : "lg:pl-24")}>
      {children}
    </div>
  );
};

const InjectTheme = ({ children }: { children: JSX.Element }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Grommet theme={globalTheme} themeMode={theme as "dark" | "light"}>
      <>{children}</>
    </Grommet>
  );
};

const InjectUseReferrer = () => {
  useReferrer();
  return <></>;
};

function AppDev() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactManager>
        <ApolloProvider client={stakingClient}>
          <ThemeProvider>
            <InjectTheme>
              <ModalsState>
                <ModalsCreatedApp />
                <RootStaking />
              </ModalsState>
            </InjectTheme>
          </ThemeProvider>
        </ApolloProvider>
      </Web3ReactManager>
    </Web3ReactProvider>
  );
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Web3ReactManager>
        <ThemeProvider>
          <NavProvider>
            <PresaleProvider>
              <Router>
                <InjectUseReferrer />
                {/* root route */}
                <Route exact path="/">
                  <Redirect to="/presale" />
                </Route>
                <Nav />
                <main className="flex flex-col h-screen">
                  <Route
                    path="/(presale|vesting)"
                    render={props => {
                      const url = props.match.url;
                      const isPresale = url === "/presale";
                      return (
                        <section
                          className={classNames(
                            "w-full transform-all duration-200 px-4 flex flex-col",
                          )}
                        >
                          <SectionWrapper>
                            <>
                              <Header />
                              <Filter
                                title={isPresale ? "Presale" : "Vesting"}
                              />
                              <div className="inset-x-0 -mx-4 top-0 pb-3 border-b-2 shadow-md transform-all duration-200  lg:border-gray-300 dark:border-gray-500 dark:bg-black dark:text-gray-300"></div>
                              <Results isPresale={isPresale} />
                            </>
                          </SectionWrapper>
                        </section>
                      );
                    }}
                  ></Route>
                  <Footer />
                </main>
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                />
              </Router>
            </PresaleProvider>
          </NavProvider>
        </ThemeProvider>
      </Web3ReactManager>
    </Web3ReactProvider>
  );
}

export { AppDev as App };
