import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SAMPLE_PRODUCTS = [
  {
    asin: "B0C1G1AAA1",
    title: "Portable Mini Tripod for Phones & Cameras",
    price: "₹699",
    url: "https://www.amazon.in/dp/B0C1G1AAA1",
    image: "https://picsum.photos/seed/tripod/400/300",
  },
  {
    asin: "B09ZK2BBB2",
    title: "LED Ring Light 12\" with Stand",
    price: "₹1,299",
    url: "https://www.amazon.in/dp/B09ZK2BBB2",
    image: "https://picsum.photos/seed/ringlight/400/300",
  },
  {
    asin: "B08LM3CCC3",
    title: "Wireless Lavalier Mic (Type-C)",
    price: "₹1,099",
    url: "https://www.amazon.in/dp/B08LM3CCC3",
    image: "https://picsum.photos/seed/mic/400/300",
  },
];

export default function App() {
  const [link, setLink] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  function copyAllLinks() {
    const text = products.map((p) => p.url).join("\n");
    navigator.clipboard.writeText(text)
      .then(() => alert("All links copied!"))
      .catch(() => alert("Copy failed."));
  }

  function downloadJSON() {
    const data = { reelUrl: link, extractedAt: new Date().toISOString(), products };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "reel2cart-results.json";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  async function handleExtract() {
  if (!link) return alert("Paste a Reel link first!");
  setLoading(true);
  setProducts([]);

  try {
    const res = await fetch("http://localhost:5000/extract-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reelUrl: link }),
    });
    const data = await res.json();
    setProducts(data);
  } catch (err) {
    alert("Failed to fetch products");
    console.error(err);
  } finally {
    setLoading(false);
  }
}


  function handleDemo() {
    setLink("https://www.instagram.com/reel/DEMO-12345");
    setProducts([]);
    setLoading(false);
  }

  return (
    <div className="h-screen flex flex-col items-center justify-start bg-gray-50 pt-16">
      <Card className="w-full max-w-md shadow-lg rounded-2xl p-6">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-bold text-center text-brand-600">
            Reel2Cart 🎬🛒
          </h1>

          <Input
            type="text"
            placeholder="Paste Instagram Reel link..."
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full"
          />

          <div className="flex gap-2">
            <Button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={handleDemo}>
              Try Demo
            </Button>
            <Button className="w-full bg-brand-600 hover:bg-brand-700" onClick={handleExtract}>
              {loading ? "Extracting…" : "Extract Products"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading animation */}
      {loading && (
        <div className="w-full max-w-md space-y-4 mt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl" />
          ))}
        </div>
      )}

      {/* Copy / Download buttons */}
      {!loading && products.length > 0 && (
        <div className="flex justify-between max-w-md w-full mt-4 mb-2">
          <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={copyAllLinks}>
            Copy Links
          </Button>
          <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={downloadJSON}>
            Download JSON
          </Button>
        </div>
      )}

      {/* Products grid */}
      <div className="mt-2 w-full max-w-md grid grid-cols-1 gap-4">
        {products.map((p) => (
          <Card key={p.asin} className="shadow-sm rounded-xl overflow-hidden">
            <img src={p.image} alt={p.title} className="w-full h-32 object-cover" />
            <CardContent className="p-3">
              <h3 className="font-medium text-sm line-clamp-2">{p.title}</h3>
              <p className="text-brand-700 font-semibold mt-1">{p.price}</p>
              <a
                href={p.url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs text-white bg-gray-900 px-2 py-1 rounded hover:bg-black"
              >
                Buy on Amazon
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
