import type { DeployedStrategy, PolicyMessageKit } from "@nucypher/nucypher-ts";
import { privateDecrypt } from "crypto";
import { providers } from "ethers";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import CFragsResult from "./CfragsResult";
import ClipBoardCopy from "./ClipBoardCopy";
import ErrorsResult from "./ErrorsResult";

function Message({ account, group, index, isReset, setIsReset}: any){
    const [decryptMsg, setDecryptMsg] = useState("");
    const [decryptedPrivateKey, setDecryptedPrivateKey] = useState("");
    const [error, setError] = useState("");
    const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
    const [encryptedKeyShort, setEncryptedKeyShort] = useState("");
    const [encryptedMsgShort, setEncryptedMsgShort] = useState("");
    const [encryptedKeyFull, setEncryptedKeyFull] = useState("");
    const [encryptedMsgFull, setEncryptedMsgFull] = useState("");
    const [result, setResult] = useState<any>(null);
    const [showResult, setShowResult] = useState<boolean>(true);
    const [showError, setShowError] = useState<boolean>(true);
    const [showClipboard, setShowClipboard] = useState<boolean>(true);

    useEffect(() => {
        const prvtKey = group.encryptedMessages[index].encryptedPrivateKey;
        const msg = cipherText(prvtKey);
        setEncryptedKeyFull(msg);
        setEncryptedKeyShort(`${msg.slice(0, 10)}...`);

        const encrMsg = group.encryptedMessages[index].encryptedMessage.toString("base64");
        setEncryptedMsgFull(encrMsg);
        setEncryptedMsgShort(`${encrMsg.slice(0, 10)}...`);
    },[group])

    useEffect(() => {
        if(isReset === true) {
            setDecryptedPrivateKey("");
            setDecryptMsg("");
            setError("");
            setIsDecrypting(false);
            setIsReset(false);
        }
    }, [isReset])

    async function handleDecrypt(group: any, index: number){
        setError("");
        setDecryptMsg("");
        setIsDecrypting(true);
        try{
            const depStrategy = group.strategy as DeployedStrategy;
            if (!group.strategy.decrypter) return;
    
            let originalPrivateKey: string = "";
            const web3Provider = new providers.Web3Provider(window.ethereum);
            const decrypter = depStrategy.decrypter;
    
            const conditionContext = group.conditionSet.buildContext(web3Provider);
            const retrievedMessages = await decrypter.retrieve(
                [group.encryptedMessages[index].encryptedPrivateKey],
                conditionContext
            );
            const decryptedMessages = retrievedMessages.map(
                (mk: PolicyMessageKit) => {
                console.log(mk);
                if (mk.isDecryptableByReceiver()) {
                    const decryptedMessage = decrypter.decrypt(mk);
                    const decoded = new TextDecoder().decode(decryptedMessage);
                    originalPrivateKey = JSON.parse(decoded);
                }
    
                if (Object.values(mk.errors).length > 0) {
                    setResult(mk.errors);
                    setError(Object.entries(mk.errors)[0][1]);
                    Object.entries(mk.errors).map(([address, error]) =>
                    console.log(
                        `Subscription message: ${address} - ${error}`
                    ));
                } else {
                    const res = (mk as any).result.cFrags;
                    setResult(res);
                }
            });
            setDecryptedPrivateKey(originalPrivateKey);
            setIsDecrypting(false);
        }
        catch(e: any) {
            console.log(e);
            setError(e.toString());
            setIsDecrypting(false);
        }
    }

    function handleDecryptMessage () {
        if(decryptedPrivateKey) {
            const encrMsg = group.encryptedMessages[index].encryptedMessage;
            const decr = privateDecrypt(decryptedPrivateKey, encrMsg);
            setDecryptMsg(decr.toString());
        }
    }
    ``
    function cipherText (encMsg: any){
        if(encMsg){
            const encodedEncryptedMessage = Buffer.from(
                encMsg.toBytes()
            ).toString("base64");
            return encodedEncryptedMessage;
        }
        return "";
    }

    const renderTooltipKey = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
          {encryptedKeyFull}
        </Tooltip>
    );

    const renderTooltipMsg = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
          {encryptedMsgFull}
        </Tooltip>
    );

    function handleClose(){
        setShowResult(!showResult);
    }
    function handleCloseError(){
        setShowError(!showError);
    }

    function handleCloseClipboard(){
        setShowClipboard(!showClipboard);
    }

    function showPopup(){
        setShowResult(true);
        setShowError(true);
    }

    function showPopupClip(){
        setShowClipboard(true);
    }

    const popoverClipboard = () => {
        return (<ClipBoardCopy show={showClipboard} msg={decryptedPrivateKey} handleClose={handleCloseClipboard}/>)
    }

    const popoverLeftResult = () => {
        return (<CFragsResult show={showResult} result={result} handleClose={handleClose}/>)
    }

    const popoverLeftError = () => {
        return (<ErrorsResult show={showError} result={result} handleClose={handleCloseError}/>)
    }
    return(<tr key={index}>
            <td>{group.name}</td>
            <td>{group.sender.name}</td>
            <td className="text-wrap">
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltipKey}>
                    <Button variant="link">
                    {encryptedKeyShort!= "" && encryptedKeyShort.length>0 && encryptedKeyShort}
                    </Button>
                </OverlayTrigger>
            </td>
            <td>
                <button type="button" onClick={()=> handleDecrypt(group, index)} className="btn btn-link">
                   {isDecrypting? "Decrypting..." : "Decrypt"}
                </button>
                {/* {(decryptedPrivateKey.length > 0) && <OverlayTrigger trigger="click" placement="top" overlay={popoverLeftResult}>
                    <Button variant="link" onClick={showPopup}>
                        {decryptedPrivateKey.length > 0 && decryptedPrivateKey}
                    </Button>
                </OverlayTrigger>} */}
               {decryptedPrivateKey.length > 0 && <OverlayTrigger trigger="click" placement="top" overlay={popoverClipboard}>
                    <Button variant="link" onClick={showPopupClip}>
                        Copy To Clipboard
                    </Button>
                </OverlayTrigger>}
                {(error.length > 0) && <OverlayTrigger trigger="click" placement="top" overlay={popoverLeftError}>
                    <Button variant="link" onClick={showPopup}>
                        {error != "" && error}
                    </Button>
                </OverlayTrigger>}
            </td>
            <td>
                <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltipMsg}>
                    <Button variant="link">
                    {encryptedMsgShort!= "" && encryptedMsgShort.length>0 && encryptedMsgShort}
                    </Button>
                </OverlayTrigger>
            </td>
            <td>
                <button type="button" disabled={decryptedPrivateKey.length === 0} onClick={()=> handleDecryptMessage()} className="btn btn-link">
                   {isDecrypting? "Decrypting..." : "Decrypt Message"}
                </button>
                {decryptMsg!= "" && decryptMsg}
            </td>
        </tr>)
}

export default Message;