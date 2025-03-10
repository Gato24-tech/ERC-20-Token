const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

const deploymentsDir = path.join(__dirname, "../deployments");
const contractJson = fs.readFileSync(path.join(deploymentsDir, "MyToken.json"),"utf-8");
const contractAddress = JSON.parse(contractJson).address;

async function main() {
    const [owner, recipient] = await ethers.getSigners();
    console.log(`Owner: ${owner.address}`);
    console.log(`Recipient: ${recipient.address}`);

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.attach(contractAddress);
    console.log(`Contrato cargado en: ${contractAddress}`);

    const name = await myToken.name();
    const symbol = await myToken.symbol();
    const decimals = await myToken.decimals();
    
    console.log(`Nombre del token: ${name}`);
    console.log(`Símbolo: ${symbol}`);
    console.log(`Decimales: ${decimals}`);
     
    const transferTx = await myToken.transfer(recipient.address, ethers.parseUnits("50", decimals));
    await transferTx.wait();
    console.log(`Transferencia de 50 MTK realizada a ${recipient.address}`);

    myToken.on("Transfer",(from, to, value) => {
        console.log(`Evento Transfer detectado: ${from} → ${to} | Cantidad:${ethers, formatUnits(value, decimals)} MTK`);
    });

    const totalSupply = await myToken.totalSupply();
    console.log(`Total en circulación: ${ethers.formatUnits(totalSupply, decimals)} MTK`);
 
    const balanceOwner = await myToken.balanceOf(owner.address);
    console.log(`Balance del Owner: ${ethers.formatUnits(balanceOwner, decimals)} MTK`);
    
    const balanceRecipient = await myToken.balanceOf(recipient.address);
    console.log(`Balance del Recipient: ${ethers.formatUnits(balanceRecipient, decimals)} MTK`);

}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
