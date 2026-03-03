import "./globals.css";

export const metadata = {
  title: "Invoice SaaS",
  description: "Modern Invoice Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-100 dark:bg-slate-900 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}