import React, { useState } from "react";
import ConnectWallet from "../CBD/ConnectWallet";
import Decrypt from "../CBD/Decrypt";
var imag = require('../../public/assets/Charlie.png');

function OwnerCharlie({
  ownerName, 
  msg,
  depStrategy,
  conditionSets,
  encryptedMessages,
  account,
  connectWallet ,
  disconnectWallet
  } : any) {
    const [decryptedMessages, setDecryptedMessages] = useState([]);
    const [posts, setPosts] = useState([]);

    function decryptedMsg (msgs: any){
      if (msgs.length === 0) {
        return null;
      } else {
        setPosts(JSON.parse(msgs));
      }
    }
    return (
        <div className="post-container">
          <div className="row align-left">
            <div className="col-md-1">
              <div className="d-flex flex-column justify-content-center">
                <div className="p-2 justify-content-center">
                  <img src={require('../../public/assets/'+ ownerName +'.png').default} width={50} height={50} alt={ownerName} className="img-thumbnail" />
                </div>
                  <div className="p-2 justify-content-center">
                    <h5>{ownerName}</h5>
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
              setDecryptedMessages={decryptedMsg} />
            </div>
          </div>
          <div className="row align-left">
          <div className="col-md-6">
            <div className="card-body">
            {posts && posts.length > 0 && 
            <div className="card">
              {posts && posts.length > 0? posts[0]: encryptedMessages[0]}
            </div>}
          </div>

        </div>
      </div>
    </div>
  );
}

export default OwnerCharlie;