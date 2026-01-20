-include .env

build:; forge build 

deploy-sepolia:
	forge script script/DeployProductRegistry.s.sol --rpc-url $(SEPOLIA_URL) --private-key $(PRIVATE_KEY) --broadcast --verify 	--etherscan-api-key $(ETHERSCAN_API) -vvv

deploy:
	forge script script/DeployProductRegistry.s.sol --fork-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast

get-tokens:
	cast call $(CONTRACT_ADD) "getUserTokens(address)" $(USER_ADD) --rpc-url $(RPC_URL)

mint:
	cast send $(CONTRACT_ADD) "mint(uint256,string memory)" 1 $(IPFS) --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY)