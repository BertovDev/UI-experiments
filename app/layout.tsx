import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { type PropsWithChildren, Suspense } from "react"
import { themes } from "@/lib/styles/colors"
import { fontsVariable } from "@/lib/styles/fonts"
import AppData from "@/package.json"
import "@/lib/styles/css/index.css"
import { cn } from "@/lib/styles/cn"
import { Geist_Mono } from "next/font/google"
import { Header } from "@/components/layout/header"

const APP_NAME = AppData.name
const APP_DEFAULT_TITLE = "Experiments"
const APP_TITLE_TEMPLATE = "%s - Experiments"
const APP_DESCRIPTION = AppData.description
const APP_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"

const geist = Geist({
  subsets: ["latin"],
})

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  applicationName: APP_NAME,
  authors: [{ name: APP_DEFAULT_TITLE, url: APP_BASE_URL }],
  description: APP_DESCRIPTION,
  formatDetection: { telephone: false },
  metadataBase: new URL(APP_BASE_URL),
  openGraph: {
    description: APP_DESCRIPTION,
    images: [
      {
        alt: APP_DEFAULT_TITLE,
        height: 630,
        url: "/opengraph-image.jpg",
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    type: "website",
    url: APP_BASE_URL,
  },
  other: {
    "fb:app_id": process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
  },
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  twitter: {
    card: "summary_large_image",
    description: APP_DESCRIPTION,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
  },
}

export const viewport: Viewport = {
  colorScheme: "normal",
  themeColor: themes.dark.primary,
}

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export default async function Layout({ children }: PropsWithChildren) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={cn(fontsVariable, geist.className, geistMono.className)}
      // NOTE: This is due to the data-theme attribute being set which causes hydration errors
      suppressHydrationWarning
    >
      <body>
        <Suspense fallback={null}></Suspense>
        <Header />
        {children}
      </body>
    </html>
  )
}
