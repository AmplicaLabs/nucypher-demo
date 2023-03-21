import React from "react";
import { Button } from "react-bootstrap";
import { CONTRACT_ADDRESS, createGroup } from "../../contracts/contractHelper";
import ConnectWallet from "./ConnectWallet";
import { USER_ADDRESS } from "./constant";

function Header({account, disconnectWallet, connectWallet}: any){

    function getAccountName(address: string){
        const name = USER_ADDRESS[address];
        return name;
    }

    function shortenAddress(address: string | undefined) {
        if (address && address.length === 42) {
          return `${address.slice(0, 5)}...${address.slice(38)}`;
        }
        return "not connected";
    }

    async function handleNewGroup() {
        await createGroup(["0xF2D4ee677f31e62c6a78F229A572F67289161Bdc", "0x32AA13b0F477cd3f0620CaD3516E1725B1E66c81"]);
    }

    return(<div className="column">
        <div style={{ textAlign: "right" }}>
        <span>
            Account: 
            {!account ? <ConnectWallet disconnectWallet={disconnectWallet} connectWallet={connectWallet} />:
                <b>{account? (getAccountName(account) +" : " + shortenAddress(account)): "Not connected"} </b>
            }
        </span>
        <Button variant="primary" onClick={() => handleNewGroup()}>
            Test Ethereum Contract
        </Button>
      </div>
    </div>)
}
export default Header;