import "./globals.css";
import { UserProvider } from "@/contexts/UserContext";
import { GameResultProvider } from "@/contexts/GameResultContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <UserProvider>
          <GameResultProvider>
            {children}
          </GameResultProvider>
        </UserProvider>
      </body>
    </html>
  );
}
