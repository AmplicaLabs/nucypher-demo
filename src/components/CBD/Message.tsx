import type { PolicyMessageKit } from "@nucypher/nucypher-ts";
import { providers } from "ethers";
import React from "react";
import { useState } from "react";

function Message({ account, group, index}: any){

    const [decryptMsg, setDecryptMsg] = useState("");

    async function handleDecrypt(group: any, index: number){
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
                )
                );
            }
            }
        );
        setDecryptMsg(originalMsg);
    }
    return(<tr key={index}>
            <td>{group.name}</td>
            <td>Alice</td>
            <td>{ group.encryptedMessages[index]?.ptr}</td>
            <td>
                <button type="button" onClick={()=> handleDecrypt(group, index)} className="btn btn-link">Decrypt</button>
                {decryptMsg && <label className="col-form-label"><b><i>{decryptMsg}</i></b></label>}
            </td>
        </tr>)
}

export default Message;