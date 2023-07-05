import './globals.css';
import { Inter, Raleway } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' });

export const metadata = {
  title: 'Rainfall Viewer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} ${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
