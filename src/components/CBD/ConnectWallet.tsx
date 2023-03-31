import React from "react";
import { useState } from "react";

function ConnectWallet({ account, isLoading, connectWallet, disconnectWallet }: any){
    return(!account?
            <button className="btn btn-secondary site-head-right-btn" onClick={connectWallet}>
              {isLoading? "Connecting..." : "Connect Wallet"}
            </button>:
            <button className="btn btn-secondary site-head-right-btn" onClick={disconnectWallet}>
            Disconnect
            </button>
    )
}
export default ConnectWallet;