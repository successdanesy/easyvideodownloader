import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ ok: false, error: "Missing YouTube URL" });
    }

    const FASTSAVER_API = "https://beta.fastsaverapi.com";
    const API_KEY = process.env.FASTSAVER_API_KEY;

    try {
        console.log('🔧 Getting YouTube video information...');

        // Only get video info (since download is broken)
        const infoResponse = await fetch(`${FASTSAVER_API}/youtube/info?url=${encodeURIComponent(url)}`, {
            method: "GET",
            headers: {
                "api-key": API_KEY,
                "accept": "application/json",
            },
        });

        const infoText = await infoResponse.text();
        console.log("📡 YouTube Info Response:", infoText);

        let infoData;
        try {
            infoData = JSON.parse(infoText);
        } catch {
            throw new Error('Invalid JSON from YouTube info endpoint');
        }

        // Return video info with clear message about download limitations
        res.json({
            ok: true,
            source: 'youtube',
            type: 'info',
            title: infoData.title || 'YouTube Video',
            thumbnail: infoData.thumbnails?.max || infoData.thumbnails?.low || `https://img.youtube.com/vi/${extractVideoId(url)}/hqdefault.jpg`,
            download_url: null,
            caption: infoData.title,
            author: infoData.channel || 'YouTube',
            unavailable: true,
            message: "YouTube Download Service Temporarily Unavailable",
            reason: "The YouTube download service is currently undergoing maintenance. Please try other platforms like Instagram, Facebook, or TikTok.",
            video_info: {
                channel: infoData.channel,
                duration: infoData.duration,
                view_count: infoData.view_count
            },
            watch_on_youtube: url
        });

    } catch (err) {
        console.error('❌ YouTube API error:', err);

        // Fallback response
        res.status(200).json({
            ok: true,
            source: 'youtube',
            type: 'info',
            title: 'YouTube Video',
            thumbnail: `https://img.youtube.com/vi/${extractVideoId(url)}/hqdefault.jpg`,
            download_url: null,
            caption: 'Video content',
            author: 'YouTube',
            unavailable: true,
            message: "YouTube Download Service Unavailable",
            reason: "Due to technical limitations with YouTube's platform, video downloads are not currently available. Please try other social media platforms.",
            watch_on_youtube: url
        });
    }
}

function extractVideoId(url) {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : 'unknown';
}