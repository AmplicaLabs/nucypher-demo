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
            <h3>{account ? <OverlayTrigger
              placement="bottom"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <Button variant="link">{(getAccountName(account) +" : " + shortenAddress(account))} </Button>
            </OverlayTrigger>: "Not Connected"}
            </h3>
          </div>                         
          <ConnectWallet account={account} disconnectWallet={disconnectWallet} connectWallet={connectWallet} />
    </div>)
}
export default Header;