import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://s4ds.mitaoe.vercel.app"),
  title: "S4DS MITAOE | Society for Data Science Student Chapter",
  description:
    "Official portal for Society for Data Science (S4DS) MIT Academy of Engineering (MITAOE), Alandi, Pune. Explore events, TECHNEX 2K26 Project Expo, student innovation, and chapter membership.",
  keywords: [
    "S4DS",
    "MITAOE",
    "Society for Data Science",
    "TECHNEX 2026", 
    "Data Science Club",
    "Machine Learning MITAOE",
    "Alandi Pune Engineering",
  ],
  authors: [{ name: "S4DS MITAOE Technical Team" }],
  openGraph: {
    title: "S4DS MITAOE | Society for Data Science Student Chapter",
    description:
      "Empowering students in Data Science, Machine Learning, and Engineering Excellence at MIT Academy of Engineering.",
    url: "https://s4ds.mitaoe.ac.in",
    siteName: "S4DS MITAOE",
    images: [
      {
        url: "/images/technex-poster.png",
        width: 1200,
        height: 630,
        alt: "S4DS MITAOE Chapter & TECHNEX 2K26",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "S4DS MITAOE | Society for Data Science",
    description:
      "Join S4DS MITAOE for workshops, hackathons, and the flagship TECHNEX 2K26 National Project Expo.",
    images: ["/images/technex-poster.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://cflqsjjkekfrnjjbhuja.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cflqsjjkekfrnjjbhuja.supabase.co" />
      </head>
      <body className="min-h-screen flex flex-col bg-background-main text-brand-white antialiased selection:bg-brand-orange selection:text-white">
        <Navbar />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
