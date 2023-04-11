import React, { useEffect, useState } from "react";
import CreateGroup from "./CreateGroup";
import Post from "./Post";
import { providers } from "ethers";
import { Cohort, DeployedStrategy, Strategy } from "@nucypher/nucypher-ts";
import { Mumbai, useEthers } from "@usedapp/core";
import { getGroupIdFromChain, getShortString, shortenKey } from "../../contracts/contractHelper";
import { USER_ADDRESS } from "./constants";

function Groups({ account, groups, setGroups, createNewGroup}: any){
    const [show, setShow] = useState(false);
    const [showPost, setShowPost] = useState(false);
    const [selGroup, setSelGroup] = useState<any>("null");
    const { switchNetwork } = useEthers();
    const [isGroupCreating, setIsGroupCreating] = useState<boolean>(false);
    const [ursulaAddresses, setUrsulaAddresses] = useState<string[]>(["0xF2D4ee677f31e62c6a78F229A572F67289161Bdc", "0xF2D4ee677f31e62c6a78F229A572F67289161Bdc"]);
    const [doneStatuses, setDoneStatuses] = useState<boolean[]>([false, false, false]);

    useEffect(()=>{
        if (isGroupCreating === false) {
            //setDoneStatuses([false, false, false]);
            setUrsulaAddresses([]);
        }
    },[isGroupCreating])

    function getMembersList(members: any[]){
        const names = members.map(m=> m.name).join();
        return names.toString().substring(0, names.length);
    }
    
    function openCreateGroup(){
        setShow(!show);
    }

    function handleClose(){
        setShow(!show);
    }

    async function createNew(name: string, members: any[], threshold: number, shares: number) {
        setIsGroupCreating(true);
        setDoneStatuses([true, false, false]);
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
        setUrsulaAddresses(deployedStrategy.cohort.ursulaAddresses);
        setDoneStatuses([true, true, false]);
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
        createNewGroup(group);
        setIsGroupCreating(false);
        setDoneStatuses([true, true, true]);
        //setShow(!show);
    }

    function openCreatePost(group: any){
        setShowPost(!showPost);
        setSelGroup(group);
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
            <td>{getShortString(group.encryptingKey)}</td>
            <td>{group.messageEncryptionKey && shortenKey(group.messageEncryptionKey)}</td>
            <td>
                <button disabled={account != group.sender.address} type="button" className="btn btn-link">Edit</button>
            </td>
            <td>
                <button type="button" onClick={() => openCreatePost(group)} className="btn btn-link">Post</button>
            </td>
        </tr>)
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
        {show && <CreateGroup 
                    show={show} 
                    account={account} 
                    createNew={createNew}
                    handleClose={handleClose}
                    ursulaAddresses={ursulaAddresses}
                    doneStatuses={doneStatuses}
                    isGroupCreating={isGroupCreating} />}
        {showPost && <Post
                    groups={groups}
                    show={showPost} 
                    group={selGroup} 
                    account={account}
                    updateGroups={setGroups}
                    handleClose={openCreatePost} />}
    </div>)
}

export default Groups;