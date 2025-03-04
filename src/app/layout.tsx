import { Toaster } from "sonner";
import type { Metadata, Viewport } from "next";
import { Geist, Noto_Sans } from "next/font/google";
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
import { XWAlertProvider } from "~/components/reusable/xw-alert";
import { NextFont, NextFontWithVariable } from "next/dist/compiled/@next/font";

const font1 = Noto_Sans({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-sans",
});

const font2: NextFontWithVariable & NextFont = {
  className: "font-pp-editorial",
  style: {
    fontFamily: "PPEditorialNew-UltralightItalic",
    fontWeight: 200,
    fontStyle: "italic",
  },
  variable: "--font-pp-editorial",
};

const font3 = Geist({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
  variable: "--font-geist",
});

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
      {/* remove on PROD react-scan testing */}
      {/* <head>
        <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        />
      </head> */}
      {/* remove on PROD react-scan testing */}
      <body className={cn(font3.className)}>
        <ViewProvider>
          <TRPCReactProvider>
            <ClerkProvider
              publishableKey="pk_test_dW5iaWFzZWQtbW9sbHVzay04LmNsZXJrLmFjY291bnRzLmRldiQ"
              appearance={{
                baseTheme: dark,
              }}
              signInFallbackRedirectUrl={"/dashboard"}
              signUpFallbackRedirectUrl={"/getting-started"}
              afterSignOutUrl={"/"}
            >
              <Provider>
                <ShortCutProvider>
                  <KeyBordProvider>
                    <XWAlertProvider>{children}</XWAlertProvider>
                  </KeyBordProvider>
                </ShortCutProvider>
              </Provider>
            </ClerkProvider>
          </TRPCReactProvider>
        </ViewProvider>
        <Toaster />
      </body>
    </html>
  );
}
