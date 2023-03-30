export const customABICondition: any = {
    contractAddress: '0xb4f48E123De3f87fCb3636F8E20A34797DbBf8Ad',
    method: 'isMember',
    parameters: ['groupId', ':userAddress'],
    functionAbi:   {
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
    chain: 1,
    returnValueTest: {
      comparator: '==',
      value: true,
    },
  };