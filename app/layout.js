import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JD2CV - ATS-Friendly Resume Generator',
  description: 'Generate FAANG-path ATS-friendly resumes tailored to job descriptions',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
            const theme = localStorage.getItem('darkMode');
            if (theme && JSON.parse(theme)) document.documentElement.classList.add('dark');
          } catch (e) {}
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
