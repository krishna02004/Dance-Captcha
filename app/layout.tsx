import type React from "react"
import type { Metadata } from "next"
import { Lexend_Deca } from "next/font/google"
import "./globals.css"

const lexendDeca = Lexend_Deca({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})

export const metadata: Metadata = {
  title: "Are You Human?",
  description: "An intuitive and interactive fun experience of a rather boring captcha",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={lexendDeca.className}>{children}</body>
    </html>
  )
}
