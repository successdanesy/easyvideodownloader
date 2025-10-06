import fetch from "node-fetch";

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ ok: false, error: "Missing url" });
    }

    const API_KEY = process.env.FASTSAVER_API_KEY; // your FastSaver token
    const FASTSAVER_API = "https://fastsaverapi.com/get-info";

    try {
        // ✅ The new API requires the token as a query parameter
        const apiUrl = `${FASTSAVER_API}?token=${API_KEY}&url=${encodeURIComponent(url)}`;

        const apiRes = await fetch(apiUrl, {
            headers: { accept: "application/json" },
        });

        if (!apiRes.ok) {
            const text = await apiRes.text();
            throw new Error(`FastSaver API error (${apiRes.status}): ${text}`);
        }

        const data = await apiRes.json();
        res.json(data);
    } catch (err) {
        console.error("⚠️ Error calling FastSaver:", err);
        res.status(500).json({ ok: false, error: err.message });
    }
}
