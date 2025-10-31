import Link from 'next/link';
import { AppLogo } from './app-logo';

export default function AppHeader() {
  return (
    <header className="py-4 px-4 md:px-8 border-b border-border/40">
      <Link href="/">
        <AppLogo />
      </Link>
    </header>
  );
}
