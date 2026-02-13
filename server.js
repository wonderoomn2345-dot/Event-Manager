const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// ================= EMAIL CONFIG =================
// IMPORTANT: Replace with your Gmail App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "gonchijashwitha@gmail.com",
    pass: "YOUR_APP_PASSWORD"
  }
});

// ================= ORDER ROUTE =================
app.post("/order", async (req, res) => {
  const { name, email, address, cart } = req.body;

  if (!name || !email || !address || cart.length === 0) {
    return res.status(400).json({ message: "All fields required!" });
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const mailOptions = {
    from: email,
    to: "gonchijashwitha@gmail.com",
    subject: "🛍 New Fashion Store Order",
    html: `
      <h2>New Order Received</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Address:</b> ${address}</p>
      <h3>Items Ordered:</h3>
      <ul>
        ${cart.map(item => `<li>${item.name} - ₹${item.price}</li>`).join("")}
      </ul>
      <h3>Total: ₹${total}</h3>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending order email." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});