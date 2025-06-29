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
      <body className="w-full bg-green-900 flex items-center justify-center">
        {children}
      </body>
    </html>
  );
}
