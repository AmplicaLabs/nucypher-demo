import React, { useState } from "react";
import CreateGroup from "./CreateGroup";
import Post from "./Post";
import { providers } from "ethers";
import { Cohort, MessageKit, Strategy } from "@nucypher/nucypher-ts";
import { Mumbai, useEthers } from "@usedapp/core";
import { Conditions, ConditionSet } from "@nucypher/nucypher-ts";
import { CONTRACT_ADDRESS, getGroupIdFromChain } from "../../contracts/contractHelper";
import { USER_ADDRESS } from "./constant";

function Groups({ account, groups, setGroups, createNewGroup}: any){
    const [show, setShow] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const [selGroup, setSelGroup] = useState<any>("null");
    const { switchNetwork } = useEthers();
    const [isGroupCreating, setIsGroupCreating] = useState<boolean>(false);
    const [groupId, setGroupId] = useState("");
    
    // const buildERC721BalanceCondConfig = (grpId: any) => {
    //     const config = {
    //         contractAddress: CONTRACT_ADDRESS,
    //         standardContractType: "ERC721",
    //         chain: Mumbai.chainId,
    //         method: "isMember",
    //         parameters: [":groupId"],
    //         returnValueTest: {
    //             comparator: "==",
    //             value: grpId,
    //         },
    //     };
    //     return config;
    // };

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
            {/* <td>Encrypt key</td> */}
            <td>{group.encryptingKey}</td>
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

    async function createNew(name: string, members: any[]) {
        setShow(!show);
        setIsGroupCreating(true);
        const cohortConfig = {
            threshold: 3,
            shares: 5,
            porterUri: "https://porter-tapir.nucypher.community",
        };

        await switchNetwork(Mumbai.chainId);
        const web3Provider = new providers.Web3Provider(window.ethereum);

        const cohort = await Cohort.create(cohortConfig);
        const strategy = Strategy.create(cohort);

        const deployedStrategy = await strategy.deploy(
            name,
            web3Provider
        );
        
        const txData = await getGroupIdFromChain(account, members.map(m => m.address));
        const chainGroupId = txData?.events?.GroupCreated?.returnValues.groupId;
        console.log(deployedStrategy.encrypter.policyEncryptingKey.toString());
        console.log(deployedStrategy.encrypter.verifyingKey.toString());
        console.log(deployedStrategy.policy.aliceVerifyingKey.toString());
        console.log(deployedStrategy.policy.policyKey.toString());
        const group = {
            id: chainGroupId,
            strategy: deployedStrategy,
            name,
            sender: {name: USER_ADDRESS[account], address: account},
            members,
            messages: [],
            encryptedMessages: [],
            conditionSet: null,
            encryptingKey: deployedStrategy.encrypter.policyEncryptingKey.toString().split(":").pop()
        };
        console.log(group, account);
        setGroupId(chainGroupId);
        createNewGroup(group);
        setIsGroupCreating(false);
    }

    function createNewPost(group: any, message: string){
        setShowPost(!showPost);
        encrypt(group, group.strategy, message);

        const newGroups = groups.map((g: any) => {
            if(g.id === group.id) {
                g.messages = [...g.messages, message];
            }
            return g;
        })
        setGroups(newGroups);
    }

    const encrypt = (group: any, depStrategy: any, msg: string) => {
        if (!depStrategy?.encrypter) return;
    
        const encrypter = depStrategy.encrypter;
    
        const conditionSetBronze = new ConditionSet([
          new Conditions.Condition(buildERC721BalanceCondConfig(groupId)),
        ]);
        
        const encr: MessageKit =  encrypter.encryptMessage(
                JSON.stringify(msg),
                conditionSetBronze
        );
        group.encryptedMessages = [...group.encryptedMessages, encr];
        group.conditionSet = conditionSetBronze;
        console.log(group);
        return group;
    };

    function openCreatePost(group: any){
        setShowPost(!showPost);
        setSelGroup(group);
    }

    return(<div className="post-container">
        <div className="row">
            <div className="col-md-6">
                Groups&#160;&#160;
                <button className="btn btn-primary" disabled={!account || isGroupCreating} onClick={openCreateGroup}>
                   {isGroupCreating? "Creating Group...": "Create Group"}
                </button>
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
                        <th>Encryption Key</th>
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