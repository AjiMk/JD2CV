"# JD2CV - ATS-Friendly Resume Generator

A modern SaaS application built with Next.js that helps users create professional, ATS-friendly resumes tailored to specific job descriptions. The application follows FAANG-style resume formatting and includes AI-powered editing capabilities.

## Features

### ✨ Core Functionality
- **User Authentication**: Secure login and registration system
- **Comprehensive Resume Builder**: 
  - Personal Information
  - Education History
  - Work Experience
  - Skills (Technical & Soft)
  - Projects & Certifications
- **Job Description Integration**: Input JD to optimize resume matching
- **ATS-Optimized Format**: FAANG-path resume format for better ATS compatibility
- **PDF Download**: Export resume as professional PDF
- **AI-Powered Editing**: Intelligent suggestions to improve resume content
- **Live Preview**: Real-time resume preview as you build

### 🎨 UI/UX Features
- Responsive design for mobile, tablet, and desktop
- Clean, modern interface with TailwindCSS
- Intuitive multi-step form with progress tracking
- Side-by-side editing and preview
- Dark mode support (coming soon)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **PDF Generation**: jsPDF + html2canvas
- **Icons**: React Icons
- **Form Handling**: React Hook Form

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/JD2CV.git
cd JD2CV
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
JD2CV/
├── app/
│   ├── page.js              # Landing page
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   ├── dashboard/           # Main dashboard
│   ├── resume/              # Resume preview & download
│   ├── layout.js            # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── forms/
│   │   ├── PersonalInfoForm.js
│   │   ├── EducationForm.js
│   │   ├── WorkExperienceForm.js
│   │   ├── SkillsForm.js
│   │   └── JobDescriptionForm.js
│   └── ResumePreview.js    # Resume preview component
├── store/
│   └── resumeStore.js       # Zustand state management
├── public/                  # Static assets
└── package.json
```

## Usage

1. **Register/Login**: Create an account or sign in
2. **Fill Personal Information**: Add your contact details and professional summary
3. **Add Education**: Include your academic background
4. **Add Work Experience**: Detail your professional experience with achievements
5. **Add Skills**: List technical and soft skills
6. **Input Job Description**: Paste the JD you're applying for
7. **Preview & Download**: Review your resume and download as PDF
8. **AI Edit** (Optional): Use AI suggestions to improve your content

## Features in Detail

### ATS Optimization
- Clean, parseable format
- Standard section headings
- Keyword optimization
- No complex formatting or graphics
- Proper hierarchy and structure

### AI-Powered Editing
- Summary improvement
- Keyword suggestions
- Professional tone adjustment
- Achievement quantification
- ATS optimization tips

### PDF Export
- High-quality PDF generation
- Standard letter size (8.5" x 11")
- Professional formatting
- Print-ready output

## Future Enhancements

- [ ] Backend API integration with authentication
- [ ] Database storage for resume data
- [ ] Multiple resume templates
- [ ] Real AI integration (OpenAI/Claude)
- [ ] Resume version history
- [ ] Collaborative editing
- [ ] Resume scoring system
- [ ] Cover letter generator
- [ ] LinkedIn import
- [ ] Email delivery

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@jd2cv.com or open an issue on GitHub.

## Acknowledgments

- Next.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- The open-source community

---

Built with ❤️ using Next.js" 
