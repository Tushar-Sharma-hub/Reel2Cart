const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const SAMPLE_PRODUCTS = [
  { asin: "B0C1G1AAA1", title: "Portable Mini Tripod for Phones & Cameras", price: "₹699", url: "https://www.amazon.in/dp/B0C1G1AAA1", image: "https://picsum.photos/seed/tripod/400/300" },
  { asin: "B09ZK2BBB2", title: "LED Ring Light 12\" with Stand", price: "₹1,299", url: "https://www.amazon.in/dp/B09ZK2BBB2", image: "https://picsum.photos/seed/ringlight/400/300" },
  { asin: "B08LM3CCC3", title: "Wireless Lavalier Mic (Type-C)", price: "₹1,099", url: "https://www.amazon.in/dp/B08LM3CCC3", image: "https://picsum.photos/seed/mic/400/300" },
];

app.post("/extract-products", (req, res) => {
  const { reelUrl } = req.body;
  console.log("Received Reel URL:", reelUrl);
  res.json(SAMPLE_PRODUCTS);
});

app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
