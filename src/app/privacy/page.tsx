
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20">
      <div className="text-center space-y-4 mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-primary">
          Privacy Policy
        </h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-6 text-muted-foreground leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">1. Introduction</h2>
            <p>
              Welcome to AbleMind. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our application.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create an account, complete an assessment, or contact us. This may include:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Account Information: Your email address and password.</li>
              <li>Assessment Data: Your responses to challenges, behavioral data (like time spent and hesitation), and the final cognitive report generated.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Provide, maintain, and improve our services.</li>
              <li>Generate your personalized cognitive reports.</li>
              <li>Communicate with you, including responding to your comments and questions.</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our services.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">4. Data Storage and Security</h2>
            <p>
              Your data is stored securely using Firebase services. We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">5. Your Choices</h2>
            <p>
              You may update or correct your account information at any time by logging into your account. You may also delete your account, which will permanently delete your assessment history.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-headline text-xl font-semibold text-foreground">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at <a href="mailto:rolokor21@gmail.com" className="text-primary hover:underline">rolokor21@gmail.com</a>.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
