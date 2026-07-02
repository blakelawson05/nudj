import "./globals.css";
import Providers from "@/context/Providers";

export const metadata = {
  title: "Nudj — نُضج | Financial Readiness for Children",
  description:
    "An AI education platform that measures and grows children's financial behavior. Not a credit score.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
