import { Coffee } from "lucide-react";
import Link from "next/link";

export function BuyMeCoffeeButton() {
  return (
    <Link
      href="https://www.buymeacoffee.com/momentum"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 group"
    >
      <Coffee className="h-4 w-4 transition-transform group-hover:scale-110" />
      <span>Buy me a coffee</span>
      <span className="text-lg" aria-hidden="true">
        ☕
      </span>
    </Link>
  );
} 