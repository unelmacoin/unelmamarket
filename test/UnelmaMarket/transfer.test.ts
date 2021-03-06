import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { UnelmaMarket } from "typechain";

describe("NFTLabStore - Transfer tests", function () {
  let nftLabStore: UnelmaMarket;
  let signers: SignerWithAddress[];
  let nftLabStoreFactory: ContractFactory;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    nftLabStoreFactory = await ethers.getContractFactory(
      "UnelmaMarket",
      signers[0]
    );

    nftLabStore = (await nftLabStoreFactory.deploy(
      "UnelmaMarket",
      "UMARKET"
    )) as UnelmaMarket;
  });

  it("Only owner should be able to safeTransferFrom a NFT", async () => {
    const signers = await ethers.getSigners();

    const nft = {
      cid: "NFT Cid",
      metadataCid: "Metadata Cid",
    };

    const transaction = {
      tokenId: 1,
      seller: signers[0].address,
      sellerId: 0,
      buyer: signers[1].address,
      buyerId: 1,
      price: "1 ETH",
      timestamp: "2021",
    };

    await nftLabStore.mint(signers[0].address, nft);

    const notOwnerCaller: UnelmaMarket = nftLabStore.connect(signers[1]);

    await expect(
      notOwnerCaller["safeTransferFrom(address,address,uint256)"](
        transaction.seller,
        transaction.buyer,
        transaction.tokenId
      )
    ).to.be.revertedWith("");
  });
});
