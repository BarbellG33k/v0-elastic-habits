import Link from "next/link"
import { HelpCircle } from "lucide-react"
import { AboutPopup } from "@/components/about-popup"
import { BuyMeCoffeeButton } from "@/components/buy-me-coffee-button"

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} Momentum. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <AboutPopup />
          <Link
            href="/how-to-use"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span>How to Use</span>
          </Link>
          <BuyMeCoffeeButton />
          <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
