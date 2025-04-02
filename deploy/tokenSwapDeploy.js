const hre = require("hardhat");

async function main() {
    // Ambil kontrak yang sudah dikompilasi
    const TokenSwap = await hre.ethers.getContractFactory("TokenSwap");

    // Deploy kontrak
    const tokenSwap = await TokenSwap.deploy();

    // Tunggu hingga transaksi selesai dan kontrak terdeploy
    await tokenSwap.waitForDeployment();

    // Ambil alamat kontrak yang baru dideploy
    console.log(`TokenSwap deployed to: ${await tokenSwap.getAddress()}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
