import fetch from "node-fetch";
import * as cheerio from "cheerio"; // npm install cheerio

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ ok: false, error: "Missing url" });
    }

    const API_KEY = process.env.FASTSAVER_API_KEY;
    const FASTSAVER_API = "https://fastsaverapi.com/get-info";

    // --- Detect platform
    const getPlatform = (link) => {
        const map = [
            { name: "youtube", patterns: ["youtube.com", "youtu.be"] },
            { name: "facebook", patterns: ["facebook.com", "fb.watch"] },
            { name: "instagram", patterns: ["instagram.com"] },
            { name: "tiktok", patterns: ["tiktok.com"] },
            { name: "x", patterns: ["twitter.com", "x.com"] },
            { name: "linkedin", patterns: ["linkedin.com"] },
        ];
        const match = map.find((p) => p.patterns.some((str) => link.includes(str)));
        return match ? match.name : "unknown";
    };

    const platform = getPlatform(url);
    console.log(`🎯 Platform detected: ${platform}`);

    try {
        let data = null;

        // --- Strategy 1: Direct FastSaver API (YouTube + LinkedIn)
        if (["youtube", "linkedin"].includes(platform)) {
            console.log("📡 Using FastSaver API (direct)");
            const apiUrl = `${FASTSAVER_API}?token=${API_KEY}&url=${encodeURIComponent(url)}`;
            const apiRes = await fetch(apiUrl, { headers: { accept: "application/json" } });
            data = await apiRes.json();
        }

        // --- Strategy 2: FastSaver + OG fallback (Facebook, Instagram, TikTok, X)
        else if (["facebook", "instagram", "tiktok", "x"].includes(platform)) {
            console.log("📡 Using FastSaver + OG fallback");
            const apiUrl = `${FASTSAVER_API}?token=${API_KEY}&url=${encodeURIComponent(url)}`;
            const apiRes = await fetch(apiUrl, { headers: { accept: "application/json" } });
            let fastSaverData = await apiRes.json();

            // Check if we need extra metadata
            const missingMeta =
                !fastSaverData.thumbnail ||
                !fastSaverData.title ||
                fastSaverData.title.trim() === "";

            if (missingMeta) {
                console.log("🕵️ Fallback: Fetching OG metadata...");
                const meta = await fetchOGMetadata(url);
                fastSaverData = { ...fastSaverData, ...meta };
            }

            data = fastSaverData;
        }

        // --- Strategy 3: Unknown platform — only try OG metadata
        else {
            console.log("🕵️ Unknown platform, trying OG metadata only");
            data = await fetchOGMetadata(url);
            data.source = platform;
        }

        res.json(data);
    } catch (err) {
        console.error("⚠️ Error in media-info handler:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
}

// --- Helper: Fetch OG metadata
async function fetchOGMetadata(url) {
    try {
        const res = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
            },
        });
        const html = await res.text();
        const $ = cheerio.load(html);

        const title =
            $('meta[property="og:title"]').attr("content") ||
            $('meta[name="twitter:title"]').attr("content") ||
            "";
        const description =
            $('meta[property="og:description"]').attr("content") ||
            $('meta[name="twitter:description"]').attr("content") ||
            "";
        const thumbnail =
            $('meta[property="og:image"]').attr("content") ||
            $('meta[name="twitter:image"]').attr("content") ||
            "";

        return {
            ok: true,
            title,
            description,
            thumbnail,
        };
    } catch (error) {
        console.error("❌ Error fetching OG metadata:", error.message);
        return { ok: false, error: "Failed to fetch OG metadata" };
    }
}
