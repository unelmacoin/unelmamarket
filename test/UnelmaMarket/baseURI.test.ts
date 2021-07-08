import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractFactory } from "@ethersproject/contracts";
import { UnelmaMarket } from "typechain";
import { BigNumberish } from "ethers";

describe("UnelmaMarket - baseURI test", function () {
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

  it("Should get non empty uri of token", async () => {
    const nft = {
      cid: "contentID",
      metadataCid: "metadataContentID",
    };

    await nftLabStore.mint(signers[0].address, nft);

    const tokenID: BigNumberish = await nftLabStore.getTokenId(nft.cid);
    const tokenURI: string = await nftLabStore.tokenURI(tokenID);

    expect(tokenURI).not.to.be.empty;
    expect(tokenURI).to.contain(nft.cid);
  });
});
