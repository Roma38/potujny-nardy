import "./globals.css";

export const metadata = {
  title: "Potujny Nardy",
  description: "Online backgammon game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-green-900 min-h-screen flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
