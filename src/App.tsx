import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import { useState } from "react";
import { DAppProvider, Config, useEthers } from "@usedapp/core";
import CBDHeader from "./components/CBD/CBDHeader";
import Owners from './components/Owner/Owners';
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
  const [decryptedMessages, setDecryptedMessages] = useState([]);
  const [isBob, setIsBob] = useState<boolean>(false);
  const [isCharlie, setIsCharlie] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");
  const [groups, setGroups] = useState<any>([]);

  const value = {
    isBob,
    isCharlie,
    msg,
    activateBrowserWallet,
    account
  }

  function alicePost(msg: string, isBob: boolean, isCharlie: boolean){
    setIsBob(isBob);
    setIsCharlie(isCharlie);
    setMsg(msg);
  }

  function con(){
    deactivate();
    activateBrowserWallet();
  }

  function createNewGroup(group: any){
    setGroups([...groups, group]);
  }

  return (<AppContext.Provider value={value}>
    <div>
      <Header account={account} connectWallet={con} disconnectWallet={disconnect} />
      <div>
        <div className="blog-header">
          <h1>Demo</h1>
        </div>
        <div className='row'>
          <Groups account={account} createNewGroup={createNewGroup} groups={groups} setGroups={setGroups}/>
        </div>
        <div className='row'>
          <Messages account={account} groups={groups}/>
        </div>
        {/* <Owners
        alicePost={alicePost}
        account={account}
        decryptedMessages={decryptedMessages}
        connectWallet={con}
        disconnectWallet={deactivate}
        /> */}
      </div>
    </div>
    </AppContext.Provider>);
}

export default App;
