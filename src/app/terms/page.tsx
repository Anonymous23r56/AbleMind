
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20">
      <div className="text-center space-y-4 mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-primary">
          Terms of Service
        </h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6 text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the AbleMind application ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">2. Description of Service</h2>
            <p>
              AbleMind provides users with a series of cognitive micro-challenges to generate a "Human-AI Balance Score" and related insights. This service is provided for informational and educational purposes only and is not a substitute for professional psychological or medical advice.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">3. User Accounts</h2>
            <p>
              To access certain features of the Service, you must create an account. You are responsible for safeguarding your password and for any activities or actions under your account. You agree not to disclose your password to any third party.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">4. User Conduct</h2>
            <p>
              You agree not to use the Service to:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Violate any local, state, national, or international law.</li>
              <li>Attempt to interfere with or compromise the system integrity or security.</li>
              <li>Use any automated system to access the Service in a manner that sends more request messages to the servers than a human can reasonably produce in the same period.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">5. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including, without limitation, a breach of the Terms.
            </p>
          </section>
          
          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
            <p>
              In no event shall AbleMind or Nova Team 3 be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">7. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at <a href="mailto:rolokor21@gmail.com" className="text-primary hover:underline">rolokor21@gmail.com</a>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
