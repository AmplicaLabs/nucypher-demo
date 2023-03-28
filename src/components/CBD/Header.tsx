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
    return(<div className="column">
        <div style={{ textAlign: "right" }}>
        <span>
            <label className="col-form-label font-weight-bold">Account:&#160;</label>
            {!account ? <ConnectWallet disconnectWallet={disconnectWallet} connectWallet={connectWallet} />:
                <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
              >
                <Button variant="link" onClick={connectWallet}><b>{account? (getAccountName(account) +" : " + shortenAddress(account)): "Not connected"} </b></Button>
              </OverlayTrigger>
            }
        </span>
        {/* <Button variant="primary" onClick={() => handleNewGroup()}>
            Test Ethereum Contract
        </Button> */}
      </div>
    </div>)
}
export default Header;