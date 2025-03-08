const express = require("express");
const mongoose = require("mongoose");
const { ethers } = require("ethers");
require("dotenv").config();
const vestingABI = require("./vestingTokenABI.json");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const PurchaseSchema = new mongoose.Schema({
  user: String,
  amount: Number,
  bonus: Number,
  timestamp: { type: Date, default: Date.now },
});

const BurnSchema = new mongoose.Schema({
  amount: Number,
  timestamp: { type: Date, default: Date.now },
});

const Purchase = mongoose.model("Purchase", PurchaseSchema);
const Burn = mongoose.model("Burn", BurnSchema);

// Setup ethers.js provider & contract
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, vestingABI, wallet);

console.log("🚀 ~ contract:", contract);

// Fetch all purchases
app.get("/purchases", async (req, res) => {
  const purchases = await Purchase.find();
  res.json(purchases);
});

// Fetch total tokens burned
app.get("/burned", async (req, res) => {
  const totalBurned = await Burn.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  res.json({ totalBurned: totalBurned[0]?.total || 0 });
});

// Fetch user balance and vesting schedule
app.get("/user/:address", async (req, res) => {
  try {
    const address = req.params.address;
    const balance = await contract.balanceOf(address);
    const vesting = await contract.vestingBalances(address);
    res.json({ balance: balance.toString(), vesting: vesting.toString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pause token purchase (Owner only)
app.post("/pause", async (req, res) => {
  try {
    const tx = await contract.pausePurchases();
    await tx.wait(); // Wait for transaction confirmation
    res.json({ message: "Purchases paused" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update token price (Owner only)
app.post("/update-price", async (req, res) => {
  try {
    const { newPrice } = req.body;
    const tx = await contract.updateTokenPrice(newPrice);
    await tx.wait(); // Wait for confirmation
    res.json({ message: "Token price updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
