import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Layout from "./components/Layout";
import styles from './music/page.module.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SpotifyMini",
  description: "Welcome to SpotifyMini!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      {/*<body>{children}</body>*/}
      <body>
        <div className={styles.container}>
          <Layout>
            {children}
          </Layout>
        </div>
        </body>
    </html>
  );
}
