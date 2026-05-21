import { Bangers, Comic_Neue, Geist_Mono, Noto_Sans } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"
import { TanstackQueryClientProvider } from "@/providers"
import { Toaster } from "sonner"

const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bangers",
})

const comicNeue = Comic_Neue({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-comic",
})

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        notoSans.variable,
        bangers.variable,
        comicNeue.variable
      )}
    >
      <body>
        <TanstackQueryClientProvider>
          <ThemeProvider>
            {children}
            <Toaster
              position="top-right"
              theme="system"
              richColors={false}
              gap={8}
              toastOptions={{
                classNames: {
                  toast: "comic-toast",
                  title: "comic-toast-title",
                  description: "comic-toast-desc",
                  success: "comic-toast-success",
                  error: "comic-toast-error",
                  warning: "comic-toast-warning",
                  info: "comic-toast-info",
                  closeButton: "comic-toast-close",
                },
              }}
            />
          </ThemeProvider>
        </TanstackQueryClientProvider>
      </body>
    </html>
  )
}
