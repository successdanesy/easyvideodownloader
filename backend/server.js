import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const FASTSAVER_API = "https://beta.fastsaverapi.com/media/info";
const API_KEY = process.env.FASTSAVER_API_KEY; // now uses env variable

// Universal media downloader
app.get("/api/media-info", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ ok: false, error: "Missing url" });

    try {
        const apiRes = await fetch(`${FASTSAVER_API}?url=${encodeURIComponent(url)}`, {
            method: "GET",
            headers: {
                "api-key": API_KEY,
                "accept": "application/json",
            },
        });

        const text = await apiRes.text();
        console.log("📡 Raw FastSaver API Response:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch {
            return res.status(500).json({ ok: false, error: "Invalid JSON from provider" });
        }

        res.json(data);
    } catch (err) {
        console.error("❌ Backend error:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));