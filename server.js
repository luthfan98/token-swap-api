require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

// Konfigurasi Server
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

// Pastikan RPC_URL dan PRIVATE_KEY tersedia di .env
if (!process.env.RPC_URL || !process.env.PRIVATE_KEY) {
  console.error("❌ ERROR: Harap set RPC_URL dan PRIVATE_KEY di .env");
  process.exit(1);
}

// Konfigurasi Alchemy atau Infura
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Ambil ABI dari file JSON
const contractAddress = "0x5953B7F0733b8aFd800F8A9D45F664460f25e1CD";
const contractArtifact = require("./abi/TokenSwap.json");
const contractABI = contractArtifact.abi;

// Inisialisasi smart contract
const tokenSwap = new ethers.Contract(contractAddress, contractABI, wallet);

// Route Test API
app.get("/", (req, res) => {
  res.send("Token Swap API is running!");
});

// Jalankan Server
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});

app.post("/swap", async (req, res) => {
    try {
      const { tokenIn, tokenOut, amountIn, receiver } = req.body;
  
      if (!tokenIn || !tokenOut || !amountIn || !receiver) {
        return res.status(400).json({ error: "Missing required parameters" });
      }
  
      // Konversi nilai ke BigNumber (wei)
      const amountInWei = ethers.parseUnits(amountIn.toString(), 18); // Sesuaikan desimal token
  
      // Kirim transaksi swap ke smart contract
      const tx = await tokenSwap.swap(tokenIn, tokenOut, amountInWei, receiver);
      await tx.wait(); // Tunggu transaksi selesai
  
      res.json({ success: true, txHash: tx.hash });
    } catch (error) {
      console.error("Swap Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  