import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ContractFactory } from "@ethersproject/contracts";
import { UnelmaMarket } from "typechain";
import { BigNumberish } from "ethers";

describe("UnelmaMarket - minting test", function () {
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

  it("Should let everyone mint", async () => {
    const nft = {
      cid: "contentID",
      metadataCid: "metadataContentID",
    };

    await expect(nftLabStore.connect(signers[1]).mint(signers[1].address, nft))
      .to.emit(nftLabStore, "Minted")
      .withArgs(signers[1].address, nft.cid, nft.metadataCid);

    const totalSupply: BigNumberish = await nftLabStore.totalSupply();
    await expect(totalSupply).to.be.equal(1);
  });

  it("Should not let mint an already minted nft", async () => {
    const nft = {
      cid: "contentID",
      metadataCid: "metadataContentID",
    };

    await expect(nftLabStore.connect(signers[1]).mint(signers[1].address, nft))
      .to.emit(nftLabStore, "Minted")
      .withArgs(signers[1].address, nft.cid, nft.metadataCid);

    expect(
      nftLabStore.connect(signers[0]).mint(signers[1].address, nft)
    ).to.be.revertedWith("Token already exists");
  });

  it("Should not let mint an already minted nft based only on CID", async () => {
    let nft = {
      cid: "contentID",
      metadataCid: "metadataContentID",
    };

    await expect(nftLabStore.connect(signers[1]).mint(signers[1].address, nft))
      .to.emit(nftLabStore, "Minted")
      .withArgs(signers[1].address, nft.cid, nft.metadataCid);

    nft.metadataCid = "anotherMetadataContentID";

    expect(
      nftLabStore.connect(signers[0]).mint(signers[2].address, nft)
    ).to.be.revertedWith("Token already exists");
  });
});
