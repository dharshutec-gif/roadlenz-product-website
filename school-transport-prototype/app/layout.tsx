import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'School Transport Solutions | RoadLenz',
  description: 'Connected school transport visibility, safety intelligence and automated attendance from RoadLenz.',
  openGraph: { title: 'Every school ride, accounted for.', description: 'Connected school transport visibility and safety intelligence from RoadLenz.', images: ['/images/school-hero.jpg'] },
  twitter: { card: 'summary_large_image', title: 'Every school ride, accounted for.', description: 'Connected school transport visibility and safety intelligence from RoadLenz.', images: ['/images/school-hero.jpg'] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
