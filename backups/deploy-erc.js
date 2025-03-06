const { ethers } = require("hardhat");

async function main() {
    const [owner, recipient] = await ethers.getSigners();
    console.log(`Owner: ${owner.address}`);
    console.log(`Recipient: ${recipient.address}`);

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
    console.log(`MyToken desplegado en: ${await myToken.getAddress()}`);

    const tx = await myToken.transfer(recipient.address, ethers.parseUnits("100", 18));
    await tx.wait();
    console.log(`Transferencia de 100 MTK realizada a ${recipient.address}`);

    const balanceRecipient = await myToken.balanceOf(recipient.address);
    console.log(`Balance del receptor: ${ethers.formatUnits(balanceRecipient, 18)} MTK`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
