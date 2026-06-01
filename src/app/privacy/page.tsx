import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="mb-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">&larr; Back to Home</Link>
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-zinc-500">Last Updated: June 1, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">1. Introduction</h2>
          <p>
            BlueprintAI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
          <p className="mt-2">
            We are a Singapore-based company operating under AuroraSoft. Pte. Ltd. By using our platform, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">2. Information We Collect</h2>
          <h3 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">Personal Data</h3>
          <ul className="ml-5 list-disc space-y-1">
            <li>Name, email address, phone number, and company name when you register or contact us</li>
            <li>Billing information (processed securely via third-party payment processors)</li>
            <li>Project descriptions, source code, and technical specifications you submit for development</li>
          </ul>
          <h3 className="mb-1 mt-4 font-medium text-zinc-900 dark:text-zinc-100">Automatically Collected Data</h3>
          <ul className="ml-5 list-disc space-y-1">
            <li>IP address, browser type, device information, and operating system</li>
            <li>Usage patterns, pages visited, time spent, and referring URLs</li>
            <li>Cookies and similar tracking technologies (see Section 6)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">3. How We Use Your Information</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li>To provide, maintain, and improve our AI development services</li>
            <li>To process transactions and send related information</li>
            <li>To communicate with you about projects, updates, and support</li>
            <li>To personalize your experience and deliver relevant content</li>
            <li>To detect, prevent, and address technical issues and fraud</li>
            <li>To comply with legal obligations and enforce our Terms of Service</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">4. Data Sharing and Disclosure</h2>
          <p>We do not sell your personal information. We may share data with:</p>
          <ul className="ml-5 mt-2 list-disc space-y-1">
            <li><strong>Service Providers:</strong> Third-party vendors who assist with hosting, payment processing, analytics, and customer support</li>
            <li><strong>Legal Authorities:</strong> When required by law, court order, or governmental regulation</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
          </ul>
          <p className="mt-2">All third-party providers are contractually bound to protect your data and use it only for the purposes we specify.</p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">5. Data Security</h2>
          <p>
            We implement industry-standard security measures including:
          </p>
          <ul className="ml-5 mt-2 list-disc space-y-1">
            <li>256-bit SSL/TLS encryption for all data in transit</li>
            <li>AES-256 encryption for data at rest</li>
            <li>Regular security audits and penetration testing</li>
            <li>Strict access controls and multi-factor authentication</li>
            <li>Privacy-preserving AI techniques to minimize data exposure</li>
          </ul>
          <p className="mt-2">
            Our infrastructure is hosted on secure, SOC 2-compliant data centers in Singapore and the United States.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">6. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance functionality, analyze traffic, and support our marketing efforts. Types of cookies we use:
          </p>
          <ul className="ml-5 mt-2 list-disc space-y-1">
            <li><strong>Essential:</strong> Required for platform operation and authentication</li>
            <li><strong>Analytics:</strong> Google Analytics (AW-17695929412) to understand usage patterns</li>
            <li><strong>Functional:</strong> To remember your preferences and settings</li>
          </ul>
          <p className="mt-2">
            You can control cookie preferences through your browser settings. Disabling certain cookies may affect platform functionality.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">7. Data Retention</h2>
          <p>
            We retain your personal data for as long as your account is active or as needed to provide services. After account closure, we retain data for 90 days to facilitate recovery, then securely delete or anonymize it. Legal or regulatory requirements may necessitate longer retention periods.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">8. Your Rights</h2>
          <p>Depending on your jurisdiction, you may have the right to:</p>
          <ul className="ml-5 mt-2 list-disc space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (subject to legal obligations)</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability to another service provider</li>
            <li>Withdraw consent at any time</li>
          </ul>
          <p className="mt-2">
            To exercise these rights, contact us at <a href="mailto:npoluri5@gmail.com" className="text-blue-600 hover:underline">npoluri5@gmail.com</a>. We respond to all requests within 30 days.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">9. International Data Transfers</h2>
          <p>
            Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place through standard contractual clauses and data processing agreements compliant with GDPR, PDPA (Singapore), and other applicable regulations.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">10. Children&apos;s Privacy</h2>
          <p>
            Our services are not directed to individuals under 16. We do not knowingly collect personal information from children. If we become aware that a child has provided us with personal data, we will take steps to delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes via email or a prominent notice on our website. Your continued use after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">12. Contact Us</h2>
          <p>
            For questions, concerns, or data subject requests:
          </p>
          <div className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="font-medium text-zinc-900 dark:text-zinc-100">BlueprintAI / AuroraSoft. Pte. Ltd</p>
            <p>Email: <a href="mailto:npoluri5@gmail.com" className="text-blue-600 hover:underline">npoluri5@gmail.com</a></p>
            <p>Phone: <a href="tel:+6581765178" className="text-blue-600 hover:underline">+65 8176 5178</a></p>
            <p>Singapore HQ</p>
          </div>
        </section>
      </div>
    </div>
  )
}
