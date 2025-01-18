import { UserProvider } from "@auth0/nextjs-auth0/client"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <UserProvider>
        <body className={`${inter.variable} antialiased`}>
          <QueryProvider>
            <SheetProvider />
            <Toaster />
            {children}
          </QueryProvider>
        </body>
      </UserProvider>
    </html>
  )
}
