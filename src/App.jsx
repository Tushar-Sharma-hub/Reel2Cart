/*
reel2cart — Frontend MVP (src/App.jsx)
Instructions:
1) Create a Vite React project: npx create-vite@latest reel2cart -- --template react
2) Replace src/App.jsx with this file, replace src/main.jsx if needed to import './index.css'.
3) Install deps: npm i framer-motion
4) Install tailwind (follow Tailwind + Vite instructions) and add the index.css shown below.
5) Run: npm run dev

This single-file app is a polished frontend-only MVP that:
- Takes an Instagram Reel URL input
- On "Extract" it mocks extraction and shows product cards (image, title, price, link)
- Lets you Download JSON of products and Copy all links
- Uses Framer Motion for small animations

Notes: images are mocked using picsum.photos and product links are placeholders. Feel free to wire backend later.
*/

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [url, setUrl] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function seedFromUrl(u) {
    // simple deterministic number from URL
    let s = 0;
    for (let i = 0; i < u.length; i++) s = (s * 31 + u.charCodeAt(i)) % 100000;
    return s;
  }

  function mockExtract(u) {
    setCopied(false);
    if (!u || !u.includes("instagram.com")) {
      // still allow demo with non-IG input, but warn
    }
    setLoading(true);
    setProducts([]);
    setTimeout(() => {
      const seed = seedFromUrl(u || Date.now().toString());
      const count = 3 + (seed % 4); // 3-6 products
      const generated = Array.from({ length: count }).map((_, i) => {
        const id = seed + i;
        return {
          id: `prod-${id}`,
          title: `Smart Find — Model ${((id % 90) + 10)}${String.fromCharCode(65 + (id % 26))}`,
          price: (Math.round(((10 + (id % 200)) + (id % 99) / 100) * 100) / 100).toFixed(2),
          image: `https://picsum.photos/seed/${id}/400/300`,
          link: `https://example.com/product/${id}`,
        };
      });
      setProducts(generated);
      setLoading(false);
    }, 700); // mock latency for nice animation
  }

  function downloadJSON() {
    if (!products.length) return;
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reel2cart-products.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyAllLinks() {
    if (!products.length) return;
    const all = products.map((p) => p.link).join("\n");
    try {
      await navigator.clipboard.writeText(all);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Clipboard failed", e);
      alert("Copy failed — allow clipboard access or copy manually:\n" + all);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-start justify-center p-6">
      <div className="w-full max-w-4xl">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-extrabold">Reel2Cart — 2‑Day MVP</h1>
            <div className="text-sm text-gray-600">Frontend-only • Mock extraction</div>
          </div>
          <p className="mt-2 text-gray-600">Paste an Instagram Reel URL and press <strong>Extract</strong>. The app will show mock product cards you can download.</p>
        </motion.header>

        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-white p-6 rounded-2xl shadow-md"
        >
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <label className="flex-1">
              <div className="text-xs text-gray-500 mb-2">Instagram Reel URL</div>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/XXXXXXXXX/"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </label>

            <div className="flex gap-3">
              <button
                onClick={() => mockExtract(url)}
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg shadow hover:bg-indigo-700"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
                ) : null}
                <span>Extract</span>
              </button>

              <button
                onClick={downloadJSON}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-lg hover:shadow"
                disabled={!products.length}
              >
                Download JSON
              </button>

              <button
                onClick={copyAllLinks}
                className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-lg hover:shadow"
                disabled={!products.length}
              >
                {copied ? "Links Copied ✓" : "Copy all links"}
              </button>
            </div>
          </div>

          <div className="mt-6">
            <AnimatePresence>
              {products.length === 0 && !loading ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-gray-500"
                >
                  No products yet — paste a Reel URL and click <strong>Extract</strong> to see mocked results.
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {products.map((p) => (
                  <motion.article
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm truncate">{p.title}</h3>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-lg font-bold">₹{p.price}</div>
                        <div className="flex items-center gap-2">
                          <a href={p.link} target="_blank" rel="noreferrer" className="text-xs underline">Open</a>
                          <button
                            onClick={() => navigator.clipboard.writeText(p.link)}
                            className="text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                        <div>Seller: Demo Store</div>
                        <div>{Math.floor(50 + (parseInt(p.id.replace(/\D/g, "")) % 500))} sold</div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        <footer className="mt-6 text-sm text-gray-500 text-center">
          This is a frontend demo — mock data only. Wire a backend later to perform real scraping or API calls.
        </footer>
      </div>
    </div>
  );
}
