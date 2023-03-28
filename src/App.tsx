import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { DAppProvider, Config, useEthers } from "@usedapp/core";
import { AppContext } from './contexts/AppContext';
import Header from './components/CBD/Header';
import Groups from './components/CBD/Groups';
import { disconnect } from 'process';
import Messages from './components/CBD/Messages';

const config: Config = {
  autoConnect: false,
};

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      <App />
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

function App() {
  const { activateBrowserWallet, deactivate, account } = useEthers();
  const [groups, setGroups] = useState<any>([]);
  const [isReset, setIsReset] = useState<boolean>(false);

  useEffect(() => {
    setIsReset(true);
  }, [account])
  const value = {
    activateBrowserWallet,
    account
  }

  function con(){
    deactivate();
    activateBrowserWallet();
  }

  function createNewGroup(group: any){
    setGroups([...groups, group]);
  }

  function disconnect(){
    deactivate();
  }
  return (<AppContext.Provider value={value}>
    <div>
      <div>
        <div className="site-header">
          <h1 className="site-head-title">Demo</h1>
          <Header account={account} connectWallet={con} disconnectWallet={disconnect} />
        </div>

        <div className='row'>
          <Groups account={account} createNewGroup={createNewGroup} groups={groups} setGroups={setGroups}/>
        </div>
        <div className='row'>
          <Messages account={account} isReset={isReset} setIsReset={setIsReset} groups={groups}/>
        </div>
      </div>
    </div>
    </AppContext.Provider>);
}

export default App;
