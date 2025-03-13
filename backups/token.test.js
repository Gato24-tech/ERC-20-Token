const { expect } = require ("chai");
const { ethers } = require ("hardhat");

describe("MyToken", function () {

  let Token, myToken, owner, addr1, addr2;


beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Token = await ethers.getContractFactory("MyToken");
    myToken = await Token.deploy();
    await myToken.waitForDeployment();
});

it("Debe asignar la totalidad del supply al owner", async function () {
    const totalSupply = await myToken.totalSupply();
    const ownerBalance = await myToken.balanceOf(owner.address);
    expect(ownerBalance).to.equal(totalSupply);
});

it("Debe permitir transferencias entre cuentas", async function () {
 await myToken.transfer(addr1.address, 50);
 const addr1Balance  = await myToken.balanceOf(addr1.address);
 expect(addr1Balance).to.equal(BigInt(50));
});

it("Debe fallar si el saldo es insuficiente", async function (){
    await expect(myToken.connect(addr1).transfer(owner.address, 1)).to.be.reverted;
     "ERC20: transfer amount exceeds balance"
});

it("Debe aprobar y usar transferFrom correctamente", async function() {
    await myToken.approve(addr1.address, 100);
    await myToken.connect(addr1).transferFrom(owner.address, addr2.address, 100);
    const addr2Balance = await myToken.balanceOf(addr2.address);
    expect(addr2Balance).to.equal(BigInt(100));
});

it("Debe emitir eventos de transferncia y aprobación", async function() {
    await expect(myToken.transfer(addr1.address, 50))
     .to.emit(myToken, "Transfer")
     .withArgs(owner.address, addr1.address, 50);

    await expect(myToken.approve(addr1.address, 100))
     .to.emit(myToken, "Approval")
     .withArgs(owner.address, addr1.address, 100);
});
});