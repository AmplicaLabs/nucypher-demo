import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { DAppProvider, Config, useEthers } from "@usedapp/core";
import { AppContext } from './contexts/AppContext';
import Header from './components/CBD/Header';
import Groups from './components/CBD/Groups';
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
  const { activateBrowserWallet, deactivate, account, isLoading } = useEthers();
  const [groups, setGroups] = useState<any>([]);
  const [isReset, setIsReset] = useState<boolean>(false);
  
  // useEffect(() => {
  //   const savedGrpObj = sessionStorage.getItem('Groups');
  //   if(savedGrpObj) {
  //     const savedGroups = JSON.parse(savedGrpObj);
  //     if (savedGroups && savedGroups.length > 0) {
  //       console.log(savedGroups);
  //       setGroups(savedGroups);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    setIsReset(true);
  }, [account]);

  // useEffect(() => {
  //   if(groups.length > 0) {
  //     sessionStorage.setItem('Groups', JSON.stringify(groups));
  //   }
  // }, [groups]);

  const value = {
    activateBrowserWallet,
    account
  }

  function connect(){
    console.log('connect')
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
          <Header account={account} connectWallet={connect} isLoading={isLoading} disconnectWallet={disconnect} />
        </div>

        <div className='site-data-table-row'>
          <Groups account={account} createNewGroup={createNewGroup} groups={groups} setGroups={setGroups}/>
        </div>

        <div className='site-data-table-row'>
          <Messages account={account} isReset={isReset} setIsReset={setIsReset} groups={groups}/>
        </div>
      </div>
    </div>
    </AppContext.Provider>);
}

export default App;
