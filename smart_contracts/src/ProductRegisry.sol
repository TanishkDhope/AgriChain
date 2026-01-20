// SPDX-License-Identifier: MIT

/**
 * @title ProductRegistry for Project AgriChain
 * @author Tanishk Dhope
 * @notice Smart Contract for handling logic and history of transactions
 * @dev inherits @OpenZepplin ERC1155 contract
 */
pragma solidity ^0.8.27;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155Burnable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import {ERC1155Pausable} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {EfficientHashLib} from "lib/solady/src/utils/EfficientHashLib.sol";

contract ProductRegistry is ERC1155, AccessControl, ERC1155Pausable, ERC1155Burnable, ERC1155Supply {
    uint256 private nextId;

    //ROLES
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");

    error NOT_ENOUGH_BALANCE();

    //Event to log transfer of tokens
    event TokenTransferred(
        address indexed from, address indexed to, uint256 indexed tokenId, uint256 amount, bytes32 hashCommitment
    );
    event BatchSplit(uint256 indexed parent, uint256 indexed child, uint256 amount, address from, address to);

    mapping(uint256 => uint256) public parent; // child → parent
    mapping(uint256 => uint256[]) public lineage; // tokenId → full chain of ancestors
    mapping(uint256 => bytes32) public cumulativeHash;

    //Mapping TokenIds to URIs
    mapping(uint256 id => string uri) private idToString;

    using EnumerableSet for EnumerableSet.UintSet;

    mapping(address => EnumerableSet.UintSet) private ownedTokenIds;

    constructor(address initialOwner) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(FARMER_ROLE, initialOwner); // so they can mint first
        nextId = 1;
    }

    function setUri(string memory newuri, uint256 id) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _setURI(newuri, id);
    }

    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function getHashHistory(uint256 id) public view returns (bytes32) {
        return cumulativeHash[id];
    }

    function mint(uint256 amount, string memory tokenUri) public onlyRole(FARMER_ROLE) {
        uint256 id = nextId++;
        _mint(msg.sender, id, amount, "");
        _setURI(tokenUri, id);

        // Root batch → lineage starts with itself
        lineage[id].push(id);

        ownedTokenIds[msg.sender].add(id);
    }

    // function mintBatch(
    //     address to,
    //     uint256[] memory ids,
    //     uint256[] memory amounts
    // ) public {
    //     _mintBatch(to, ids, amounts, "");
    // }

    // The following functions are overrides required by Solidity.

    function _update(address from, address to, uint256[] memory ids, uint256[] memory values)
        internal
        override(ERC1155, ERC1155Pausable, ERC1155Supply)
    {
        super._update(from, to, ids, values);
        uint256 i;
        for (i = 0; i < ids.length; i++) {
            uint256 id = ids[i];
            uint256 value = values[i];

            if (from != address(0) && balanceOf(from, id) == 0) {
                ownedTokenIds[from].remove(id); // automatically handles removal
            }

            if (to != address(0) && value > 0) {
                ownedTokenIds[to].add(id); // automatically handles duplicates
            }
        }
    }

    //Optional Overrides for uri to id mapping

    function _setURI(string memory newuri, uint256 id) internal {
        idToString[id] = newuri;
    }

    function uri(uint256 id) public view override returns (string memory) {
        string memory tokenUri = idToString[id];
        return tokenUri;
    }

    event txnInfo(address indexed from, address to, uint256 id, uint256 value);

    function tokenTransfer(address from, address to, uint256 id, uint256 value, bytes memory /*data*/ ) public {
        require(
            from == msg.sender,
            /* || isApprovedForAll(from, msg.sender)*/
            "Not authorized"
        );

        uint256 balance = balanceOf(from, id);
        require(value <= balance, NOT_ENOUGH_BALANCE());

        if (value == balance) {
            //NO NEED TO SPLIT BATCH
            safeTransferFrom(from, to, id, value, "");
            bytes32 commitment = EfficientHashLib.hash(
                bytes32(uint256(uint160(from))), // address → uint160 → uint256 → bytes32
                bytes32(uint256(uint160(to))),
                bytes32(id),
                bytes32(value)
            );

            // Update cumulative hash for tokenId
            cumulativeHash[id] = EfficientHashLib.hash(cumulativeHash[id], commitment);

            emit txnInfo(from, to, id, value);

            // Emit transfer event
            emit TokenTransferred(from, to, id, value, commitment);
        } else if (value < balance) {
            //SPLIT REQUIRED

            _burn(from, id, value); //burn amount being transferred

            uint256 child = nextId++;
            _mint(to, child, value, "");
            idToString[child] = idToString[id];

            // Record lineage
            parent[child] = id;
            lineage[child] = lineage[id]; // copy parent lineage
            lineage[child].push(child); // append self
            // Emit transfer event

            // emit TokenTransferred(from, to, child, value);

            emit BatchSplit(id, child, value, from, to);
        }
    }

    function getUserTokens(address user) public view returns (uint256[] memory ids, uint256[] memory balances) {
        uint256 length = ownedTokenIds[user].length();
        ids = new uint256[](length);
        balances = new uint256[](length);

        for (uint256 i = 0; i < length; i++) {
            uint256 id = ownedTokenIds[user].at(i);
            ids[i] = id;
            balances[i] = balanceOf(user, id);
        }
    }

    function getLineage(uint256 id) public view returns (uint256[] memory) {
        return lineage[id];
    }

    //ROLE MANAGEMENT
    function addFarmer(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(FARMER_ROLE, account);
    }

    function addDistributor(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DISTRIBUTOR_ROLE, account);
    }

    function addRetailer(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(RETAILER_ROLE, account);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
