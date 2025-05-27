import { Coffee } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

const AboutSection = () => {
  return (
    <section id="about" className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-8">About Momentum</h2>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What is Momentum?</AccordionTrigger>
            <AccordionContent>
              Momentum is a simple, open-source habit tracker designed to help you build and maintain positive habits.
              It's built with modern web technologies and focuses on a clean, intuitive user experience.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Why use Momentum?</AccordionTrigger>
            <AccordionContent>
              Momentum helps you stay consistent with your habits by providing a visual representation of your progress.
              It's a great way to track your daily, weekly, or monthly goals and stay motivated.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Features</AccordionTrigger>
            <AccordionContent>
              <ul>
                <li>Simple and intuitive interface</li>
                <li>Track daily, weekly, or monthly habits</li>
                <li>Visual progress tracking</li>
                <li>Open-source and free to use</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            The app is completely free and open-source. Your support helps cover hosting costs:
          </p>
          <Link
            href="https://www.buymeacoffee.com/momentum"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Coffee className="h-5 w-5" />
            <span>Buy Me a Coffee</span>
            <span className="text-amber-100">☕</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
