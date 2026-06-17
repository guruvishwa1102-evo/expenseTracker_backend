const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");
const authRoutes = require('./routes/auth');
// Force Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/auth', authRoutes);


app.get("/", (req, res) => {
    res.send("Smart Expense Tracker API is running smoothly!");
});

const MONGO_URI =
"mongodb+srv://guruvishwagv07_db_user:passGV@gvcluster0.l46mvo5.mongodb.net/expenseTracker?retryWrites=true&w=majority&appName=GVCluster0";

const PORT = process.env.PORT || 5000;
async function startServer() {
    try {
        await mongoose.connect(MONGO_URI);

        console.log("=================================");
        console.log("🍃 MongoDB Connected Successfully");
        console.log("=================================");

        // 🚨 NEW: We force Node to host specifically on the IPv4 loopback
        // Let Render dynamically assign the network port
        // Force Node to broadcast to the outside internet for Render
        

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

    } catch (err) {
        console.error("❌ MongoDB Connection Error");
        console.error(err);
    }
}

startServer();