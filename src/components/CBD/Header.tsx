import React from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import ConnectWallet from "./ConnectWallet";
import { USER_ADDRESS } from "./constant";

function Header({account, disconnectWallet, connectWallet}: any){

    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
          {account}
        </Tooltip>
    );

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
    return(<div className="site-head-right-wrap"> 
          <div className="site-head-user-profile-wrap">
            <img src="https://placehold.jp/60x60.png" alt="" />
            <h3>John Doe</h3>
          </div>                         
          {!account ? <ConnectWallet disconnectWallet={disconnectWallet} connectWallet={connectWallet} />:
              <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <Button variant="link"><b>{account? (getAccountName(account) +" : " + shortenAddress(account)): "Not connected"} </b></Button>
            </OverlayTrigger>
          }
          
    </div>)
}
export default Header;