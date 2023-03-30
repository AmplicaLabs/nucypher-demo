import { Mumbai } from "@usedapp/core";
import React, { useContext, useEffect, useState } from "react";
import { Conditions, ConditionSet } from "@nucypher/nucypher-ts";
import { AppContext } from "../../contexts/AppContext";
import OwnerAlice from "./OwnerAlice";
import OwnerCharlie from "./OwnerCharlie";
import { CONTRACT_ADDRESS } from "../../contracts/contractHelper";

function Owners({ connectWallet }: any) {
    const [depStrategy, setDepStrategy] = useState<any>("null");
    const [depStrategyStatus, setDepStrategyStatus] = useState("not deployed");
    const [encryptedMessages, setEncryptedMessages] = useState<any[]>([]);
    const [conditionSets, setConditionSets] = useState<any[]>([]);
    const [groupId, setGroupId] = useState("");

    const { 
        account,
    } = useContext(AppContext);

    useEffect(()=>{
        let savedSt = localStorage.getItem("Strategy");
        if(savedSt){
            setDepStrategy(savedSt);
            setDepStrategyStatus('Deployed '+ savedSt);
        }
    },[]);

    useEffect(()=>{
        if(depStrategy!= "null") {
            localStorage.setItem("Strategy", depStrategy);
        }
    },[depStrategy]);

    const buildERC721BalanceCondConfig = (balance: number) => {
        const config = {
          contractAddress: CONTRACT_ADDRESS,
          standardContractType: "ERC721",
          chain: Mumbai.chainId,
          method: "isMember",
          parameters: [":groupId"],
          returnValueTest: {
            comparator: "==",
            value: groupId,
          },
        };
        return config;
      };
    
      const encrypt = (msg: string, isBob: boolean, isCharlie: boolean) => {
        if (!depStrategy.encrypter) return;
    
        setConditionSets([]);
        setEncryptedMessages([]);
    
        const encrypter = depStrategy.encrypter;
    
        const conditionSetBronze = new ConditionSet([
          new Conditions.Condition(buildERC721BalanceCondConfig(0)),
        ]);

        // const conditionSetSilver = new ConditionSet([
        //   new Conditions.Condition(buildERC721BalanceCondConfig(2)),
        // ]);
        // const conditionSetGold = new ConditionSet([
        //   new Conditions.Condition(buildERC721BalanceCondConfig(3)),
        // ]);
    
        const encryptedBronze = encrypter.encryptMessage(
          JSON.stringify(msg),
          conditionSetBronze
        );
        // const encryptedSilver = encrypter.encryptMessage(
        //     JSON.stringify(msg),
        //     conditionSetSilver
        // );

        // const encryptedGold = encrypter.encryptMessage(
        //     JSON.stringify(msg),
        //     conditionSetGold
        // );      
    
        setConditionSets([
          conditionSetBronze,
          conditionSetBronze,
        ]);
        setEncryptedMessages([encryptedBronze]);
      };

    return (
        <div className="posts-container">
          <OwnerAlice 
          alicePost={encrypt} 
          setDepStrategy={setDepStrategy} 
          setStratDeploying={setDepStrategyStatus} 
          account={account} 
          connectWallet={connectWallet}
          isStrategyDeployed={depStrategy!= "null"}
          setGroupId={setGroupId}
          />
          <OwnerCharlie
          ownerName={'Bob'}
          depStrategy={depStrategy}
          conditionSets={conditionSets}
          encryptedMessages={encryptedMessages}
          account={account}
          connectWallet={connectWallet}
          />
          <OwnerCharlie
          ownerName={'Charlie'}
          depStrategy={depStrategy}
          conditionSets={conditionSets}
          encryptedMessages={encryptedMessages}
          account={account}
          connectWallet={connectWallet}
          />
        </div>
      );
}

export default Owners;