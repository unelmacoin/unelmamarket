import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractFactory } from "@ethersproject/contracts";
import { UnelmaMarket } from "typechain";

describe("UnelmaMarket - interface test", function () {
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

  it("Should support EIP 165 interface", async () => {
    // EIP165 interface
    expect(await nftLabStore.supportsInterface("0x01ffc9a7")).to.be.true;
  });

  it("Should support ERC721 interface", async () => {
    // ERC721
    expect(await nftLabStore.supportsInterface("0x80ac58cd")).to.be.true;
  });

  it("Should support ERC721 Metadata interface", async () => {
    // ERC721 Metadata
    expect(await nftLabStore.supportsInterface("0x5b5e139f")).to.be.true;
  });

  it("Should support ERC721 Enumerable interface", async () => {
    // ERC721 Enumerable
    expect(await nftLabStore.supportsInterface("0x780e9d63")).to.be.true;
  });

  it("Should not support strange interface", async () => {
    // Not implemented interface
    expect(await nftLabStore.supportsInterface("0xffffffff")).to.be.false;
  });
});
