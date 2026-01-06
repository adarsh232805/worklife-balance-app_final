
import "../styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="
  min-h-screen
  bg-gradient-to-br
  from-pink-100
  via-purple-100
  to-indigo-100
  text-slate-800
">


        {children}
      </body>
    </html>
  );
}
