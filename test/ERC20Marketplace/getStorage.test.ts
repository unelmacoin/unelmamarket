import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { expect } from "chai";
import {
  BadToken,
  ERC20Marketplace,
  UnelmaMarketMarketplaceVariant,
} from "typechain";

describe("ERC20Marketplace tests", function () {
  let signers: SignerWithAddress[];
  let nftLabMarketplace: ERC20Marketplace;
  let nftLabStore: UnelmaMarketMarketplaceVariant;
  let NFT = { cid: "cid", metadataCid: "metadataCid" };

  beforeEach(async () => {
    signers = await ethers.getSigners();
    const nftLabMarketplaceFactory = await ethers.getContractFactory(
      "ERC20Marketplace",
      signers[0]
    );

    const nftLabStoreFactory = await ethers.getContractFactory(
      "UnelmaMarketMarketplaceVariant",
      signers[0]
    );

    const badTokenFactory = await ethers.getContractFactory(
      "BadToken",
      signers[0]
    );

    const badToken = (await badTokenFactory.deploy()) as BadToken;

    nftLabMarketplace = (await nftLabMarketplaceFactory.deploy(
      badToken.address,
      "UnelmaMarket",
      "UMARKET"
    )) as ERC20Marketplace;

    nftLabStore = (await nftLabStoreFactory.attach(
      await nftLabMarketplace.getStorage()
    )) as UnelmaMarketMarketplaceVariant;

    // each signer has 1000 tokens
    signers.forEach(async (signer) => {
      badToken.connect(signer).juice();
      badToken.approve(
        nftLabMarketplace.address,
        await badToken.balanceOf(signer.address)
      );
    });
  });

  it("Get a non empty address of storage", async () => {
    const address = await nftLabMarketplace.getStorage();
    expect(address).to.have.length.greaterThanOrEqual(1);
  });
});
