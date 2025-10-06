# 🎬 Easy Video Downloader

<div>

[![React](https://img.shields.io/badge/React-18.2.0-%2361DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-%23339933?logo=node.js)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-%23000000?logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-%230075a8?logo=opensourceinitiative)]()

A modern, responsive web application for downloading videos from popular social media platforms. Fast, secure, and completely free.

[Live Demo](https://your-app.vercel.app) · [Report Bug](https://github.com/successdanesy/video-downloader/issues) · [Request Feature](https://github.com/successdanesy/video-downloader/issues)

![Easy Video Downloader Preview](https://your-domain.vercel.app/og-image.png)

</div>

## ✨ Features

### 🚀 Core Features
- **Multi-Platform Support**: Download videos from Instagram, Facebook, TikTok, Pinterest, and Reddit
- **Real-time Preview**: See video thumbnails and information before downloading
- **One-Click Download**: Simple and intuitive download process
- **Copy Links**: Easy link copying functionality
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile

### 🛡️ Quality & Security
- **No Ads**: Clean, distraction-free interface
- **Privacy Focused**: No data storage or tracking
- **Fast Processing**: Optimized for quick video processing
- **Secure API**: Professional API integration for reliable service

### 🎨 User Experience
- **Modern UI**: Beautiful gradient design with smooth animations
- **Loading States**: Clear feedback during processing
- **Error Handling**: Helpful error messages and recovery options
- **Platform Indicators**: Clear labels showing download availability

## 🎯 Supported Platforms

| Platform | Download | Preview | Notes |
|----------|----------|---------|--------|
| Instagram | ✅ | ✅ | Full support for reels, posts, and stories |
| Facebook | ✅ | ✅ | Supports most public videos |
| TikTok | ✅ | ✅ | Reels and regular posts |
| Pinterest | ✅ | ✅ | Video pins and posts |
| Reddit | ✅ | ✅ | Video posts and clips |
| LinkedIn | ❌ | ✅ | Preview only (platform restrictions) |

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

### Backend & API
- **Node.js** - Runtime environment
- **Express.js** - Web framework (development)
- **FastSaver API** - Video processing service
- **Vercel Serverless** - Production deployment

### Deployment & Infrastructure
- **Vercel** - Frontend hosting and serverless functions
- **Environment Variables** - Secure configuration management

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager
- FastSaver API account ([Get API Key](https://fastsaverapi.com))

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/successdanesy/videodownloader.git
   cd videodownloader

2. **Install dependencies**
    ```bash
   npm install

3. **Environment Configuration** <br />
   ```bash
   # Create .env file and Copy .env.example to .env
    FASTSAVER_API_KEY=your_actual_api_key_here

4. **Start development servers**
    ```bash
       # Terminal 1 - Start backend (Express server)
       cd backend
       node server.js

       # Terminal 2 - Start frontend (React dev server)
       npm run dev
    
      #Open the localhost url in your browser

## Production Build

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 🌐 Deployment

### Vercel Deployment (Recommended)

**Prepare your repository**
```bash
git add .
git commit -m "feat: deploy to production"
git push origin main
```

**Deploy to Vercel**
- Fork or push to your GitHub repository
- Visit Vercel and import your project
- Configure environment variables in Vercel dashboard:
    - `FASTSAVER_API_KEY`: Your FastSaver API key
- Click "Deploy"

**Post-deployment**
- Your app will be available at `https://your-app.vercel.app`
- Set up custom domain (optional)
- Configure environment variables for different branches if needed

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `FASTSAVER_API_KEY` | Your FastSaver API key | Yes |

## 📁 Project Structure

```
video-downloader/
├── src/
│   ├── App.jsx                 # Main application component
│   └── api/
│       └── media-info.js       # Vercel serverless function
├── public/
│   ├── index.html             # HTML template
│   └── favicon.ico            # App icon
├── package.json               # Dependencies and scripts
├── vercel.json               # Vercel configuration
├── .env.example              # Environment variables template
└── README.md                 # Project documentation
```

## 🔧 API Reference

### Get Media Information
```http
GET /api/media-info?url={video_url}
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | string | URL of the video to download |

**Response:**
```json
{
  "ok": true,
  "source": "instagram",
  "type": "video",
  "thumbnail": "https://...",
  "download_url": "https://...",
  "caption": "Video caption...",
  "author": "username"
}
```

## 🤝 Contributing

We love your input! We want to make contributing as easy and transparent as possible.

### Development Process
1. Fork the repo and create your branch from `main`
2. Make your changes and test thoroughly
3. Add or update documentation as needed
4. Ensure your code follows the project style
5. Submit a pull request

### Reporting Issues
When reporting bugs, please include:
- Steps to reproduce the issue
- Expected vs actual behavior
- Browser and OS information
- Any error messages or screenshots

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Developer

**Success Chukwuemeka** - Full Stack Developer

- 📧 Email: successdanesy@gmail.com
- 💼 LinkedIn: Success Chukwuemeka
- 💻 GitHub: @successdanesy
- 📱 WhatsApp: +2347088193394

## 🙏 Acknowledgments

- FastSaver API for reliable video processing
- Lucide for the beautiful icon set
- Vercel for seamless deployment experience
- Tailwind CSS for the amazing utility framework

## 🔗 Useful Links

- Live Demo
- API Documentation
- React Documentation
- Vercel Documentation

---

<div>

### ⭐ Don't forget to star this repository if you find it helpful!

**Built with ❤️ by Success Chukwuemeka**

</div>

## 🎨 Additional Files You Might Want:

### .env.example
```
# FastSaver API Configuration
FASTSAVER_API_KEY=your_fastsaver_api_key_here
```

### LICENSE (MIT License)
```
MIT License

Copyright (c) 2025 Success Chukwuemeka

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```