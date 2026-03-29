# HushLink ⚡

**HushLink** is a modern, real-time, privacy-focused web chat application built with a striking Neo-Brutalist design language. 

It completely reimagines how you connect online by offering maximum control over who can message you without ever requiring a phone number or email address. 

## 🌟 Key Features
- **Two Distinct Privacy Tiers:**
  - **Local Mode:** Keep your profile open. Anyone on HushLink can immediately jump into a direct message with you.
  - **Private Mode:** Lock it down. Users must send a "Chat Request" which you can strictly approve or deny before a single message goes through.
- **Anonymous Messaging:** An integrated toggle allows you to send 'ghost' messages safely while keeping your main identity secure.
- **Real-Time Database Syncing:** Powered by Supabase Realtime Channels, ensuring messages pop up instantly without requiring page refreshes.
- **Neo-Brutalist Aesthetic:** Unique, highly contrasted UI utilizing hard shadows, vibrant primary colors, and structural geometry for a bold modern feel.

## 🛠 Tech Stack
- **Frontend Engine:** React, Vite
- **Routing:** React Router DOM
- **Backend/Database as a Service:** Supabase (PostgreSQL)
- **Realtime Networking:** `@supabase/supabase-js` Realtime Channels
- **Styling:** Pure Vanilla CSS (No bloat, strict Brutalist tokens)

## 🚀 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/HushLink.git
   cd HushLink
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Rename `.env.example` to `.env`.
   - Add your Supabase project URL and anon key:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key-here"
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## 🌐 Vercel Deployment

HushLink is fully decoupled from dedicated servers, making it 100% compatible with Vercel's static hosting. 

To deploy:
1. Push this repository to GitHub.
2. Inside Vercel, import the new repository.
3. Open the **Environment Variables** section before deploying and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will automatically run `npm run build` and output the site globally for free!

> **Note:** Ensure you have configured **Row Level Security (RLS)** in your Supabase dashboard before actively sharing your production URL.
