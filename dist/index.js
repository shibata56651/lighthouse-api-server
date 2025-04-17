import express from "express";
import cors from "cors";
import { runLighthouse } from "./lighthouse.js";
const app = express();
app.use(cors());
app.use(express.json());
// ✅ 複数URLに対応
app.post("/api/lighthouse", async (req, res) => {
    const { urls } = req.body;
    if (!Array.isArray(urls) || urls.length === 0) {
        res.status(400).json({ error: "Invalid request: 'urls' must be a non-empty array of strings." });
        return;
    }
    try {
        const results = await Promise.all(urls.map((url) => runLighthouse(url).catch((e) => ({ url, error: e.message || "Failed" }))));
        res.json(results);
    }
    catch (error) {
        console.error("Lighthouse API Error:", error);
        res.status(500).json({ error: error.message || "Unknown error" });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
