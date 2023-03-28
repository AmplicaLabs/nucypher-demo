import React from "react";
import { useState } from "react";

function ConnectWallet({ connectWallet, disconnectWallet }: any){
    const [isConnected, setIsConnected] = useState<boolean>(false);
    function connect(){
        connectWallet();
        setIsConnected(true);
      }
  
      function disconnect(){
        disconnectWallet();
        setIsConnected(false);
      }
    return(!isConnected?
            <button disabled={isConnected} className="btn btn-secondary site-head-right-btn" onClick={connect}>
            Connect Wallet
            </button>:
            <button disabled={!isConnected} className="btn btn-secondary site-head-right-btn" onClick={disconnect}>
            Disconnect
            </button>
    )
}
export default ConnectWallet;