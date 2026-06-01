import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <div className="mb-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">&larr; Back to Home</Link>
      </div>
      <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
      <p className="mt-2 text-sm text-zinc-500">Last Updated: June 1, 2026</p>

      <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">1. Acceptance of Terms</h2>
          <p>
            By accessing or using BlueprintAI (&quot;the Platform,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. These terms apply to all visitors, users, and customers of BlueprintAI, operated by AuroraSoft. Pte. Ltd, Singapore.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">2. Description of Services</h2>
          <p>
            BlueprintAI provides AI-powered application development services, including but not limited to:
          </p>
          <ul className="ml-5 mt-2 list-disc space-y-1">
            <li>Web and mobile application development</li>
            <li>AI agent and chatbot development</li>
            <li>Machine learning model training and deployment</li>
            <li>API integration and backend infrastructure</li>
            <li>Consulting and technical advisory services</li>
          </ul>
          <p className="mt-2">
            The specific scope, deliverables, and timeline for each project will be defined in a separate Statement of Work (SOW) or project agreement.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">3. User Accounts</h2>
          <p>To access certain features, you must create an account. You agree to:</p>
          <ul className="ml-5 mt-2 list-disc space-y-1">
            <li>Provide accurate, current, and complete registration information</li>
            <li>Maintain and update your account information as needed</li>
            <li>Keep your password confidential and not share your account</li>
            <li>Notify us immediately of any unauthorized account use</li>
          </ul>
          <p className="mt-2">
            You are responsible for all activity under your account. We reserve the right to suspend or terminate accounts that violate these terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">4. Intellectual Property</h2>
          <h3 className="mb-1 font-medium text-zinc-900 dark:text-zinc-100">Your IP</h3>
          <p>
            You retain all rights to the source code, designs, and intellectual property you provide to us for development. You grant us a limited license to use your IP solely for the purpose of delivering our services.
          </p>
          <h3 className="mb-1 mt-4 font-medium text-zinc-900 dark:text-zinc-100">Delivered Work</h3>
          <p>
            Upon full payment, you receive complete ownership of all custom code, designs, and deliverables specifically created for your project, unless otherwise stated in your agreement.
          </p>
          <h3 className="mb-1 mt-4 font-medium text-zinc-900 dark:text-zinc-100">Our IP</h3>
          <p>
            Our proprietary frameworks, AI models, templates, libraries, and methodologies remain our intellectual property. We grant you a perpetual, non-exclusive license to use any incorporated frameworks solely as part of your delivered project.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">5. Payments and Billing</h2>
          <ul className="ml-5 list-disc space-y-1">
            <li><strong>One-Time Builds:</strong> Full payment is required before delivery. Payment is processed via our secure checkout.</li>
            <li><strong>Subscriptions:</strong> Billed monthly. You may cancel at any time; access continues through the paid period.</li>
            <li><strong>Refunds:</strong> We offer a 14-day refund policy for subscription plans. One-time builds are non-refundable once development has commenced.</li>
            <li><strong>Late Payments:</strong> Accounts overdue by 30+ days may result in service suspension.</li>
          </ul>
          <p className="mt-2">
            All prices are in USD unless otherwise specified. Applicable taxes may be added.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">6. Project Timeline and Delivery</h2>
          <p>
            Estimated timelines provided during consultation are projections based on the initial scope. Changes to scope, requirements, or specifications may affect delivery timelines. We will communicate any changes promptly.
          </p>
          <p className="mt-2">
            We are not liable for delays caused by:
          </p>
          <ul className="ml-5 mt-1 list-disc space-y-1">
            <li>Late client feedback or approvals</li>
            <li>Third-party service disruptions</li>
            <li>Unforeseen technical challenges</li>
            <li>Force majeure events</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">7. Confidentiality</h2>
          <p>
            Both parties agree to maintain confidentiality of all proprietary information shared during the engagement. This obligation survives termination of our agreement for 3 years. Confidential information includes source code, business strategies, customer data, and technical specifications.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">8. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, BlueprintAI and AuroraSoft. Pte. Ltd shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of our services.
          </p>
          <p className="mt-2">
            Our total liability for any claim shall not exceed the total amount you have paid to us in the 12 months preceding the claim.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">9. Warranty Disclaimer</h2>
          <p>
            Our services are provided &quot;as is&quot; without warranties of any kind, either express or implied. We do not guarantee that:
          </p>
          <ul className="ml-5 mt-2 list-disc space-y-1">
            <li>The platform will be uninterrupted or error-free</li>
            <li>Results from using our services will meet your specific expectations</li>
            <li>Any content or data will be completely secure</li>
          </ul>
          <p className="mt-2">
            We provide a 30-day post-delivery warranty to fix any bugs or issues in the delivered work, excluding modifications made by you or third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">10. Termination</h2>
          <p>
            Either party may terminate the agreement with 30 days written notice. We may terminate immediately if you violate these terms. Upon termination:
          </p>
          <ul className="ml-5 mt-2 list-disc space-y-1">
            <li>You must pay for all services rendered up to the termination date</li>
            <li>We will deliver all completed work products</li>
            <li>Each party will return or destroy the other&apos;s confidential information</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">11. Governing Law</h2>
          <p>
            These terms are governed by and construed in accordance with the laws of Singapore. Any disputes shall be resolved exclusively in the courts of Singapore.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">12. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes become effective 30 days after posting. Continued use of the platform after that period constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">13. Contact</h2>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
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
