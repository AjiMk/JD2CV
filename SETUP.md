# JD2CV - Setup & Development Guide

## Quick Start

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including:
- Next.js 14
- React 18
- TailwindCSS
- Zustand (state management)
- jsPDF & html2canvas (PDF generation)
- React Icons

### 2. Run Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### 3. Build for Production

```bash
npm run build
npm start
```

## Application Flow

### 1. Landing Page (/)
- Welcome page with feature highlights
- Call-to-action buttons for login/register

### 2. Authentication
- **Register (/register)**: Create new account
- **Login (/login)**: Sign in to existing account
- Currently uses localStorage (temporary - will be replaced with real auth)

### 3. Dashboard (/dashboard)
Multi-step form to build your resume:

**Step 1: Personal Information**
- Full Name, Email, Phone
- Location, LinkedIn, GitHub, Portfolio
- Professional Summary

**Step 2: Education**
- Add multiple education entries
- Institution, Degree, Field of Study
- Dates, GPA, Achievements
- Edit/Delete existing entries

**Step 3: Work Experience**
- Add multiple work experiences
- Company, Position, Location
- Start/End dates or Current position
- Key achievements and responsibilities

**Step 4: Skills**
- Technical skills (programming languages, frameworks, tools)
- Soft skills (leadership, communication, etc.)
- Quick add from suggested skills

**Step 5: Job Description**
- Paste the job description you're applying for
- Helps optimize resume for ATS

### 4. Resume Preview (/resume)
- Live preview of your resume in FAANG format
- Download as PDF
- Edit details (returns to dashboard)
- AI-powered editing suggestions

## Features Explained

### State Management
- Uses Zustand for lightweight state management
- Data persisted in localStorage
- All form data is automatically saved

### PDF Generation
- Uses jsPDF and html2canvas
- Converts HTML resume to high-quality PDF
- Standard letter size (8.5" x 11")
- Optimized for printing

### ATS Optimization
The resume format follows FAANG-style guidelines:
- Clean, parseable format
- Standard section headings
- No tables, images, or complex formatting
- Proper hierarchy with clear sections
- Keyword-optimized

### AI Editing (Mock Implementation)
Current implementation is a demonstration. To implement real AI:
1. Get API key from OpenAI or Anthropic
2. Create API route in `/app/api/ai/improve/route.js`
3. Call the AI API with resume content and prompt
4. Return improved suggestions

Example integration:
```javascript
// app/api/ai/improve/route.js
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request) {
  const { prompt, content } = await request.json()
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a professional resume writer." },
      { role: "user", content: `${prompt}\n\nCurrent content: ${content}` }
    ]
  })
  
  return Response.json({ suggestion: completion.choices[0].message.content })
}
```

## Customization

### Styling
- All styles use TailwindCSS
- Primary color can be changed in `tailwind.config.js`
- Global styles in `app/globals.css`

### Resume Format
- Resume template is in `components/ResumePreview.js`
- Modify layout, fonts, spacing as needed
- Keep ATS-friendly (avoid complex formatting)

### Adding Features

**Add new form section:**
1. Create form component in `components/forms/`
2. Add state to `store/resumeStore.js`
3. Add tab to dashboard in `app/dashboard/page.js`
4. Update resume preview in `components/ResumePreview.js`

**Add backend API:**
1. Create API routes in `app/api/`
2. Use fetch or axios from components
3. Update API endpoints in `lib/api.js`

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
The app can be deployed to:
- Netlify
- AWS Amplify
- DigitalOcean App Platform
- Railway
- Render

Standard Next.js deployment applies.

## Troubleshooting

### Common Issues

**1. "Window is not defined" error**
- This happens with SSR
- Components using localStorage should use `'use client'` directive
- Check for window/localStorage usage

**2. PDF not generating**
- Ensure jsPDF and html2canvas are installed
- Check browser console for errors
- May need CORS configuration for images

**3. State not persisting**
- Check localStorage in browser DevTools
- Clear localStorage and try again
- Verify Zustand store subscription

**4. Styles not loading**
- Run `npm run build` to ensure Tailwind is compiled
- Check `tailwind.config.js` content paths
- Restart dev server

## Next Steps

### Backend Integration
To make this production-ready:

1. **Database Setup**
   - PostgreSQL, MongoDB, or Firebase
   - Store user data and resumes
   - Enable multiple resume versions

2. **Authentication**
   - NextAuth.js for OAuth
   - JWT tokens for API
   - Password hashing (bcrypt)

3. **API Development**
   - User CRUD operations
   - Resume CRUD operations
   - AI integration endpoints

4. **Real AI Integration**
   - OpenAI GPT-4 for suggestions
   - Anthropic Claude for analysis
   - Custom prompts for different improvements

5. **Additional Features**
   - Multiple resume templates
   - Cover letter generator
   - LinkedIn profile import
   - Resume scoring
   - Email delivery
   - Team collaboration

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [jsPDF Documentation](https://github.com/parallax/jsPDF)

## Support

For issues or questions:
- Check the README.md
- Review this setup guide
- Check Next.js documentation
- Open an issue on GitHub

---

Happy Resume Building! 🚀
