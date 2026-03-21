import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Easy-Ecom — Le SaaS pub pensé pour l\'Afrique',
  description: 'Templates, Canva, Analytics — tout pour scaler tes pubs Meta. La plateforme tout-en-un pour les e-commerçants africains.',
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Onest:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans bg-[#0A0A0F] text-[#F9FAFB] antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
