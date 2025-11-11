
import Link from 'next/link';
import { AppLogo } from './app-logo';

export default function AppFooter() {
  return (
    <footer className="border-t border-border/40 mt-16">
      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1">
            <AppLogo />
            <p className="text-sm text-muted-foreground">Built by Nova Team 3 (Programmify PIP4)</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:col-span-3">
            <div className="space-y-3">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold">Contact</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:rolokor21@gmail.com" className="hover:text-primary">rolokor21@gmail.com</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AbleMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
