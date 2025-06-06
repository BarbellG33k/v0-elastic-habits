import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Introduction</h2>
          <p>
            This Privacy Policy describes how Momentum ("we", "our", or "us") collects, uses, and shares your personal
            information when you use our application.
          </p>

          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us when you:</p>
          <ul>
            <li>Create an account</li>
            <li>Set up your profile</li>
            <li>Create and track habits</li>
            <li>Interact with our application</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process and complete transactions</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
          </ul>

          <h2>Data Storage</h2>
          <p>
            Your data is stored securely using Supabase. We implement appropriate technical and organizational measures
            to protect your personal information.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request that we correct any inaccurate information</li>
            <li>Request that we delete your personal information</li>
            <li>Object to our processing of your personal information</li>
          </ul>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page.
          </p>

          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>
            <a href="mailto:support@momentum.factor317.app">support@momentum.factor317.app</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
