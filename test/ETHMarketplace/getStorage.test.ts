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

  it("Get a non empty address of storage", async () => {
    const address = await nftLabMarketplace.getStorage();
    expect(address).to.have.length.greaterThanOrEqual(1);
  });
});
