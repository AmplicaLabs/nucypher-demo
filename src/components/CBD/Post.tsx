import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ArrowRepeat, CheckCircleFill, Circle } from 'react-bootstrap-icons';
import { getPublicPrivateKeyPair } from "../../contracts/keyPairHelper";
import { ConditionSet, Conditions, DeployedStrategy, Enrico, MessageKit } from "@nucypher/nucypher-ts";
import { publicEncrypt, privateDecrypt } from "crypto";
import { CONTRACT_ADDRESS, getAccountName } from "../../contracts/contractHelper";
import { POST_CREATING, POST_ENCRYPTING_MSG, POST_GENERATING_PAIR } from "./constants";
import { Mumbai } from "@usedapp/core";
const groupCreateMessages = [POST_GENERATING_PAIR, POST_ENCRYPTING_MSG, POST_CREATING];

function Post({account, groups, group, show, handleClose, updateGroups }: any){
    const [msg, setMsg] = useState<string>("");
    const [isKeyRotate, setIsKeyRotate] = useState<boolean>(false);
    const [doneStatuses, setDoneStatuses] = useState<boolean[]>([false, false, false]);
    const [isGenMsgKeyPair, setIsGenMsgKeyPair] = useState<boolean>(true);

    useEffect(() => {
      if ((group.messages && group.messages.length === 0) || isKeyRotate === true) {
        setIsGenMsgKeyPair(true);
        setIsKeyRotate(true);
      } else {
        setIsGenMsgKeyPair(false);
      }
    }, [group]);

    useEffect(() => {
      if (isKeyRotate === false) {
        setIsGenMsgKeyPair(true);
      }
      if ((group.messages && group.messages.length === 0) || isKeyRotate === true) {
        setIsGenMsgKeyPair(true);
      } else {
        setIsGenMsgKeyPair(false);
      }
    }, [isKeyRotate]);

    const buildERC721BalanceCondConfig = (groupId: any) => {
      var grpId: number = +groupId;
      const config = {
       contractAddress: CONTRACT_ADDRESS,
       chain: Mumbai.chainId,
       method: 'isMember',
       parameters: [grpId, ':userAddress'],
       functionAbi: {
         "inputs": [
         {
             "internalType": "int32",
             "name": "groupId",
             "type": "int32"
         },
         {
             "internalType": "address",
             "name": "account",
             "type": "address"
         }
         ],
         "name": "isMember",
         "outputs": [
         {
             "internalType": "bool",
             "name": "",
             "type": "bool"
         }
         ],
         "stateMutability": "view",
         "type": "function"
       },
       returnValueTest: {
         comparator: '==',
         value: true,
       },
      };
      return config;
    };

    function handleKeyRotation(e: any) {
      setIsKeyRotate(e.target.checked);
    }

    function createNewPost(group: any, message: string, isKeyRotate: boolean){
      setDoneStatuses([true, false, false]);
      let publicKey: any, privateKey: any;
      if ((group.messages && group.messages.length === 0) || isKeyRotate === true) {
          const keyPair = getPublicPrivateKeyPair();
          publicKey = keyPair.public;
          privateKey = keyPair.private;
          group.messageEncryptionKey = publicKey;
          group.messagePrivateKey = privateKey;
      } else {
          const existingGrp = groups.find((g: any) => g.id === group.id);
          publicKey = existingGrp.messageEncryptionKey;
          privateKey = existingGrp.messagePrivateKey;
      }
      setDoneStatuses([true, true, false]);
      encrypt(account, group, group.strategy, message, publicKey, privateKey);
      
      const newGroups = groups.map((g: any) => {
          if(g.id === group.id) {
              g.messages = [...g.messages, message];
          }
          return g;
      })
      updateGroups(newGroups);
      setDoneStatuses([true, true, true]);
      setMsg("");
      setIsKeyRotate(false);
  }

  const encrypt = (account: string, group: any, depStrategy: DeployedStrategy, msg: string, publicKey: any, privateKey: any) => {
      if (!depStrategy?.encrypter) return;
  
      const encrypter = depStrategy.encrypter as Enrico;
      const encryptingKey = Buffer.from(
          encrypter.policyEncryptingKey.toBytes()
      ).toString("base64");
      console.log(encrypter);
      console.log(encryptingKey);
      const conditionSetBronze = new ConditionSet([
        new Conditions.Condition(buildERC721BalanceCondConfig(group.id)),
      ]);
      const encr = publicEncrypt(publicKey, Buffer.from(msg));
      const decr = privateDecrypt(privateKey, encr);
      console.log(encr.toString("base64"));
      console.log(decr.toString());
      const encrPrivateKit: MessageKit =  encrypter.encryptMessage(
          JSON.stringify(privateKey),
          conditionSetBronze
      );
      const encryptedMessage = {
          encryptedPrivateKey: encrPrivateKit,
          encryptedMessage: encr,
          sender: {
              name: getAccountName(account),
              address: account
          }
      };
      group.encryptedMessages = [...group.encryptedMessages, encryptedMessage];
      group.conditionSet = conditionSetBronze;
      return group;
  };
  return(<Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <div className="form">
          <div className="form-group row">
            <label htmlFor="groupName" className="col-sm-4 col-form-label">Group Name:</label>
            <div className="col-sm-8">
              <label className="col-form-label" >{group.name}</label>
            </div>
          </div>
          <div className="form-group row">
              <label htmlFor="name" className="col-sm-4 col-form-label">Message:</label>
              <div className="col-sm-8">
                  <textarea maxLength={50} required className="form-control" id="name" name="name" value={msg} 
                  onChange={(e) => setMsg(e.target.value)} />
              </div>
          </div>
          <div className="input-group row">
              <label htmlFor="keyrotation" className="col-sm-4 col-form-label">
                Rotate Key <b><ArrowRepeat className="text-success"></ArrowRepeat></b>:
              </label>
              <div className="col-sm-8">
                <input 
                  className="form-check-input"
                  style={{ marginTop: '10px', marginLeft: '10px'}}
                  type="checkbox" 
                  id="keyrotation"
                  name="keyrotation"
                  value="false" 
                  onChange={(e) => handleKeyRotation(e)}  
                  checked={isKeyRotate || isGenMsgKeyPair}/>
                  <label htmlFor="keyrotation">&#160;&#160;&#160;&#160;</label>
              </div>
          </div>
          <div className="form-group row create-group-custom-row">
            {groupCreateMessages.map((stMsg, i) =>{
                if (i === 0) {
                  if (isGenMsgKeyPair === false) {
                    return (<div key={i} className="create-group-cr_item_gray">
                        <CheckCircleFill className="text-success"></CheckCircleFill>
                      &#160;{stMsg}
                    </div>)
                  } else {
                    return (<div key={i} className="create-group-cr_item">
                    {doneStatuses[i] === true? 
                      <CheckCircleFill className="text-success"></CheckCircleFill>
                      :<Circle></Circle>}&#160;{stMsg}
                    </div>)
                  }
                } else {
                  return (<div key={i} className="create-group-cr_item">
                          {doneStatuses[i] === true? 
                              <CheckCircleFill className="text-success"></CheckCircleFill>
                              :<Circle></Circle>}&#160;{stMsg}
                      </div>)
                }
              })
            }
          </div>
      </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => createNewPost(group, msg, isKeyRotate)}>
          Post
        </Button>
      </Modal.Footer>
    </Modal>)
}

export default Post;
