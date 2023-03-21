import Web3 from "web3";
import ethereum from "./ethereum";
import { getNetwork } from "./env";

const ethWeb3 = new Web3(ethereum);

const newConnect = async () => {
  const response = await ethereum.request({ method: "eth_requestAccounts" });
  // Currently only one ever per https://metamask.github.io/metamask-docs/guide/ethereum-provider.html#methods-new-api
  return response.result ? response.result[0] : response[0];
};

export const onWeb3Connect = call => {
  call(ethWeb3);
};

export const connect = newConnect;

const _abis = {};
export const getAbi = async jsonFile => {
  if (_abis[jsonFile]) return _abis[jsonFile];
  const { host: contractHost } = await getNetwork();
  const response = await (await fetch(`${contractHost}/${jsonFile}`)).json();
  return (_abis[jsonFile] = response);
};

export const isZeroHex = x => x.replace(/0x0+/g, "").length === 0;

export const decodeReturnValues = (inputs, topic) => log => {
  return ethWeb3.eth.abi.decodeLog(inputs, log.data, [topic]);
};
export const decodeLogs = (log, schema) => {
  return ethWeb3.eth.abi.decodeLog(schema.inputs, log.data, [schema.topic]);
};

export default ethWeb3;