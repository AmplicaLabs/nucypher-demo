import { customABICondition } from "./customAbiCondition";

//export const CONTRACT_ADDRESS = "0xb4f48E123De3f87fCb3636F8E20A34797DbBf8Ad";
export const CONTRACT_ADDRESS = "0x3d94af870ED272Cd5370e4135F9B2Bd0e311d65D"
const META_DATA_URL = "ipfs://XX"
import Web3 from 'web3';
import Abi from '../scripts/SimpleGroupsMngmt.json';
import type { AbiItem } from "web3-utils";

//import Contract from "web3-eth-contract";

//Contract.setProvider('https://rpc-mumbai.maticvigil.com:80001');
// Set up web3 provider and contract instance

const contractABI:any = [
   {
       "anonymous": false,
       "inputs": [
       {
           "indexed": false,
           "internalType": "int32",
           "name": "groupId",
           "type": "int32"
       },
       {
           "indexed": false,
           "internalType": "address",
           "name": "owner",
           "type": "address"
       },
       {
           "indexed": false,
           "internalType": "address[]",
           "name": "members",
           "type": "address[]"
       }
       ],
       "name": "GroupCreated",
       "type": "event"
   },
   {
       "anonymous": false,
       "inputs": [
       {
           "indexed": false,
           "internalType": "int32",
           "name": "groupId",
           "type": "int32"
       },
       {
           "indexed": false,
           "internalType": "address",
           "name": "member",
           "type": "address"
       }
       ],
       "name": "MemberAdded",
       "type": "event"
   },
   {
       "anonymous": false,
       "inputs": [
       {
           "indexed": false,
           "internalType": "int32",
           "name": "groupId",
           "type": "int32"
       },
       {
           "indexed": false,
           "internalType": "address",
           "name": "member",
           "type": "address"
       }
       ],
       "name": "MemberRemoved",
       "type": "event"
   },
   {
       "inputs": [
       {
           "internalType": "int32",
           "name": "groupId",
           "type": "int32"
       },
       {
           "internalType": "address",
           "name": "member",
           "type": "address"
       }
       ],
       "name": "addMember",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "inputs": [
       {
           "internalType": "address[]",
           "name": "members",
           "type": "address[]"
       }
       ],
       "name": "createGroup",
       "outputs": [
       {
           "internalType": "int32",
           "name": "",
           "type": "int32"
       }
       ],
       "stateMutability": "nonpayable",
       "type": "function"
   },
   {
       "inputs": [
       {
           "internalType": "int32",
           "name": "",
           "type": "int32"
       }
       ],
       "name": "groups",
       "outputs": [
       {
           "internalType": "address",
           "name": "owner",
           "type": "address"
       }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
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
   {
       "inputs": [],
       "name": "nextGroupId",
       "outputs": [
       {
           "internalType": "int32",
           "name": "",
           "type": "int32"
       }
       ],
       "stateMutability": "view",
       "type": "function"
   },
   {
       "inputs": [
       {
           "internalType": "int32",
           "name": "groupId",
           "type": "int32"
       },
       {
           "internalType": "address",
           "name": "member",
           "type": "address"
       }
       ],
       "name": "removeMember",
       "outputs": [],
       "stateMutability": "nonpayable",
       "type": "function"
   }
];
const contractAddress = '0xb4f48E123De3f87fCb3636F8E20A34797DbBf8Ad'; // Replace with your contract's address
const bob = '0x32AA13b0F477cd3f0620CaD3516E1725B1E66c81';
const charlie = '0x0E45FAFf8276B40178d731AF26c0b24A19821193';

const web3 = new Web3(window.ethereum);

async function getContract()
{
   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
   console.log(accounts)
   return new web3.eth.Contract(contractABI, CONTRACT_ADDRESS)
}

export async function createGroup(members: any) {
   const contract = await getContract();
   console.log(contract)
   try{
      const result = await contract.methods.createGroup([bob, charlie]).call();
      console.log(result);
      return result;
   }
   catch(e) {
      console.log(e);
   }
   return null;
}

// Add a member to a group
// async function addMember(groupId, member) {
//     const contract = await getContract()
//     //const [owner] = await ethers.getSigners()
//     await contract.attach(CONTRACT_ADDRESS).addMember(groupId, member)
//     console.log(`Member ${member} added to group ${groupId}`);
// }
  
//   // Remove a member from a group
// async function removeMember(groupId, member) {
//     const contract = await getContract()
//     //const [owner] = await ethers.getSigners()
//     const result = await contract.attach(CONTRACT_ADDRESS).removeMember(groupId, member)
//     const txReceipt = await result.wait()
//     console.log(`Member ${member} removed from group ${groupId}`);
// }

// // Check if an account is a member of a group
// async function isMember(groupId, account) {
//     const contract = await getContract()
//     const result = await contract.attach(CONTRACT_ADDRESS).isMember(groupId, account)
//     console.log(`Account ${account} is ${result ? '' : 'not '}a member of group ${groupId}`)
// }

// async function runTest(alice, bob, charlie, dave) {
//     const groupId = await createGroup([bob, charlie]);
//     // await addMember(groupId, dave);
//     // await removeMember(groupId, charlie);
//     await isMember(groupId, charlie);
//     await isMember(groupId, dave);
// }

// runTest('0xF2D4ee677f31e62c6a78F229A572F67289161Bdc', '0x32AA13b0F477cd3f0620CaD3516E1725B1E66c81', '0x0E45FAFf8276B40178d731AF26c0b24A19821193', '0x1f90b7402984CE5A6d2DeCFDbE9DEc22c87F659C')
//    .then(() => process.exit(0))
//    .catch((error) => {
//        console.error(error);
//        process.exit(1);
//    });