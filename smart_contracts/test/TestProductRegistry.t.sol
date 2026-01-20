//SPDx-License-Identifier:MIT
pragma solidity ^0.8.30;

import {Test, console} from "forge-std/Test.sol";
import {ProductRegistry} from "../src/ProductRegisry.sol";
import {DeployProductRegistry} from "../script/DeployProductRegistry.s.sol";

contract TestProductRegistry is Test {
    ProductRegistry public productRegistry;
    DeployProductRegistry public deployer;
    address public bobAdd = makeAddr("bobAdd");
    address public aliceAdd = makeAddr("aliceAdd");

    function setUp() external {
        deployer = new DeployProductRegistry();
        productRegistry = deployer.run();
        productRegistry.addFarmer(bobAdd);
        productRegistry.addFarmer(aliceAdd);
        vm.prank(bobAdd);
        productRegistry.mint(100, "ipfs://QmVi5ctyqDfQbUabta4LMfJ5ZQKojzRjzCDzQLpDhqq7cW"); //ID: 1

        vm.prank(aliceAdd);
        productRegistry.mint(100, "ipfs://bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna/8823"); //ID: 2
    }

    function testMintToken() public view {
        uint256 balance = productRegistry.balanceOf(bobAdd, 1);
        assertEq(100, balance);

        balance = productRegistry.balanceOf(aliceAdd, 2);
        assertEq(100, balance);
    }

    function testUri() public view {
        string memory tokenUri = productRegistry.uri(1);
        console.log(tokenUri);
        assertEq(tokenUri, "ipfs://QmVi5ctyqDfQbUabta4LMfJ5ZQKojzRjzCDzQLpDhqq7cW");

        tokenUri = productRegistry.uri(2);
        console.log(tokenUri);
        assertEq(tokenUri, "ipfs://bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna/8823");
    }

    function testTransfer() public {
        vm.prank(bobAdd);
        productRegistry.tokenTransfer(bobAdd, aliceAdd, 1, 50, "");
        assertEq(50, productRegistry.balanceOf(bobAdd, 1));
        assertEq(50, productRegistry.balanceOf(aliceAdd, 3));
        console.log(productRegistry.balanceOf(aliceAdd, 3));
    }

    function testGetTokens() public {
        //Transfer 50 tokens from bobAdd to aliceAdd
        vm.prank(bobAdd);
        productRegistry.tokenTransfer(bobAdd, aliceAdd, 1, 50, "");
        assertEq(50, productRegistry.balanceOf(bobAdd, 1));
        assertEq(50, productRegistry.balanceOf(aliceAdd, 3));

        //get array of all tokens bobAdd has
        (uint256[] memory ids, uint256[] memory balances) = productRegistry.getUserTokens(aliceAdd);
        for (uint256 i = 0; i < ids.length; i++) {
            console.log("Token ID:", ids[i], "Balance:", balances[i]);
        }
    }

    function testTokenLineage() public {
        //Transfer 50 tokens from bobAdd to aliceAdd
        vm.prank(bobAdd);
        productRegistry.tokenTransfer(bobAdd, aliceAdd, 1, 50, "");
        assertEq(50, productRegistry.balanceOf(bobAdd, 1));
        assertEq(50, productRegistry.balanceOf(aliceAdd, 3));
        vm.prank(aliceAdd);
        productRegistry.tokenTransfer(aliceAdd, bobAdd, 3, 25, "");
        uint256[] memory lineage = productRegistry.getLineage(4);
        for (uint256 i = 0; i < lineage.length; i++) {
            console.log(lineage[i], "->");
        }
    }
}
