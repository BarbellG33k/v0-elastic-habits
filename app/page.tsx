import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { SloganRotator } from "@/components/slogan-rotator"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Our App</h1>
        <p className="text-gray-600 mb-8">This is a simple landing page.</p>

        <SloganRotator />

        <div className="flex gap-4 mt-6">
          <Button asChild size="lg">
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/auth/sign-up">Create Account</Link>
          </Button>
        </div>
        <div className="mt-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/how-to-use">Show me how to use the app →</Link>
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-md mt-12">
        <CardHeader>
          <CardTitle>Example Card</CardTitle>
          <CardDescription>This is an example card component.</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your Name" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
