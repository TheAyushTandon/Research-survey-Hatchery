import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Academic Research Questionnaire Platform',
  description: 'Digital Research Questionnaire Platform for Academic Business Incubators in India',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="min-h-screen bg-[#fafbfc] text-[#1f2937] antialiased selection:bg-[#79addc]/20 selection:text-[#193047]">
        {children}
      </body>
    </html>
  );
}
