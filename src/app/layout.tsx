import {Geist, Geist_Mono} from "next/font/google";
import Script from 'next/script'
import '@/styles/style.scss'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
    <head>
      <title>House of Legacy</title>
      <Script
        id="get-color-scheme"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        const userMode = localStorage.getItem('zgs-theme-modern');
        const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (userMode === 'dark' || (userMode !== 'light' && systemDarkMode)) {
          document.documentElement.dataset.coreuiTheme = 'dark';
        }`,
        }}
      />
    </head>
    <body className={`${geistSans.variable} ${geistMono.variable}`}>
    {children}
    </body>
    </html>
  )
}
