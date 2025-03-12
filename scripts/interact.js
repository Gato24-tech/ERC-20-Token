const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
const { Console } = require("console");

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
     } catch (error) {
        console.log(`✅ Transferencia de 120 MTK realizada (esto NO debería pasar) ${error.reason ||error.message}`);
    } 
    // Transferencia usando transferFrom() por el Spenser (cantidad aprobada)
            const transferApproved = await myToken.connect(spender).transferFrom(
            owner.address,
            recipient.address,
            ethers.parseUnits("100", decimals) //100 MTK, exactmente lo aprobado 
         );
         await transferApproved.wait();
         console.log(`Transferencia de 100 MTK realizada correctamente por el spender`);
        
        // Aumentar el allowance en 50 MTK
        const increaseTx = await myToken.increaseAllowance(spender.address, ethers.parseUnits("50", decimals));
        await increaseTx.wait();
        console.log(`✅ Allowance incrementado en 50 MTK`);

        // Consultar allowance actualizado
        const newAllowance1 = await myToken.allowance(owner.address, spender.address);
        console.log(`Nuevo allowance del Spender: ${ethers.formatUnits(newAllowance1, decimals)} MTK`);
               
 
        //Reducir el allowance en 30 MTK
        const decreaseTx = await myToken.decreaseAllowance(spender.address, ethers.parseUnits("30", decimals));
        await decreaseTx.wait();
        console.log(`Allowance reducido en 30 MTK`);
        
        //Consultar allowance actualizado después de la reducción
        const newAllowance2 = await myToken.allowance(owner.address, spender.address);
        console.log(`Allowance final del Spender: ${ ethers.formatUnits(newAllowance2, decimals)} MTK`);
            
        // Mostrar balances fianles
       const balanceOwnerFinal = await myToken.balanceOf(owner.address);
       console.log(`Balance final del Ower: ${ethers.formatUnits(balanceOwnerFinal, decimals)} MTK`);
    }

    main().catch ((error) => {
      console.error(error);
      process.exit(1);

    });  

