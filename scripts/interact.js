const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

const deploymentsDir = path.join(__dirname, "../deployments");
const contractJson = fs.readFileSync(path.join(deploymentsDir, "MyToken.json"), "utf-8");
const contractAddress = JSON.parse(contractJson).address;

async function main() {
    const [owner, recipient, spender] = await ethers.getSigners();
    console.log(`Owner: ${owner.address}`);
    console.log(`Recipient: ${recipient.address}`);
    console.log(`Spender: ${spender.address}`);

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.attach(contractAddress);
    console.log(`Contrato cargado en: ${contractAddress}`);

    const name = await myToken.name();
    const symbol = await myToken.symbol();
    const decimals = await myToken.decimals();

    console.log(`Nombre del token: ${name}`);
    console.log(`Símbolo: ${symbol}`);
    console.log(`Decimales: ${decimals}`);

    // Aprobar a 'spender' para gastar 100 tokens en nombre del owner
    const approveTx = await myToken.approve(spender.address, ethers.parseUnits("100", decimals));
    await approveTx.wait();
    console.log(`Aprobados 100 MTK para el Spender: ${spender.address}`);

    // Verificar el 'allowance' (cuánto puede gastar el Spender)
    const allowance = await myToken.allowance(owner.address, spender.address);
    console.log(`Allowance del Spender: ${ethers.formatUnits(allowance, decimals)} MTK`);

       // Mostrar balances finales
    const balanceOwner = await myToken.balanceOf(owner.address);
    console.log(`Balance del Owner: ${ethers.formatUnits(balanceOwner, decimals)} MTK`);

    const balanceRecipient = await myToken.balanceOf(recipient.address);
    console.log(`Balance del Recipient: ${ethers.formatUnits(balanceRecipient, decimals)} MTK`);

     // Transferencia usando transferFrom() por el Spender
     try {
        const transferTooMuch = await myToken.connect(spender).transferFrom(
            owner.address, 
            recipient.address, 
            ethers.parseUnits("120", decimals) // 120 MTK, más de lo aprobado
        );
        await transferTooMuch.wait();
        console.log(`✅ Transferencia de 120 MTK realizada (esto NO debería pasar)`);
    } catch (error) {
        console.error(`❌ Error al intentar transferir más de lo aprobado: ${error.reason || error.message}`);
    }
    
}
