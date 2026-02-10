import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "Fortune Oracle - あなたの運命を10の占術で紐解く",
  description: "四柱推命・姓名判断・タロット・動物占い・数秘術・九星気学・星座占い・血液型・六星占術・誕生花石の10種類の占いで、あなたの運命を総合鑑定します。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} ${notoSerifJP.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
