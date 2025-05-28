import { Geist, Geist_Mono,Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/Context/AuthContext";

const pop = Poppins({
  weight:"400",
  subsets: ["latin"],
});

export const metadata = {
  title: "Trip Planner",
  description: " Plan Smarter, Travel Better",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${pop.className} antialiased`}>
         <AuthProvider>{children}</AuthProvider>
         
      </body>
    </html>
  );
}
