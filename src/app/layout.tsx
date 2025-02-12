import { Toaster } from "sonner";
import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans } from "next/font/google";
import "~/styles/globals.css";
import "~/styles/gradient.css";
import { cn } from "~/utils/utils";
import ViewProvider from "~/lib/providers/ViewProvider";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ShortCutProvider } from "~/lib/providers/ShortCutProvider";
import { KeyBordProvider } from "~/lib/providers/KeyBoardProvider";
import { Provider } from "jotai";
import LoadingScreen from "~/components/loading-screen/loading-screen";

const font1 = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });
const font2 = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "xWord",
  description: "your all-in-one content creation platform",
};
export const viewport: Viewport = {
  themeColor: "#AF52DE",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={cn(font1.variable, font2.variable)}>
        <Suspense fallback={<LoadingScreen />}>
          <ViewProvider>
            <TRPCReactProvider>
              <ClerkProvider
                appearance={{
                  baseTheme: dark,
                }}
              >
                <Provider>
                  <ShortCutProvider>
                    <KeyBordProvider>{children}</KeyBordProvider>
                  </ShortCutProvider>
                </Provider>
              </ClerkProvider>
            </TRPCReactProvider>
          </ViewProvider>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}

// Suspense usage is not correct here. This is a server rendered component.
// We should use Suspense on the client side.
// in the previous project iteration, the whole app acted like a client side rendered app
// because of framer-motion in app/template.tsx
// is this required? then why are we using next.js?
