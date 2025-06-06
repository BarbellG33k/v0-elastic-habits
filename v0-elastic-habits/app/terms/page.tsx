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
            Please read these Terms carefully before using the Service. The Service is currently in pre-release, early validation stage.
          </p>

          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of
            the terms, you may not access the Service. We reserve the right to modify these Terms at any time without prior notice.
          </p>

          <h2>Service Status and Availability</h2>
          <p>
            The Service is currently in pre-release, early validation stage running on limited infrastructure. As such:
          </p>
          <ul>
            <li>The Service may be slow, buggy, or unavailable at times</li>
            <li>No guarantees are made regarding uptime, performance, or availability</li>
            <li>The Service may be decommissioned at any time without prior notice</li>
            <li>Features and functionality may change without warning</li>
          </ul>

          <h2>Free Service and Future Pricing</h2>
          <p>
            The Service is currently free to use. While we may introduce paid tiers in the future, we commit to:
          </p>
          <ul>
            <li>Maintaining a free tier indefinitely</li>
            <li>Providing clear notice before implementing any paid features</li>
            <li>Ensuring basic habit tracking functionality remains available in the free tier</li>
          </ul>

          <h2>Data Rights and Privacy</h2>
          <p>
            Regarding your data:
          </p>
          <ul>
            <li>You may request a copy of your data by emailing support@factor317.com</li>
            <li>Data requests will be fulfilled within a reasonable timeframe, subject to available resources</li>
            <li>Upon account deletion, data will be purged as early as 24 hours after deletion</li>
            <li>While we do not currently sell user data, we reserve the right to do so in the future</li>
            <li>Users may opt out of data selling by written request, but doing so will forfeit access to the Service</li>
          </ul>

          <h2>User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. You are
            responsible for safeguarding your password and for any activities under your account.
          </p>

          <h2>Disclaimers and Limitations</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. We make no guarantees about:
          </p>
          <ul>
            <li>Service availability or reliability</li>
            <li>Data accuracy or preservation</li>
            <li>Feature availability or functionality</li>
            <li>Future service continuity</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            In no event shall Momentum, nor its directors, employees, partners, agents, suppliers, or affiliates, be
            liable for any indirect, incidental, special, consequential or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>

          <h2>Changes to Service</h2>
          <p>
            We reserve the right, at our sole discretion, to:
          </p>
          <ul>
            <li>Modify or discontinue the Service at any time</li>
            <li>Change these Terms at any time</li>
            <li>Implement new features or remove existing ones</li>
            <li>Adjust or implement pricing tiers</li>
          </ul>

          <h2>Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>
            <a href="mailto:support@factor317.com">support@factor317.com</a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
