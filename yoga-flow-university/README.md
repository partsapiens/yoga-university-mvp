# Yoga Flow University

AI-powered yoga platform for creating personalized flows, tracking practice, and developing teaching skills.

## Quick Start

1. **Create Next.js project**
```bash
npx create-next-app@latest yoga-flow-university --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd yoga-flow-university
```

2. **Copy all files above into your project structure**

3. **Install dependencies**
```bash
npm install @supabase/auth-helpers-nextjs @supabase/auth-helpers-react @supabase/supabase-js framer-motion html2canvas jspdf lucide-react
```

4. **Set up environment**
```bash
# Create .env.local with the Supabase credentials shown above
```

5. **Run development server**
```bash
npm run dev
```

## Deployment to Netlify

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/yoga-flow-university.git
git push -u origin main
```

2. **Deploy to Netlify**
- Go to netlify.com
- "New site from Git" → Connect GitHub → Select repository
- Build settings:
  - Build command: `npm run build`
  - Publish directory: `out`
- Add environment variables in Netlify dashboard
- Deploy!

## Features

- 🧘‍♀️ **Pose Library** - Comprehensive poses with instructions
- 🤖 **AI Flow Builder** - Smart suggestions and safety checks
- 📊 **Practice Analytics** - Track progress and balance
- 📝 **Digital Journal** - Log practices and insights
- 📱 **Mobile Responsive** - Works on all devices
- 🔄 **Real-time Updates** - Supabase backend integration

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Netlify
- **AI**: Custom flow suggestion engine

Visit your deployed site and start building yoga flows!

# INSTALLATION INSTRUCTIONS

## Step-by-Step Setup

1. **Create the project**
```bash
npx create-next-app@latest yoga-flow-university --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd yoga-flow-university
```

2. **Replace/create each file above**
   - Copy each section into the corresponding file path
   - Make sure to create the folder structure in src/

3. **Install additional packages**
```bash
npm install @supabase/auth-helpers-nextjs @supabase/auth-helpers-react @supabase/supabase-js framer-motion html2canvas jspdf lucide-react
```

4. **Create .env.local with your Supabase credentials**

5. **Test locally**
```bash
npm run dev
```

6. **Deploy to Netlify**
   - Push to GitHub
   - Connect repository to Netlify
   - Set environment variables
   - Deploy!

Your modern, framework-based Yoga Flow University platform will be live!

## File Structure Should Look Like:
```
yoga-flow-university/
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── netlify.toml
├── .env.local
├── README.md
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── components/
    │   ├── layout/
    │   │   └── Navigation.tsx
    │   ├── poses/
    │   │   ├── PoseLibrary.tsx
    │   │   └── PoseCard.tsx
    │   ├── flows/
    │   │   └── FlowBuilder.tsx
    │   └── journal/
    │       └── Journal.tsx
    ├── types/
    │   └── index.ts
    └── lib/
        └── supabase.ts
```
