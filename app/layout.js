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
      <body className={`${inter.variable} font-sans bg-[#0A0A0F] text-[#F9FAFB] antialiased min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
