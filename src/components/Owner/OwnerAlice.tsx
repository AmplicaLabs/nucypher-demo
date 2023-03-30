import React, { useContext, useState } from "react";
import { AppContext } from "../../contexts/AppContext";
import ConnectWallet from "../CBD/ConnectWallet";
import StrategyBuilder from "../CBD/StrategyBuilder";
var imag = require('../../public/assets/Alice.png');

function OwnerAlice({ isStrategyDeployed, alicePost, connectWallet, disconnectWallet, setDepStrategy, setStratDeploying }: any) {
    const [msg, setMsg] = useState<string>("");
    
    const [isBob, setIsBob] = useState<boolean>(false);
    const [isCharlie, setIsCharlie] = useState<boolean>(false);
    const { 
      account,
  } = useContext(AppContext);

    function handleCharlieChange(){
      setIsCharlie(!isCharlie);
    }

    function handleBobChange(){
      setIsBob(!isBob);
    }
    
    function postMessage(e: any){
      alicePost(msg, isBob, isCharlie);
      resetState();
    }

    function resetState(){
      setMsg("");
      setIsBob(false);
      setIsCharlie(false);
    }

    function connect(){
      connectWallet();
    }

    function disconnect(){
      disconnectWallet();
    }

    return (
        <div className="post-container">
          <div className="row">
            <div className="p-2 justify-content-center">
              <img src={imag.default} width={50} height={50} alt="Alice" className="img-thumbnail" />
            </div>
            <div className="col-md-4 justify-content-center">
              <h5>Alice</h5>
              <ConnectWallet disconnectWallet={disconnectWallet} connectWallet={connectWallet} />
            </div>
            <StrategyBuilder
              account={account}
              isStrategyDeployed={isStrategyDeployed}
              setDepStrategy={setDepStrategy}
              setDepStrategyStatus={setStratDeploying}
            />
          </div>
          <div className="form-inline">
              <div className="form-group mx-sm-4 mb-6">
              <label htmlFor="message" className="label">Post a Message: </label>
              <textarea maxLength={50} required name="message" className="form-control"
              value={msg} onChange={(e) => setMsg(e.target.value)} />
            </div>
            <div className="form-group mx-sm-4 mb-6">
              <input type="checkbox" id="bob" name="bob" value="false" onChange={handleBobChange}  checked={isBob}/>
              <label htmlFor="bob">&#160;&#160;Bob&#160;&#160;</label><br/>
              <input type="checkbox" id="charlie" name="charlie" value="false" onChange={handleCharlieChange}  checked={isCharlie}/>
              <label htmlFor="charlie">&#160;&#160;Charlie</label><br/>
            </div>
            <div className="col-md-2">
              <button className="btn btn-secondary" onClick={postMessage}>
                Post message
              </button>
            </div>
          </div>
        </div>
      );
}

export default OwnerAlice;