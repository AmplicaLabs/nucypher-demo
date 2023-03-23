import type { PolicyMessageKit } from "@nucypher/nucypher-ts";
import { providers } from "ethers";
import React, { useEffect } from "react";
import { useState } from "react";

function Message({ account, group, index, isReset, setIsReset}: any){

    const [decryptMsg, setDecryptMsg] = useState("");
    const [error, setError] = useState("");
    const [isDecrypting, setIsDecrypting] = useState<boolean>(false);

    useEffect(() => {
        if(isReset === true) {
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
            const depStrategy = group.strategy;
            if (!group.strategy.decrypter) return;
    
            let originalMsg: string = "";
            const web3Provider = new providers.Web3Provider(window.ethereum);
            const decrypter = depStrategy.decrypter;
    
            const conditionContext = group.conditionSet.buildContext(web3Provider);
            const retrievedMessages = await decrypter.retrieve(
                [group.encryptedMessages[index]],
                conditionContext
            );
            const decryptedMessages = retrievedMessages.map(
                (mk: PolicyMessageKit) => {
                if (mk.isDecryptableByReceiver()) {
                    const decryptedMessage = decrypter.decrypt(mk);
                    const decoded = new TextDecoder().decode(decryptedMessage);
                    originalMsg = JSON.parse(decoded);
                }
    
                if (Object.values(mk.errors).length > 0) {
                    Object.entries(mk.errors).map(([address, error]) =>
                    console.log(
                        `Subscription message: ${address} - ${error}`
                    ));
                }
                }
            );
            setDecryptMsg(originalMsg);
            setIsDecrypting(false);
        }
        catch(e: any) {
            console.log(e);
            setError(e.toString());
            setIsDecrypting(false);
        }
        
    }
    return(<tr key={index}>
            <td>{group.name}</td>
            <td>{group.sender.name}</td>
            <td>{ group.encryptedMessages[index]?.ptr}</td>
            <td>
                <button type="button" onClick={()=> handleDecrypt(group, index)} className="btn btn-link">
                   {isDecrypting? "Decrypting..." : "Decrypt"}
                </button><br/>
                {decryptMsg != "" && <label className="col-form-label"><b><i>{decryptMsg}</i></b></label>}
                {error != "" && <label className="col-form-label text-danger">{error}</label>}
            </td>
        </tr>)
}

export default Message;