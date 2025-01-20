import { TooltipProvider } from '@/components/ui/tooltip'
import { Inter } from 'next/font/google'

import SearchDialogWrapper from '@/components/search-dialog-wrapper'
import AppHeader from '../components/app-header'
import AppSidebar from '../components/app-sidebar'
import { AlertDialogProvider } from '../components/dialog-confirm'
import { SidebarProvider } from '../components/ui/sidebar'
import { Toaster } from '../components/ui/sonner'
import { BRAND_DESCRIPTION, BRAND_NAME } from '../lib/constants'
import { cn } from '../lib/utils'
import '../styles/globals.scss'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: BRAND_NAME,
  description: BRAND_DESCRIPTION
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* There is an overflow problem here, cannot find the solution except putting overflow-hidden here! */}
      <body className={cn(inter.className, 'overflow-hidden')}>
        <TooltipProvider>
          <AlertDialogProvider>
            <SidebarProvider>
              <AppSidebar />
              <main className="x-flex-1 flex h-svh flex-col bg-background">
                <AppHeader />
                <div className="x-flex-1">{children}</div>
              </main>
            </SidebarProvider>
            <SearchDialogWrapper />
          </AlertDialogProvider>
          <Toaster position="top-center" />
        </TooltipProvider>
      </body>
    </html>
  )
}
