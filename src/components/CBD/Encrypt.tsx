import React from "react";
import { Mumbai } from "@usedapp/core";
import { Conditions, ConditionSet } from "@nucypher/nucypher-ts";
import {
  silverBlogPosts,
  bronzeBlogPosts,
  goldBlogPosts,
} from "../Blog/BlogData";

function Encrypt({ depStrategy, setConditionSets, setEncryptedMessages }: any) {
  
  // const buildERC721BalanceCondConfig = (balance: number) => {
  //   const config = {
  //     contractAddress: "0xf5de760f2e916647fd766B4AD9E85ff943cE3A2b",
  //     standardContractType: "ERC721",
  //     chain: Mumbai.chainId,
  //     method: "balanceOf",
  //     parameters: [":userAddress"],
  //     returnValueTest: {
  //       comparator: ">=",
  //       value: balance,
  //     },
  //   };
  //   return config;
  // };

  const buildERC721BalanceCondConfig = (balance: number) => {
   const config = {
    contractAddress: '0xb4f48E123De3f87fCb3636F8E20A34797DbBf8Ad',
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

  const encrypt = () => {
    if (!depStrategy.encrypter) return;

    setConditionSets([]);
    setEncryptedMessages([]);

    const encrypter = depStrategy.encrypter;

    const conditionSetBronze = new ConditionSet([
      new Conditions.Condition(buildERC721BalanceCondConfig(0)),
    ]);
    const conditionSetSilver = new ConditionSet([
      new Conditions.Condition(buildERC721BalanceCondConfig(2)),
    ]);
    const conditionSetGold = new ConditionSet([
      new Conditions.Condition(buildERC721BalanceCondConfig(3)),
    ]);

    const encryptedBronze = encrypter.encryptMessage(
      JSON.stringify(bronzeBlogPosts),
      conditionSetBronze
    );
    const encryptedSilver = encrypter.encryptMessage(
      JSON.stringify(silverBlogPosts),
      conditionSetSilver
    );
    const encryptedGold = encrypter.encryptMessage(
      JSON.stringify(goldBlogPosts),
      conditionSetGold
    );

    setConditionSets([
      conditionSetBronze,
      conditionSetSilver,
      conditionSetGold,
    ]);
    setEncryptedMessages([encryptedBronze, encryptedSilver, encryptedGold]);
  };

  return (
    <button className="cbd-button" onClick={encrypt}>
      Step 3. Encrypt posts
    </button>
  );
}

export default Encrypt;
