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
      <body className="bg-green-900 flex items-center justify-center">
        <main className="w-full bg-green-900 text-white flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-6">Potujny Nardy</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
