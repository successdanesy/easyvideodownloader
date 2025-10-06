import fetch from 'node-fetch';

export default async function handler(req, res) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'Missing thumbnail URL' });
    }

    try {
        // Fetch the image from Instagram
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
        }

        // Get the image buffer and content type
        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        // Set appropriate headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Send the image
        res.send(Buffer.from(imageBuffer));

    } catch (error) {
        console.error('Thumbnail proxy error:', error);
        res.status(500).json({ error: 'Failed to load thumbnail' });
    }
}