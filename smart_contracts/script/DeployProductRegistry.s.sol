//SPDX-Licene-Identifier:MIT
pragma solidity ^0.8.30;

import {Script} from "forge-std/Script.sol";
import {ProductRegistry} from "../src/ProductRegisry.sol";

contract DeployProductRegistry is Script {
    function run() external returns (ProductRegistry) {
        vm.startBroadcast();
        ProductRegistry productRegistry = new ProductRegistry(msg.sender);
        vm.stopBroadcast();
        return productRegistry;
    }
}
