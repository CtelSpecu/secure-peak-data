// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title SecurePeakData - Encrypted Energy Consumption Records
/// @author Secure Grid Team
/// @notice Stores encrypted energy consumption data with peak indicators for authorized auditors
/// @dev Uses FHEVM for fully homomorphic encryption of sensitive consumption data
contract SecurePeakData is SepoliaConfig {
    /// @notice Structure to store encrypted consumption record
    struct EncryptedRecord {
        euint32 consumption;    // Encrypted consumption value in kWh
        ebool isPeak;           // Encrypted peak indicator
        uint256 timestamp;      // Record timestamp (public)
        address submitter;      // Address that submitted the record
        bool exists;            // Whether record exists
    }

    /// @notice Total number of records
    uint256 private _recordCount;

    /// @notice Mapping from record ID to encrypted record
    mapping(uint256 => EncryptedRecord) private _records;

    /// @notice Mapping from user address to their record IDs
    mapping(address => uint256[]) private _userRecords;

    /// @notice Event emitted when a new record is created
    event RecordCreated(
        uint256 indexed recordId,
        address indexed submitter,
        uint256 timestamp
    );

    /// @notice Event emitted when a record is updated
    event RecordUpdated(
        uint256 indexed recordId,
        address indexed updater,
        uint256 timestamp
    );

    /// @notice Returns the total number of records
    /// @return The total record count
    function getRecordCount() external view returns (uint256) {
        return _recordCount;
    }

    /// @notice Returns record IDs for a specific user
    /// @param user The address to query
    /// @return Array of record IDs belonging to the user
    function getUserRecordIds(address user) external view returns (uint256[] memory) {
        return _userRecords[user];
    }

    /// @notice Returns the encrypted consumption value for a record
    /// @param recordId The ID of the record
    /// @return The encrypted consumption value
    function getRecordConsumption(uint256 recordId) external view returns (euint32) {
        require(_records[recordId].exists, "Record does not exist");
        return _records[recordId].consumption;
    }

    /// @notice Returns the encrypted peak indicator for a record
    /// @param recordId The ID of the record
    /// @return The encrypted peak indicator
    function getRecordIsPeak(uint256 recordId) external view returns (ebool) {
        require(_records[recordId].exists, "Record does not exist");
        return _records[recordId].isPeak;
    }

    /// @notice Returns the public metadata for a record
    /// @param recordId The ID of the record
    /// @return timestamp The record timestamp
    /// @return submitter The address that submitted the record
    /// @return exists Whether the record exists
    function getRecordMetadata(uint256 recordId) external view returns (
        uint256 timestamp,
        address submitter,
        bool exists
    ) {
        EncryptedRecord storage record = _records[recordId];
        return (record.timestamp, record.submitter, record.exists);
    }

    /// @notice Creates a new encrypted consumption record
    /// @param encryptedConsumption The encrypted consumption value
    /// @param consumptionProof The proof for consumption value
    /// @param encryptedIsPeak The encrypted peak indicator
    /// @param isPeakProof The proof for peak indicator
    /// @return recordId The ID of the newly created record
    function createRecord(
        externalEuint32 encryptedConsumption,
        bytes calldata consumptionProof,
        externalEuint32 encryptedIsPeak,
        bytes calldata isPeakProof
    ) external returns (uint256 recordId) {
        // Decrypt and validate inputs
        euint32 consumption = FHE.fromExternal(encryptedConsumption, consumptionProof);
        euint32 isPeakValue = FHE.fromExternal(encryptedIsPeak, isPeakProof);
        
        // Convert isPeak to ebool (0 = false, non-zero = true)
        ebool isPeak = FHE.ne(isPeakValue, FHE.asEuint32(0));

        // Create new record
        recordId = _recordCount;
        _recordCount++;

        _records[recordId] = EncryptedRecord({
            consumption: consumption,
            isPeak: isPeak,
            timestamp: block.timestamp,
            submitter: msg.sender,
            exists: true
        });

        _userRecords[msg.sender].push(recordId);

        // Grant access permissions
        FHE.allowThis(consumption);
        FHE.allow(consumption, msg.sender);
        FHE.allowThis(isPeak);
        FHE.allow(isPeak, msg.sender);

        emit RecordCreated(recordId, msg.sender, block.timestamp);
    }

    /// @notice Updates an existing record's consumption value
    /// @param recordId The ID of the record to update
    /// @param encryptedConsumption The new encrypted consumption value
    /// @param consumptionProof The proof for consumption value
    function updateConsumption(
        uint256 recordId,
        externalEuint32 encryptedConsumption,
        bytes calldata consumptionProof
    ) external {
        require(_records[recordId].exists, "Record does not exist");
        require(_records[recordId].submitter == msg.sender, "Only submitter can update");

        euint32 consumption = FHE.fromExternal(encryptedConsumption, consumptionProof);
        
        _records[recordId].consumption = consumption;
        _records[recordId].timestamp = block.timestamp;

        // Grant access permissions
        FHE.allowThis(consumption);
        FHE.allow(consumption, msg.sender);

        emit RecordUpdated(recordId, msg.sender, block.timestamp);
    }

    /// @notice Updates an existing record's peak indicator
    /// @param recordId The ID of the record to update
    /// @param encryptedIsPeak The new encrypted peak indicator
    /// @param isPeakProof The proof for peak indicator
    function updateIsPeak(
        uint256 recordId,
        externalEuint32 encryptedIsPeak,
        bytes calldata isPeakProof
    ) external {
        require(_records[recordId].exists, "Record does not exist");
        require(_records[recordId].submitter == msg.sender, "Only submitter can update");

        euint32 isPeakValue = FHE.fromExternal(encryptedIsPeak, isPeakProof);
        ebool isPeak = FHE.ne(isPeakValue, FHE.asEuint32(0));
        
        _records[recordId].isPeak = isPeak;
        _records[recordId].timestamp = block.timestamp;

        // Grant access permissions
        FHE.allowThis(isPeak);
        FHE.allow(isPeak, msg.sender);

        emit RecordUpdated(recordId, msg.sender, block.timestamp);
    }

    /// @notice Grants decryption access to another address for a specific record
    /// @param recordId The ID of the record
    /// @param auditor The address to grant access to
    function grantAccess(uint256 recordId, address auditor) external {
        require(_records[recordId].exists, "Record does not exist");
        require(_records[recordId].submitter == msg.sender, "Only submitter can grant access");

        FHE.allow(_records[recordId].consumption, auditor);
        FHE.allow(_records[recordId].isPeak, auditor);
    }
}
