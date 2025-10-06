import { useState } from "react";
import { Download, Loader2, Copy, Check, AlertCircle, X, Mail, Phone, ExternalLink } from "lucide-react";

function App() {
    const [url, setUrl] = useState("");
    const [media, setMedia] = useState(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState("");

    const API_BASE = import.meta.env.DEV
        ? 'http://localhost:5000/api'
        : '/api';

    // Add this function to proxy thumbnails
    const getProxiedThumbnail = (thumbnailUrl) => {
        if (!thumbnailUrl) return null;

        // Only proxy Instagram thumbnails (you can add other domains if needed)
        if (thumbnailUrl.includes('instagram.com') || thumbnailUrl.includes('cdninstagram.com')) {
            return `/api/thumbnail-proxy?url=${encodeURIComponent(thumbnailUrl)}`;
        }

        return thumbnailUrl;
    };

    // Add this function to handle direct downloads
    const handleDownload = async (downloadUrl, filename = 'video.mp4') => {
        try {
            // Create a temporary anchor element
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            link.target = '_blank';

            // Trigger the download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Fallback: If the above doesn't work, open in new tab
            setTimeout(() => {
                window.open(downloadUrl, '_blank');
            }, 1000);

        } catch (err) {
            console.error('Download error:', err);
            // Fallback to original behavior
            window.open(downloadUrl, '_blank');
        }
    };

    const fetchMediaInfo = async () => {
        if (!url.trim()) {
            setError("Please paste a video link");
            return;
        }

        setLoading(true);
        setMedia(null);
        setError("");

        try {
            // Determine which API to use based on URL
            let apiEndpoint;

            if (url.includes('youtube.com') || url.includes('youtu.be')) {
                apiEndpoint = 'youtube-download';
            } else {
                apiEndpoint = 'media-info';
            }

            console.log("🌐 Calling endpoint:", `${API_BASE}/${apiEndpoint}?url=${encodeURIComponent(url)}`);

            const res = await fetch(`${API_BASE}/${apiEndpoint}?url=${encodeURIComponent(url)}`);
            const data = await res.json();

            console.log("📡 API Response:", data);

            if (data.ok === false) {
                setError(data.error || "Could not fetch media. Please check the link and try again.");
            } else {
                setMedia(data);
            }
        } catch (err) {
            console.error("❌ Frontend error:", err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            fetchMediaInfo();
        }
    };

    const clearAll = () => {
        setUrl("");
        setMedia(null);
        setError("");
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    const supportedPlatforms = [
        { name: "Instagram", downloadable: true },
        { name: "Facebook", downloadable: true },
        { name: "Pinterest", downloadable: true },
        { name: "Reddit", downloadable: true },
        { name: "LinkedIn", downloadable: false },
        { name: "Youtube", downloadable: false },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
            {/* Header */}
            <header className="w-full bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center">
                    {/* Logo (icon) */}
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                            <Download className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                        </div>
                        {/* Text beside logo */}
                        <h1 className="ml-3 text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                            Easy Video Downloader
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-grow flex flex-col items-center justify-center px-4 py-8 sm:py-12">
                <p className="text-base sm:text-lg text-gray-600 mb-4 px-2">
                    Download videos from your favorite social media platforms - no ads, no hassle
                </p>

                {/* Supported Platforms */}
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 mb-6 ">
                    {supportedPlatforms.map((platform) => (
                        <span
                            key={platform.name}
                            className={`px-3 py-1 sm:px-4 sm:py-1.5 bg-white rounded-full text-xs sm:text-sm shadow-sm border ${
                                platform.downloadable
                                    ? 'text-green-700 border-green-200'
                                    : 'text-gray-500 border-gray-200'
                            }`}
                            title={platform.downloadable ? 'Supports download' : 'Preview only'}
                        >
                                {platform.name} {platform.downloadable ? '✓' : '👀'}
                            </span>
                    ))}
                </div>

                {/* Input Section */}
                <div className="w-full max-w-2xl px-4">
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100">
                        <label className="block text-sm sm:text-base font-semibold text-gray-700 mb-3 sm:mb-4">
                            Paste your video link here
                        </label>

                        <div className="relative">
                            <input
                                type="text"
                                value={url}
                                onChange={(e) => {
                                    setUrl(e.target.value);
                                    setError("");
                                }}
                                onKeyPress={handleKeyPress}
                                placeholder="Paste Link Here....."
                                className="w-full px-4 sm:px-5 py-3 sm:py-4 pr-10 sm:pr-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm sm:text-base"
                            />
                            {url && (
                                <button
                                    onClick={clearAll}
                                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            )}
                        </div>

                        {error && (
                            <div className="mt-4 flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl sm:rounded-2xl">
                                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700 text-sm sm:text-base">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={fetchMediaInfo}
                            disabled={!url.trim() || loading}
                            className="w-full mt-4 sm:mt-6 px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2 sm:gap-3">
                                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                    Getting your video...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2 sm:gap-3">
                                    <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                                    Get Download Link
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Results */}
                    {media && media.ok !== false && (
                        <div className="mt-6 sm:mt-8 bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                            {/* Thumbnail - Updated to use proxy */}
                            {media.thumbnail && (
                                <div className="relative aspect-video bg-gray-100">
                                    <img
                                        src={getProxiedThumbnail(media.thumbnail)}
                                        alt="Video thumbnail"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback if proxy fails - use original URL
                                            if (e.target.src !== media.thumbnail) {
                                                e.target.src = media.thumbnail;
                                            }
                                        }}
                                    />
                                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/70 backdrop-blur-sm rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-semibold">
                                        {media.source || "Unknown"}
                                    </div>
                                </div>
                            )}

                            {/* Info */}
                            <div className="p-5 sm:p-6 md:p-8">
                                <div className="mb-4 sm:mb-6">
                                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">Type</p>
                                    <p className="text-base sm:text-lg font-semibold text-gray-800 capitalize">
                                        {media.type || "Video"}
                                    </p>
                                </div>

                                {media.author && (
                                    <div className="mb-3 sm:mb-4">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-1">Author</p>
                                        <p className="text-sm sm:text-base font-medium text-gray-800">
                                            {media.author}
                                        </p>
                                    </div>
                                )}

                                {media.title && (
                                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                                        <p className="text-xs sm:text-sm text-gray-500 mb-2">Content</p>
                                        <p className="text-sm sm:text-base text-gray-700">
                                            {media.title}
                                        </p>
                                    </div>
                                )}

                                {/* Download Section */}
                                {media.download_url ? (
                                    <div className="space-y-3 sm:space-y-4">
                                        <button
                                            onClick={() => handleDownload(media.download_url, `${media.source}-video.mp4`)}
                                            className="flex items-center justify-center gap-2 sm:gap-3 w-full px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
                                        >
                                            <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                                            Download Video Now
                                        </button>

                                        <button
                                            onClick={() => copyToClipboard(media.download_url)}
                                            className="flex items-center justify-center gap-2 sm:gap-3 w-full px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all text-sm sm:text-base"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                                    Link Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-5 h-5 sm:w-6 sm:h-6" />
                                                    Copy Link
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    // Platform doesn't support downloads (LinkedIn, etc.)
                                    <div className="text-center py-4">
                                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            Download Not Available
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-4">
                                            {media.source === 'linkedin'
                                                ? "LinkedIn videos cannot be downloaded due to platform restrictions."
                                                : "Direct download is not available for this platform."
                                            }
                                        </p>
                                        <div className="flex gap-3 justify-center">
                                            <a
                                                href={media.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                View on {media.source}
                                            </a>
                                            <button
                                                onClick={() => copyToClipboard(media.url)}
                                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                                            >
                                                <Copy className="w-4 h-4" />
                                                Copy Link
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>

                {/* Instructions */}
                {!media && !loading && (
                    <div className="mt-8 sm:mt-12 max-w-2xl px-4">
                        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 border border-gray-100">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
                                How to use:
                            </h3>
                            <ol className="space-y-3 sm:space-y-4">
                                <li className="flex gap-3 sm:gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                        1
                                    </span>
                                    <p className="text-sm sm:text-base text-gray-700 pt-0.5 sm:pt-1">
                                        Copy the video link from Instagram, TikTok, Facebook, or any supported platform
                                    </p>
                                </li>
                                <li className="flex gap-3 sm:gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                        2
                                    </span>
                                    <p className="text-sm sm:text-base text-gray-700 pt-0.5 sm:pt-1">
                                        Paste the link in the box above
                                    </p>
                                </li>
                                <li className="flex gap-3 sm:gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                        3
                                    </span>
                                    <p className="text-sm sm:text-base text-gray-700 pt-0.5 sm:pt-1">
                                        Click "Get Download Link" and wait a moment
                                    </p>
                                </li>
                                <li className="flex gap-3 sm:gap-4">
                                    <span className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm sm:text-base">
                                        4
                                    </span>
                                    <p className="text-sm sm:text-base text-gray-700 pt-0.5 sm:pt-1">
                                        Click "Download Video" to save it to your device
                                    </p>
                                </li>
                            </ol>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-6 sm:py-8 mt-12 sm:mt-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center">
                        <p className="mb-3 sm:mb-4 text-sm sm:text-base">
                            Developed by <strong>Success Chukwuemeka</strong>
                        </p>
                        <p className="text-gray-400 mb-3 sm:mb-4 text-xs sm:text-sm">Let's connect:</p>

                        {/* Links */}
                        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-6">
                            <a
                                href="mailto:successdanesy@gmail.com?subject=Inquiry%20about%20your%20services"
                                className="flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-white transition-colors text-xs sm:text-sm"
                                title="Email"
                            >
                                <Mail className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span>Email</span>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/success-chu?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-white transition-colors text-xs sm:text-sm"
                                title="LinkedIn"
                            >
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                                <span>LinkedIn</span>
                            </a>
                            <a
                                href="https://github.com/successdanesy"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-white transition-colors text-xs sm:text-sm"
                                title="GitHub"
                            >
                                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                </svg>
                                <span>GitHub</span>
                            </a>
                            <a
                                href="https://wa.me/2347088193394?text=Hello%2C%20I%27m%20interested%20in%20your%20services"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 sm:gap-2 text-gray-300 hover:text-white transition-colors text-xs sm:text-sm"
                                title="WhatsApp"
                            >
                                <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
                                <span>WhatsApp</span>
                            </a>
                        </div>

                        {/* Disclaimer Section */}
                        <div className="border-t border-gray-700 pt-4 mt-6 space-y-2">
                            <p className="text-xs sm:text-sm text-gray-400 max-w-3xl mx-auto">
                                Note: This tool currently works best on <strong>computers and Android devices</strong>.
                                iOS support may be limited.
                            </p>

                            <p className="text-xs sm:text-sm text-gray-400 max-w-3xl mx-auto">
                                Disclaimer: Easy Video Downloader is an independent, third-party project.
                                We are <strong>not affiliated with, endorsed, or sponsored by Instagram, Facebook, TikTok, Pinterest, Reddit, or any other platform</strong>.
                                All trademarks and copyrights belong to their respective owners.
                            </p>

                            <p className="text-xs sm:text-sm text-gray-400 max-w-3xl mx-auto">
                                This was created as a lightweight, ad-free alternative for personal use.
                            </p>

                            <p className="text-xs sm:text-sm text-gray-500 mt-4">
                                © {new Date().getFullYear()} Easy Video Downloader. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
}

export default App;