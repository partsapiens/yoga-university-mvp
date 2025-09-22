# Yoga Flow University - 🤖 Powered Yoga Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-13.5-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-3-cyan?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/PWA-Ready-purple?style=for-the-badge" alt="PWA Ready">
</p>

A comprehensive web platform for yoga practitioners and teachers, featuring 🤖 powered flow creation, guided meditation, extensive pose libraries, and progressive web app capabilities. Built with modern web technologies and a focus on privacy, accessibility, and performance.

## ✨ Features

### 🧘‍♀️ **Yoga Flow Creation**
- **🤖 Powered Generation** — Create personalized sequences based on duration, intensity, and focus areas
- **Interactive Builder** — Drag-and-drop interface with real-time preview
- **Smart Sequencing** — 🤖 suggestions for safer, more effective flow transitions
- **Custom Durations** — Adjust individual pose timings and flow tempo
- **Voice Control** — Hands-free commands for seamless practice

### 🧠 **Meditation Center**
- **Guided Sessions** — Multiple meditation techniques with progress tracking
- **Custom Timers** — Flexible meditation timers with breathing visualizers
- **Progress Tracking** — Daily streaks and session statistics stored locally
- **Breathing Exercises** — Box breathing, 4-7-8 technique, and more
- **Background Sounds** — Ambient soundscapes for deeper practice

### 📚 **Comprehensive Resources**
- **Pose Library** — Detailed instructions, benefits, and modifications for 500+ poses
- **Teacher Manual** — Complete training materials and educational content
- **Search & Filter** — Fast, intelligent search across all content
- **Multi-language** — Support for English, German, Romanian, and Russian
- **Offline Access** — Download content for practice anywhere

### 🌐 **Modern Web Experience**
- **Progressive Web App** — Install on any device, works offline
- **Dark Mode** — Comfortable viewing in any lighting condition
- **Responsive Design** — Optimized for mobile, tablet, and desktop
- **Privacy-First** — Minimal analytics, local data storage, GDPR compliant
- **Fast Performance** — Optimized images, lazy loading, efficient caching

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/partsapiens/yoga-university-mvp.git
cd yoga-university-mvp

# Install dependencies
npm install

# Set up environment variables (optional - for 🤖 features)
cp .env.local.example .env.local
# Edit .env.local to add your OpenAI API key if you want 🤖 features

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### ⚙️ 🤖 Features Setup (Optional)

To enable 🤖 powered features like flow generation and meditation guidance:

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Add it to `.env.local`:
   ```bash
   OPENAI_API_KEY=sk-proj-your-api-key-here
   USE_MOCK=false
   ```
3. Restart the development server
4. Test with: `./check-openai-config.sh`

**Note**: 🤖 features work in fallback mode without an API key, providing default responses.

### Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── app/                          # Next.js 13 App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/                   # Main application pages
│   │   ├── dashboard/page.tsx    # User dashboard
│   │   ├── flows/create/page.tsx # Flow builder
│   │   ├── legal/               # Legal pages
│   │   │   ├── page.tsx         # Legal overview
│   │   │   ├── imprint/page.tsx # Company information
│   │   │   ├── privacy/page.tsx # Privacy policy
│   │   │   └── terms/page.tsx   # Terms of service
│   │   ├── manual/              # Teacher training manual
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── meditation/page.tsx  # Meditation center
│   │   ├── offline/page.tsx     # PWA offline page
│   │   ├── poses/page.tsx       # Pose library
│   │   └── page.tsx             # Landing page
│   ├── api/                     # API routes
│   │   ├── analytics/route.ts   # Privacy-friendly analytics
│   │   └── dashboard/stats/route.ts
│   ├── global-error.tsx         # Global error boundary
│   ├── layout.tsx              # Root layout with metadata
│   ├── manifest.ts             # PWA manifest
│   ├── not-found.tsx           # Custom 404 page
│   ├── robots.ts               # SEO robots.txt
│   └── sitemap.ts              # Dynamic sitemap
├── components/                  # Reusable React components
│   ├── flows/                  # Flow creation components
│   ├── help/                   # Contextual help system
│   │   └── Tooltip.tsx
│   ├── layout/                 # Layout components
│   │   ├── Footer.tsx          # Site footer with social links
│   │   └── Navigation.tsx      # Header navigation
│   └── ui/                     # UI components
├── hooks/                      # Custom React hooks
│   └── useLocalStorage.ts
├── lib/                        # Utility libraries
│   ├── analytics.tsx           # Privacy-friendly analytics
│   ├── i18n/                   # Internationalization
│   │   └── index.tsx
│   └── yoga-data.ts           # Yoga pose data
├── locales/                    # Translation files
│   ├── en/
│   ├── de/
│   ├── ro/
│   └── ru/
└── types/                      # TypeScript type definitions

public/
├── icons/                      # PWA icons and favicons
├── manual/                     # Static manual content
├── screenshots/                # PWA screenshots
└── sw.js                      # Service worker
```

## 🌟 Key Pages & Features

### 🏠 **Landing Page** (`/`)
Full-width hero section with compelling CTAs, feature overview, and smooth animations.

### 🧘 **Meditation Center** (`/meditation`)
- Guided meditation sessions with timers
- Breathing exercise visualizers  
- Progress tracking with streak counters
- Custom meditation timers

### 📖 **Pose Library** (`/poses`)
- Comprehensive pose database with search
- Detailed instructions and modifications
- Anatomical focus and benefits
- Contraindications and safety notes

### ✨ **Flow Creator** (`/flows/create`)
- 🤖 powered flow generation
- Interactive pose sequencing
- Real-time preview and playback
- Save and share custom flows

### 📚 **Training Manual** (`/manual`)
- Complete teacher training curriculum
- Progressive chapters and modules
- Search across all content
- Mobile-friendly reading experience

### ⚖️ **Legal Pages** (`/legal`)
- GDPR-compliant privacy policy
- Comprehensive terms of service
- Company imprint and contact info
- Transparent data handling practices

## 🛠️ Technical Features

### **Progressive Web App (PWA)**
- Installable on any device
- Offline functionality with service worker
- Background sync for data
- Push notifications for reminders
- App-like experience

### **Privacy & Security**
- Privacy-friendly analytics (no personal data)
- Local data storage (meditation streaks, preferences)
- GDPR compliant with consent management
- No tracking cookies or third-party scripts
- Transparent data practices

### **Performance**
- Optimized images with lazy loading
- Efficient caching strategies
- Minimal JavaScript bundles
- Fast page transitions
- Responsive design

### **Accessibility**
- WCAG AA compliance
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast support

### **SEO & Discoverability**
- Dynamic sitemap generation
- Structured data markup
- Open Graph meta tags
- Twitter Card support
- Optimized meta descriptions

## 🌍 Internationalization

Currently supports:
- **English** (en) - Primary language
- **German** (de) - Vollständige Übersetzung
- **Romanian** (ro) - Traducere completă  
- **Russian** (ru) - Полный перевод

Language detection happens automatically based on browser settings, with manual override available in the header.

## 📊 Analytics

Privacy-first analytics implementation:
- No personal data collection
- No cookies or tracking pixels
- Aggregated usage statistics only
- User consent required
- Full transparency about data collection

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run tests
npm run build:manual # Build manual from source
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Yoga community for inspiration and feedback
- Open source contributors
- Privacy advocates for guidance on data practices
- Accessibility experts for inclusive design principles

---

<p align="center">
  Made with 💙 for the global yoga community
</p>