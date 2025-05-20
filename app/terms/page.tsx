import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Introduction</h2>
          <p>
            These Terms of Service ("Terms") govern your access to and use of the Momentum application ("Service").
            Please read these Terms carefully before using the Service.
          </p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of
            the terms, you may not access the Service.
          </p>

          <h2>Description of Service</h2>
          <p>
            Momentum is a habit tracking application that allows users to define flexible habits with multiple
            activities and achievement levels.
          </p>

          <h2>User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. You are
            responsible for safeguarding the password that you use to access the Service and for any activities or
            actions under your password.
          </p>

          <h2>Content</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text,
            graphics, or other material ("Content"). You are responsible for the Content that you post on or through the
            Service.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property
            of Momentum and its licensors.
          </p>

          <h2>Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason
            whatsoever, including without limitation if you breach the Terms.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            In no event shall Momentum, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to
            access or use our Service after those revisions become effective, you agree to be bound by the revised
            terms.
          </p>

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>
            <a href="mailto:support@momentum.factor317.app">support@momentum.factor317.app</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
