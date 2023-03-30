import React, { useState } from "react";
import CreateGroup from "./CreateGroup";
import Post from "./Post";
import { providers } from "ethers";
import { Cohort, DeployedStrategy, Enrico, MessageKit, Alice, Strategy, Configuration } from "@nucypher/nucypher-ts";
import { Mumbai, useEthers } from "@usedapp/core";
import { Conditions, ConditionSet } from "@nucypher/nucypher-ts";

import { CONTRACT_ADDRESS, getGroupIdFromChain } from "../../contracts/contractHelper";
import { USER_ADDRESS } from "./constant";
import { getPublicPrivateKeyPair } from "../../contracts/keyPairHelper";
import { privateDecrypt, publicEncrypt } from "crypto";

function Groups({ account, groups, setGroups, createNewGroup}: any){
    const [show, setShow] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const [selGroup, setSelGroup] = useState<any>("null");
    const { switchNetwork } = useEthers();
    const [isGroupCreating, setIsGroupCreating] = useState<boolean>(false);
    const [groupId, setGroupId] = useState("");

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


    function getMembersList(members: any[]){
        const names = members.map(m=> m.name).join();
        return names.toString().substring(0, names.length);
    }

    function shortenKey(str: string){
        return `${str.slice(0, 10)}...`
    }

    function getRow(group: any, index: number) {
        const mems = getMembersList(group.members);
        return(<tr key={index}>
            <td>
                {group.id}
            </td>
            <td>{group.name}</td>
            <td>{group.sender.name}</td>
            <td>
                {mems}
            </td>
            <td>{group.encryptingKey}</td>
            <td>{group.messageEncryptionKey && shortenKey(group.messageEncryptionKey.split('\n')[1])}</td>
            <td>
                <button disabled={account != group.sender.address} type="button" className="btn btn-link">Edit</button>
            </td>
            <td>
                <button type="button" onClick={() => openCreatePost(group)} className="btn btn-link">Post</button>
            </td>
        </tr>)
    }
    
    function openCreateGroup(){
        setShow(!show);
    }

    function handleClose(){
        setShow(!show);
    }

    async function createNew(name: string, members: any[], threshold: number, shares: number) {
        setShow(!show);
        setIsGroupCreating(true);
        const cohortConfig = {
            threshold,
            shares,
            porterUri: "https://porter-tapir.nucypher.community",
        };

        await switchNetwork(Mumbai.chainId);
        const web3Provider = new providers.Web3Provider(window.ethereum);

        const cohort = await Cohort.create(cohortConfig);
        const strategy = Strategy.create(cohort);

        const deployedStrategy: DeployedStrategy = await strategy.deploy(
            name,
            web3Provider
        );
        const txData = await getGroupIdFromChain(account, members.map(m => m.address));
        const chainGroupId = txData?.events?.GroupCreated?.returnValues.groupId;

        const encryptingKey = Buffer.from(
            deployedStrategy.encrypter.policyEncryptingKey.toBytes()
        ).toString("base64");
        const verifyingKey = Buffer.from(
            deployedStrategy.encrypter.verifyingKey.toBytes()
        ).toString("base64");

        console.log(encryptingKey);
        console.log(verifyingKey);
        const group = {
            id: chainGroupId,
            strategy: deployedStrategy,
            name,
            sender: {name: USER_ADDRESS[account], address: account},
            members,
            messages: [],
            encryptedMessages: [],
            conditionSet: null,
            encryptingKey: encryptingKey,
        };
        setGroupId(chainGroupId);
        createNewGroup(group);
        setIsGroupCreating(false);
    }

    function createNewPost(group: any, message: string, isKeyRotate: boolean){
        setShowPost(!showPost);
        let publicKey: any, privateKey: any;
        if ((group.messages && group.messages.length === 0) || isKeyRotate === true) {
            const keyPair = getPublicPrivateKeyPair();
            publicKey = keyPair.public;
            privateKey = keyPair.private;
            group.messageEncryptionKey = publicKey;
        }
        encrypt(group, group.strategy, message, publicKey, privateKey);
        
        const newGroups = groups.map((g: any) => {
            if(g.id === group.id) {
                g.messages = [...g.messages, message];
            }
            return g;
        })
        setGroups(newGroups);
    }

    const encrypt = (group: any, depStrategy: DeployedStrategy, msg: string, publicKey: any, privateKey: any) => {
        if (!depStrategy?.encrypter) return;
    
        const encrypter = depStrategy.encrypter as Enrico;
        const encryptingKey = Buffer.from(
            encrypter.policyEncryptingKey.toBytes()
        ).toString("base64");
        console.log(encrypter);
        console.log(encryptingKey);
        const conditionSetBronze = new ConditionSet([
          new Conditions.Condition(buildERC721BalanceCondConfig(groupId)),
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
            encryptedMessage: encr
        };
        group.encryptedMessages = [...group.encryptedMessages, encryptedMessage];
        group.conditionSet = conditionSetBronze;
        return group;
    };

    function openCreatePost(group: any){
        setShowPost(!showPost);
        setSelGroup(group);
    }

    return(<div className="post-container">
        <div className="row">
            <div className="col-md-12">
                <div className="post-table-title-wrap">
                    <h3>Groups</h3>
                    <button className="btn btn-primary site-head-right-btn" disabled={!account || isGroupCreating} onClick={openCreateGroup}>
                        {isGroupCreating? "Creating Group...": "Create Group"}
                    </button>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-12">
            <table className="table">
                <thead>
                    <tr>
                        <th>
                            Id
                        </th>
                        <th>Name</th>
                        <th>Owner</th>
                        <th>Members</th>
                        <th>Group Encryption Key</th>
                        <th>Message Encryption Key</th>
                        <th>Edit</th>
                        <th>Post</th>
                    </tr>
                </thead>
                <tbody>
                    {groups.map((g: any,i: number) => getRow(g, i))}
                </tbody>
            </table>
            </div>
        </div>
        {show && <CreateGroup show={show} account={account} createNew={createNew} handleClose={handleClose} />}
        {showPost && <Post 
                    show={showPost} 
                    group={selGroup} 
                    account={account} 
                    createNewPost={createNewPost} 
                    handleClose={openCreatePost} />}
    </div>)
}

export default Groups;