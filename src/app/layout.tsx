import "@/styles/globals.css";
import Nav from "@/components/Nav";

export const metadata = {
  title: "Yoga Flow University",
  description: "AI-powered yoga platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-indigo-400 to-purple-500 min-h-screen">
        <Nav />
        <main className="container mx-auto my-8 px-4">{children}</main>
      </body>
    </html>
  );
}
