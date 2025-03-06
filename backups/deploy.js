const { ethers } = require("hardhat");

async function main() {
    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy(); // ✅ Sin argumentos

    await myToken.waitForDeployment();

    console.log(`Contrato desplegado en: ${await myToken.getAddress()}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
