const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const [owner, recipient] = await ethers.getSigners();
    console.log(`Owner: ${owner.address}`);
    console.log(`Recipient: ${recipient.address}`);

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.deploy();
    await myToken.waitForDeployment();
    const contractAddress = await myToken.getAddress();
    console.log(`MyToken desplegado en: ${contractAddress}`);

    // Crear carpeta deployments si no existe
    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir);
    }

    // Guardar la dirección del contrato en un archivo JSON
    fs.writeFileSync(
        path.join(deploymentsDir, "MyToken.json"),
        JSON.stringify({ address: contractAddress }, null, 2)
    );

    console.log(`Dirección guardada en deployments/MyToken.json`);

    // Transferencia de tokens
    const tx = await myToken.transfer(recipient.address, ethers.parseUnits("100", 18));
    await tx.wait();
    console.log(`Transferencia de 100 MTK realizada a ${recipient.address}`);

    // Verificar balance del receptor
    const balanceRecipient = await myToken.balanceOf(recipient.address);
    console.log(`Balance del receptor: ${ethers.formatUnits(balanceRecipient, 18)} MTK`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
