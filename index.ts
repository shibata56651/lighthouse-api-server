import express, { Request, Response } from "express";
import cors from "cors";
import { runLighthouse } from "./lighthouse.js";

const app = express();

app.use(
  cors({
    origin: "https://a11y-tool-collections.vercel.app", // ← あなたのフロントURL
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// ✅ 複数URLに対応
app.post("/api/lighthouse", async (req: Request, res: Response): Promise<void> => {
  const { urls } = req.body;

  if (!Array.isArray(urls) || urls.length === 0) {
    res.status(400).json({ error: "Invalid request: 'urls' must be a non-empty array of strings." });
    return;
  }

  try {
    const results = await Promise.all(
      urls.map((url) => runLighthouse(url).catch((e) => ({ url, error: e.message || "Failed" })))
    );
    res.json(results);
  } catch (error: any) {
    console.error("Lighthouse API Error:", error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
