import React, { useState } from "react";
import CreateGroup from "./CreateGroup";
import Post from "./Post";
import { providers } from "ethers";
import { Cohort, Strategy } from "@nucypher/nucypher-ts";
import { Mumbai, useEthers } from "@usedapp/core";
import { Conditions, ConditionSet } from "@nucypher/nucypher-ts";

function Groups({ account, groups, setGroups, createNewGroup}: any){
    const [show, setShow] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const [selGroup, setSelGroup] = useState<any>("null");
    const { switchNetwork } = useEthers();
    const [isGroupCreating, setIsGroupCreating] = useState<boolean>(false);
    // const buildERC721BalanceCondConfig = (balance: number) => {
    //     const config = {
    //       contractAddress: "0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b",
    //       standardContractType: "ERC721",
    //       chain: Mumbai.chainId,
    //       method: "balanceOf",
    //       parameters: [":userAddress"],
    //       returnValueTest: {
    //         comparator: ">=",
    //         value: balance,
    //       },
    //     };
    //     return config;
    //   };
      const buildERC721BalanceCondConfig = (balance: number) => {
        const config = {
         contractAddress: '0xb4f48E123De3f87fCb3636F8E20A34797DbBf8Ad',
         chain: Mumbai.chainId,
         method: 'isMember',
         parameters: [6, ':userAddress'],
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
    function getRow(group: any, index: number) {
        const mem = group.members.toString();
        return(<tr key={index}>
            <td>
                Id
            </td>
            <td>{group.name}</td>
            <td>{group.sender}</td>
            <td>
                {mem.substring(0, mem.length)}
            </td>
            <td>Encrypted Key</td>
            <td>
                <button type="button" className="btn btn-link">Edit</button>
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

    async function createNew(name: string, members: string[]) {
        setShow(!show);
        setIsGroupCreating(true);
        // setDepStrategyStatus("Deploying...");

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
        const id = groups.length + 1;
        const group = {
            id: id,
            strategy: deployedStrategy,
            name,
            sender: 'Alice',
            members,
            messages: [],
            encryptedMessages: [],
            conditionSet: null
        }
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
        console.log(depStrategy)
        if (!depStrategy?.encrypter) return;
    
        const encrypter = depStrategy.encrypter;
    
        const conditionSetBronze = new ConditionSet([
          new Conditions.Condition(buildERC721BalanceCondConfig(0)),
        ]);
        
        const encr =  encrypter.encryptMessage(
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
                        <th>Encrypted Key</th>
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