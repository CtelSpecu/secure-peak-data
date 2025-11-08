// Auto-generated ABI file - will be populated by genabi script after contract compilation
export const SecurePeakDataABI = {
  abi: [
    {
      inputs: [],
      name: "getRecordCount",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "user", type: "address" }],
      name: "getUserRecordIds",
      outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "recordId", type: "uint256" }],
      name: "getRecordConsumption",
      outputs: [{ internalType: "euint32", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "recordId", type: "uint256" }],
      name: "getRecordIsPeak",
      outputs: [{ internalType: "ebool", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "recordId", type: "uint256" }],
      name: "getRecordMetadata",
      outputs: [
        { internalType: "uint256", name: "timestamp", type: "uint256" },
        { internalType: "address", name: "submitter", type: "address" },
        { internalType: "bool", name: "exists", type: "bool" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "externalEuint32",
          name: "encryptedConsumption",
          type: "bytes32",
        },
        { internalType: "bytes", name: "consumptionProof", type: "bytes" },
        {
          internalType: "externalEuint32",
          name: "encryptedIsPeak",
          type: "bytes32",
        },
        { internalType: "bytes", name: "isPeakProof", type: "bytes" },
      ],
      name: "createRecord",
      outputs: [{ internalType: "uint256", name: "recordId", type: "uint256" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "recordId", type: "uint256" },
        {
          internalType: "externalEuint32",
          name: "encryptedConsumption",
          type: "bytes32",
        },
        { internalType: "bytes", name: "consumptionProof", type: "bytes" },
      ],
      name: "updateConsumption",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "recordId", type: "uint256" },
        {
          internalType: "externalEuint32",
          name: "encryptedIsPeak",
          type: "bytes32",
        },
        { internalType: "bytes", name: "isPeakProof", type: "bytes" },
      ],
      name: "updateIsPeak",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "uint256", name: "recordId", type: "uint256" },
        { internalType: "address", name: "auditor", type: "address" },
      ],
      name: "grantAccess",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "recordId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "submitter",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "RecordCreated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "recordId",
          type: "uint256",
        },
        {
          indexed: true,
          internalType: "address",
          name: "updater",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "timestamp",
          type: "uint256",
        },
      ],
      name: "RecordUpdated",
      type: "event",
    },
  ],
};
