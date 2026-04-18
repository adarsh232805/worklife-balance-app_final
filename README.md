<div align="center">
  <br />
    <h1 align="center">WorkLife Balance App ⚖️</h1>
  <br />
  <p align="center">
    <strong>Master your productivity without sacrificing your wellness.</strong>
  </p>
</div>

---

## 🌟 Introduction

The **WorkLife Balance App** is an all-in-one platform built to empower high-achievers. Combining intense productivity frameworks like the Pomodoro technique with vital health-tracking mechanics (Hydration, Sleep, Caloric Intake), this application ensures you don't burn out while hitting your goals.

Enjoy personalized advice from an AI-powered coach, gamified progress ranking, a seamless calendar system, and immersive focus zones.

---

## ⚡ Features

- 🧠 **AI Coach Integration**: Powered by Google Gemini to analyze your pace and suggest wellness habits.
- 🍅 **Focus Modes**: Custom built Pomodoro timers, 90-minute deep-work cycles, and flow-states.
- 🧘 **Wellness Metrics**: Track sleep, walking, running, hydration, and custom personal goals.
- 🎮 **Gamification**: Earn XP, build streaks, and rank on the leaderboards as you check off tasks.
- 🗓️ **Calendar & Reminders**: Synced events, background push-notification polling, and proactive alerts.
- 🔒 **Secure Auth**: Custom-built credentials sign in with bcrypt encrypted passwords using NextAuth.

---

## 🏗️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: [NextAuth (v5 Beta)](https://authjs.dev/)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/) + Framer Motion
- **AI Service**: Google Generative AI (Gemini)

---

## 🚀 Getting Started Locally

### 1. Clone the repository
```bash
git clone https://github.com/your-username/worklife-balance-app.git
cd worklife-balance-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add the following keys:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/?appName=Worklife
AUTH_SECRET=your_super_secret_auth_key
NEXTAUTH_URL=http://localhost:3000
AUTH_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
```
*(Make sure to allow `0.0.0.0/0` on your MongoDB Atlas Network Access pane for local development!)*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## ☁️ Deployment

We recommend deploying on **[Vercel](https://vercel.com/)** for the most seamless Next.js experience.

1. Push your code to your GitHub repository.
2. Sign up on Vercel and **Import your GitHub repository**.
3. In the environment variables configuration tab during import, copy everything from your `.env.local`. Be sure to update `NEXTAUTH_URL` and `AUTH_URL` to your Vercel production domain link once generated (or leave it out, as Vercel securely handles automatic Auth URLs natively with Auth.js).
4. Hit **Deploy**. The static pages will beautifully compile in seconds!

---

<p align="center"><i>Empowering you to achieve peak performance while maintaining mental health.</i></p>
