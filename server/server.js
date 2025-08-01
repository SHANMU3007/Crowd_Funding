require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Add this to your .env file
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Add this to your .env file
});
app.post("/api/payment/orders", async (req, res) => {
  const { amount, currency = "INR" } = req.body;

  try {
    const options = {
      amount: amount * 100, // Amount in paise (multiply by 100 for INR)
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
});

const crypto = require("crypto");

app.post("/api/payment/verify", (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    res.json({ message: "Payment verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid payment signature" });
  }
});

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/crowdfundingDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goal: { type: Number, required: true },
  funded: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Project = mongoose.model("Project", projectSchema);

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Auth Routes
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ 
      message: "✅ User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "❌ Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Both email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "❌ User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "❌ Invalid Credentials" });
    }

    res.json({
      message: "✅ Login Successful",
      user: { 
        _id: user._id,
        name: user.name, 
        email: user.email 
      }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "❌ Server Error" });
  }
});

// Project Routes
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name');
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ message: "Error fetching projects" });
  }
});

app.post("/api/projects/:id/donate", async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, userId } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ message: "Invalid donation amount" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.funded += Number(amount);
    await project.save();

    res.json(project);
  } catch (err) {
    console.error("Donation error:", err);
    res.status(500).json({ message: "Donation failed" });
  }
});

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});