import { DM_Sans, Inter } from "next/font/google";

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const fonts = { dmSans, inter };

export default fonts;
