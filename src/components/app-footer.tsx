
import Link from 'next/link';
import { AppLogo } from './app-logo';

export default function AppFooter() {
  return (
    <footer className="border-t border-border/40 mt-16">
      <div className="container mx-auto py-8 px-4 md:px-8 text-center">
        <div className="flex flex-col items-center space-y-8">
          <div className="flex flex-col items-center space-y-4">
            <AppLogo />
            <p className="text-sm text-muted-foreground">Built by Nova Team 3 (Programmify PIP4)</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-primary">About Us</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <a href="mailto:rolokor21@gmail.com" className="hover:text-primary">Contact</a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AbleMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
