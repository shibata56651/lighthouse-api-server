import express from "express";
import cors from "cors";
import { runLighthouse } from "./lighthouse.js";
const app = express();
app.use(cors());
app.use(express.json());
app.post("/api/lighthouse", async (req, res) => {
    const { url } = req.body;
    if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "Invalid URL" });
    }
    try {
        const result = await runLighthouse(url);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message || "Failed to run Lighthouse" });
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
