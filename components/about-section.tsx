import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AboutSection() {
  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          About{" "}
          <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-transparent bg-clip-text">Momentum</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="prose dark:prose-invert max-w-none">
        <p className="text-center text-lg text-muted-foreground mb-6">
          A flexible habit tracking app designed for real life
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3>The Elastic Habits Concept</h3>
            <p>
              Momentum is built on the "elastic habits" concept, which recognizes that life isn't always predictable.
              Some days you have more energy and time than others. Instead of the rigid "all or nothing" approach of
              traditional habit trackers, Momentum lets you define multiple activities and achievement levels for each
              habit.
            </p>
          </div>

          <div>
            <h3>Flexibility That Works</h3>
            <p>
              For example, on busy days, you might only complete a 10-minute workout (Bronze level), while on days with
              more free time, you might achieve a full 30-minute session (Gold level). This flexibility helps maintain
              your streak even when life gets hectic.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p>
            The app is completely free and open-source. Your support through "Buy Me a Coffee" helps cover hosting costs
            and enables continued development of new features.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
