import React, { useEffect, useState } from "react";
import { Mumbai, useEthers } from "@usedapp/core";
import { providers } from "ethers";
import { Cohort, Strategy } from "@nucypher/nucypher-ts";
import { USER_ADDRESS } from "./constant";
import { getGroupIdFromChain } from "../../contracts/contractHelper";

function StrategyBuilder({ account, isStrategyDeployed, setDepStrategy, setGroupId }: any) {
  const [depStrategyStatus, setDepStrategyStatus] = useState("Deploy Policy");
  const { switchNetwork } = useEthers();
  const [ strategyName, setStrategyName ] = useState<string>("");
  const [deployed, setDeployed] = useState<boolean>(false);
  useEffect(()=>{
    if( isStrategyDeployed === true){
      setDepStrategyStatus("Deployed")
    }
  }, [isStrategyDeployed])

  const strategyBuild = async (e: any) => {
    e.preventDefault();

    const txData = await getGroupIdFromChain(account, [USER_ADDRESS.Bob, USER_ADDRESS.Charlie]);
    console.log(txData?.GroupCreated?.returnValues);
    setGroupId(txData?.GroupCreated?.returnValues.groupId);
    setDeployed(true);
    setDepStrategyStatus("Deploying...");

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
      strategyName,
      web3Provider
    );
  };

  return (<div className="form-inline">
      <div className="form-group mx-sm-3 mb-2">
        <label htmlFor="strategyName" className="label">Strategy Name: </label>
          <input type="text" id="strategyName" className="form-control" maxLength={50}
          value={strategyName} onChange={(e) => setStrategyName(e.target.value)} name="strategyName"></input>
      </div>
      <button disabled={isStrategyDeployed || deployed} type="button" className="btn btn-primary mb-2" onClick={strategyBuild}>
        {depStrategyStatus}
      </button>
    </div>);
}

export default StrategyBuilder;
