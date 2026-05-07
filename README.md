# Content Broadcasting System Frontend

A scalable React.js / Next.js application built for an educational environment where teachers can upload content and principals can manage approvals. The application supports role-based authentication and a public broadcasting view.

## Features
- **Role-based Authentication**: Separate views and permissions for Principals and Teachers.
- **Teacher Dashboard**: Upload content (with file and scheduling capabilities), track approval status, view statistics.
- **Principal Dashboard**: Review pending content, approve or reject with mandatory reasons, filter through all content.
- **Public Live Broadcast**: Real-time rotating display of active, approved content.

## Tech Stack
- Next.js (App Router)
- React.js
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod
- date-fns

## Setup Instructions

1. **Install Dependencies**
\`\`\`bash
npm install
\`\`\`

2. **Run Development Server**
\`\`\`bash
npm run dev
\`\`\`

3. **Open the application**
Open [http://localhost:3000](http://localhost:3000) with your browser.

## Demo Credentials
- **Principal**: `principal@school.com` / `password`
- **Teacher**: `teacher@school.com` / `password`

## Architecture Notes
- See `Frontend-notes.txt` for detailed architectural decisions, state management flow, and API mocking approach.
