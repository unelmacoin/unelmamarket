import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractFactory } from "ethers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { ETHMarketplace, UnelmaMarketMarketplaceVariant } from "typechain";

describe("ETHMarketplace - openTrade tests", function () {
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

  it("Should open a new trade", async () => {
    nftLabStore.mint(signers[1].address, NFT);
    const tokenID = await nftLabStore.tokenOfOwnerByIndex(
      signers[1].address,
      0
    );
    expect(await nftLabMarketplace.connect(signers[1]).openTrade(tokenID, 1))
      .to.emit(nftLabMarketplace, "TradeStatusChange")
      .withArgs(0, "Open");
  });

  it("Should not open a new trade if sender does not own the article", async () => {
    await expect(nftLabMarketplace.openTrade(1, 1)).to.be.revertedWith("");
  });
});
