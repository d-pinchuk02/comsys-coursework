import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Auth0Provider } from "@auth0/nextjs-auth0"

import { auth0 } from "@/lib/auth0"
import { Toaster } from "@/components/ui/sonner"
import { QueryProvider } from "./providers/QueryProvider"
import { SheetProvider } from "./providers/SheetProvider"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin", "cyrillic"],
})

export const metadata: Metadata = {
  title: "Money Manager",
  description: "Money Manager",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth0.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <Auth0Provider user={session?.user}>
        <body className={`${inter.variable} antialiased`}>
          <QueryProvider>
            <SheetProvider />
            <Toaster richColors />
            {children}
          </QueryProvider>
        </body>
      </Auth0Provider>
    </html>
  )
}
