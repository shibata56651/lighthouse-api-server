import express from "express";
import cors from "cors";
import { runLighthouse } from "./lighthouse.js";
const app = express();
app.use(cors());
app.use(express.json());
// ✅ ハンドラーを別で定義
const lighthouseHandler = async (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
        res.status(400).json({ error: "Invalid URL" });
        return;
    }
    try {
        const result = await runLighthouse(url);
        res.json(result);
    }
    catch (error) {
        console.error("Lighthouse Error:", error);
        res.status(500).json({ error: error.message || "Failed to run Lighthouse" });
    }
};
// ✅ 正しくバインドされる
app.post("/api/lighthouse", lighthouseHandler);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
