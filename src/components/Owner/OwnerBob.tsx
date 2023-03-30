import React, { useState } from "react";
import ConnectWallet from "../CBD/ConnectWallet";
import Decrypt from "../CBD/Decrypt";
var imag = require('../../public/assets/Bob.png');
function OwnerBob({ 
  msg,
  depStrategy,
  conditionSets,
  encryptedMessages,
  setDecryptedMessages,
  account,
  connectWallet ,
  disconnectWallet,
}: any) {

  return (
    <div className="post-container">
    <div className="row">
      <div className="col-md-1">
        <div className="d-flex flex-column justify-content-center">
            <div className="p-2 justify-content-center">
              <img src={imag.default} width={50} height={50} alt="Bob" className="img-thumbnail" />
            </div>
            <div className="p-2 justify-content-center">
              <h5>Bob</h5>
            </div>
        </div>
      </div>
      <div className="col-md-2 align-left">
        <ConnectWallet disconnectWallet={disconnectWallet} connectWallet={connectWallet} />
      </div>
      <div className="col-md-2 align-left">
       <Decrypt 
       depStrategy={depStrategy}
       conditionSets={conditionSets}
       encryptedMessages={encryptedMessages}
       setDecryptedMessages={setDecryptedMessages} />
      </div>
    </div>
    <div className="row">
    <div className="col-md-6">
    {msg && msg !="" &&<div className="card">
      <div className="card-body">
        {msg}
      </div>
    </div>}
    </div>
    </div>
  </div>
  );
}

export default OwnerBob;