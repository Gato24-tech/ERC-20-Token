const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

const deploymentsDir = path.join(__dirname, "../deployments");
const contractJson = fs.readFileSync(path.join(deploymentsDir, "MyToken.json"), "utf-8");
const contractAddress = JSON.parse(contractJson).address;

async function main() {
    const [owner, recipient, spender] = await ethers.getSigners();
    console.log(`\n✅ Owner: ${owner.address}`);
    console.log(`✅ Recipient: ${recipient.address}`);
    console.log(`✅ Spender: ${spender.address}`);

    const MyToken = await ethers.getContractFactory("MyToken");
    const myToken = await MyToken.attach(contractAddress);
    console.log(`\n📌 Contrato cargado en: ${contractAddress}`);

    // Obtener información del token
    const name = await myToken.name();
    const symbol = await myToken.symbol();
    const decimals = await myToken.decimals();
    console.log(`\n🔹 Nombre del token: ${name}`);
    console.log(`🔹 Símbolo: ${symbol}`);
    console.log(`🔹 Decimales: ${decimals}`);

    // Aprobar a 'spender' para gastar 100 MTK
    console.log("\n📌 Aprobando 100 MTK para el Spender...");
    const approveTx = await myToken.approve(spender.address, ethers.parseUnits("100", decimals));
    await approveTx.wait();
    console.log(`✅ Aprobación confirmada`);

    // Verificar el 'allowance'
    let allowance = await myToken.allowance(owner.address, spender.address);
    console.log(`🔹 Allowance actual: ${ethers.formatUnits(allowance, decimals)} MTK`);

    // Intentar transferir 120 MTK con transferFrom() (esto debe fallar)
    try {
        console.log("\n📌 Intentando transferir 120 MTK con transferFrom()...");
        const transferTooMuch = await myToken.connect(spender).transferFrom(
            owner.address,
            recipient.address,
            ethers.parseUnits("120", decimals)
        );
        await transferTooMuch.wait();
    } catch (error) {
        console.log(`❌ Transferencia fallida como era esperado: ${error.reason || error.message}`);
    }

    // Transferir 100 MTK (esto debe funcionar)
    console.log("\n📌 Transferencia de 100 MTK con transferFrom()...");
    const transferTx = await myToken.connect(spender).transferFrom(
        owner.address,
        recipient.address,
        ethers.parseUnits("100", decimals)
    );
    await transferTx.wait();
    console.log(`✅ Transferencia exitosa`);

    // Aumentar el allowance en 50 MTK
    console.log("\n📌 Aumentando el allowance en 50 MTK...");
    const increaseTx = await myToken.increaseAllowance(spender.address, ethers.parseUnits("50", decimals));
    await increaseTx.wait();
    console.log(`✅ Allowance incrementado`);

    // Reducir el allowance en 30 MTK
    console.log("\n📌 Reduciendo el allowance en 30 MTK...");
    const decreaseTx = await myToken.decreaseAllowance(spender.address, ethers.parseUnits("30", decimals));
    await decreaseTx.wait();
    console.log(`✅ Allowance reducido`);

    // Consultar balances finales
    const balanceOwner = await myToken.balanceOf(owner.address);
    const balanceRecipient = await myToken.balanceOf(recipient.address);
    console.log(`\n🔹 Balance final del Owner: ${ethers.formatUnits(balanceOwner, decimals)} MTK`);
    console.log(`🔹 Balance final del Recipient: ${ethers.formatUnits(balanceRecipient, decimals)} MTK`);

    // Escuchar eventos en vivo
    console.log("\n📢 Escuchando eventos en la blockchain...");
    myToken.on("Transfer", (from, to, value) => {
        console.log(`🔄 Evento Transfer: ${ethers.formatUnits(value, decimals)} MTK enviados de ${from} a ${to}`);
    });

    myToken.on("Approval", (owner, spender, value) => {
        console.log(`🛠️ Evento Approval: ${owner} aprobó ${ethers.formatUnits(value, decimals)} MTK para ${spender}`);
    });
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
