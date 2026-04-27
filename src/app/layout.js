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
            <footer className={styles.footer}>
              <div className={styles.divider}>-------------------------------------------</div>
              <p className={styles.info}>♡ = 좋아요 안함 / ♥ = 좋아요</p>
              <div className={styles.divider}>-------------------------------------------</div>
            </footer>
          </Layout>
        </div>
        </body>
    </html>
  );
}
