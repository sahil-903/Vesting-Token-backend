# ERC-20 Token Backend (Node.js + Ethers.js + MongoDB)

This backend provides an API to interact with an **ERC-20 token** that includes vesting, purchase, and burning mechanisms. It connects to an **Ethereum-compatible blockchain** using `ethers.js` and **stores purchase and burn records** in MongoDB.

### Download and install dependencies
```

git clone https://github.com/sahil-903/Vesting-Token-backend.git
cd VESTING-TOKEN-BACKEND
nvm use 20.17.0
npm i
```

### Set env variables
Create .evn file at the root of the project and fill below values. Refer to env_sample for reference

```
PORT=
MONGO_URI=
PRIVATE_KEY=
RPC_URL=
CONTRACT_ADDRESS=
```
---

## 🚀 Features  
✅ **Track Token Purchases**  
✅ **Fetch Total Burned Tokens**  
✅ **Fetch User Balance & Vesting Schedule**  
✅ **Pause Token Purchases (Owner Only)**  
✅ **Update Token Price (Owner Only)**  

---

