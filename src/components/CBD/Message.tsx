import type { DeployedStrategy, PolicyMessageKit } from "@nucypher/nucypher-ts";
import { privateDecrypt } from "crypto";
import { providers } from "ethers";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button, OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import AcceptSecretKey from "./AcceptSecretKey";
import CFragsResult from "./CfragsResult";
import ClipBoardCopy from "./ClipBoardCopy";
import ErrorsResult from "./ErrorsResult";
var CopyToClipboard = require("react-copy-to-clipboard");

function Message({ account, group, index, isReset, setIsReset}: any){
    const [decryptMsg, setDecryptMsg] = useState("");
    const [decryptedPrivateKey, setDecryptedPrivateKey] = useState("");
    const [decryptedPrivateKeyShort, setDecryptedPrivateKeyShort] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [errorPost, setErrorPost] = useState<string | null>(null);
    const [isDecrypting, setIsDecrypting] = useState<boolean>(false);
    const [encryptedKeyShort, setEncryptedKeyShort] = useState("");
    const [encryptedMsgShort, setEncryptedMsgShort] = useState("");
    const [encryptedKeyFull, setEncryptedKeyFull] = useState("");
    const [encryptedMsgFull, setEncryptedMsgFull] = useState("");
    const [result, setResult] = useState<any>(null);
    const [showResult, setShowResult] = useState<boolean>(true);
    const [showError, setShowError] = useState<boolean>(true);
    const [showClipboard, setShowClipboard] = useState<boolean>(false);
    const [showDecrPopup, setShowDecrPopup] = useState<boolean>(false);
    const [isErrorPost, setIsErrorPost] = useState<boolean>(false);

    useEffect(() => {
        const prvtKey = group.encryptedMessages[index].encryptedPrivateKey;
        const msg = cipherText(prvtKey);
        setEncryptedKeyFull(msg);
        setEncryptedKeyShort(`${msg.slice(0, 20)}...`);

        const encrMsg = group.encryptedMessages[index].encryptedMessage.toString("base64");
        setEncryptedMsgFull(encrMsg);
        setEncryptedMsgShort(`${encrMsg.slice(0, 10)}...`);
    },[group])

    useEffect(() => {
        if(isReset === true) {
            setDecryptedPrivateKey("");
            setDecryptedPrivateKeyShort("");
            setDecryptMsg("");
            setError(null);
            setErrorPost(null);
            setIsDecrypting(false);
            setIsReset(false);
            setIsErrorPost(false)
        }
    }, [isReset])

    useEffect(() => {
        if (decryptedPrivateKey && decryptedPrivateKey!= "") {
            const lines = decryptedPrivateKey.split('\n');
            setDecryptedPrivateKeyShort(shortenString(lines[1]));
        }
    }, [decryptedPrivateKey]);

    function shortenString(str: string){
        return `${str.slice(0, 10)}...`
    }

    async function handleDecrypt(group: any, index: number){
        setError("");
        setDecryptMsg("");
        setIsDecrypting(true);
        setErrorPost("");
        setIsErrorPost(false);
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

    function handleDecryptMessage (secretkey: string) {
        if(secretkey) {
            const encrMsg = group.encryptedMessages[index].encryptedMessage;
            try{
                setIsErrorPost(false);
                const decr = privateDecrypt(secretkey, encrMsg);
                setDecryptMsg(decr.toString());
                setShowDecrPopup(false);
            } catch(e) {
                setShowDecrPopup(false);
                setIsErrorPost(true);
                setDecryptMsg("Unable to decrypt.");
            }
        }
    }
    function showDecryptMessagePopup (){
        setShowDecrPopup(!showDecrPopup);
    }

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
        setShowClipboard(!showClipboard);
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
            <td>{group.encryptedMessages[index]?.sender && group.encryptedMessages[index].sender.name}</td>
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
                {decryptedPrivateKeyShort.length === 0 && <button type="button" onClick={()=> handleDecrypt(group, index)} className="btn btn-link">
                   {isDecrypting? "Decrypting..." : "Decrypt"}
                </button>}
                {(decryptedPrivateKeyShort.length > 0) && <OverlayTrigger trigger="click" placement="top" overlay={popoverLeftResult}>
                    <Button variant="link" onClick={showPopup}>
                        {decryptedPrivateKeyShort.length > 0 && decryptedPrivateKeyShort}
                    </Button>
                </OverlayTrigger>}
               {decryptedPrivateKey.length > 0 && <OverlayTrigger trigger="click" placement="top" overlay={popoverClipboard}>
                    <CopyToClipboard text={decryptedPrivateKey}>
                    <Button variant="link" onClick={showPopupClip}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                    </svg>
                    </Button>
                    </CopyToClipboard>
                </OverlayTrigger>}
                {(error && error?.length > 0) && <OverlayTrigger trigger="click" placement="top" overlay={popoverLeftError}>
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
                {isErrorPost === true && <label className="text-danger">{ errorPost }</label>}
                {(decryptMsg == "" || isErrorPost) && <button type="button" disabled={decryptedPrivateKey.length === 0} onClick={()=> showDecryptMessagePopup()} className="btn btn-link">
                   {isDecrypting? "Decrypting..." : "Decrypt Message"}
                </button>}
                {decryptMsg!= "" && decryptMsg}
                {showDecrPopup && <AcceptSecretKey handleClose={showDecryptMessagePopup} show={showDecrPopup} handleDecryptMessage={handleDecryptMessage} />}
            </td>
        </tr>)
}

export default Message;