import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { ETHMarketplace, UnelmaMarketMarketplaceVariant } from "typechain";

describe("ETHMarketplace tests", function () {
  let signers: SignerWithAddress[];
  let nftLabMarketplaceFactory: ContractFactory;
  let nftLabMarketplace: ETHMarketplace;
  let nftLabStore: UnelmaMarketMarketplaceVariant;
  let nftLabStoreFactory: ContractFactory;
  let NFT = { cid: "cid", metadataCid: "metadataCid" };

  beforeEach(async () => {
    signers = await ethers.getSigners();
    nftLabMarketplaceFactory = await ethers.getContractFactory(
      "ETHMarketplace",
      signers[0]
    );

    nftLabStoreFactory = await ethers.getContractFactory(
      "UnelmaMarketMarketplaceVariant",
      signers[0]
    );

    nftLabMarketplace = (await nftLabMarketplaceFactory.deploy(
      "UnelmaMarket",
      "UMARKET"
    )) as ETHMarketplace;

    nftLabStore = (await nftLabStoreFactory.attach(
      await nftLabMarketplace.getStorage()
    )) as UnelmaMarketMarketplaceVariant;
  });

  it("Should cancel an open trade", async () => {
    nftLabStore.mint(signers[1].address, NFT);
    const tokenID = await nftLabStore.tokenOfOwnerByIndex(
      signers[1].address,
      0
    );
    nftLabMarketplace.connect(signers[1]).openTrade(tokenID, 1);
    await expect(nftLabMarketplace.connect(signers[1]).cancelTrade(0))
      .to.emit(nftLabMarketplace, "TradeStatusChange")
      .withArgs(0, "Cancelled");
  });

  it("Only poster should be able to cancel", async () => {
    nftLabStore.mint(signers[1].address, NFT);
    const tokenID = await nftLabStore.tokenOfOwnerByIndex(
      signers[1].address,
      0
    );
    nftLabMarketplace.connect(signers[1]).openTrade(tokenID, 1);
    await expect(
      nftLabMarketplace.connect(signers[2]).cancelTrade(0)
    ).to.be.revertedWith("");
  });
});
