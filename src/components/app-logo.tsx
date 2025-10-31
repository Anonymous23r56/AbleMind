import { BrainCircuit } from 'lucide-react';

export function AppLogo() {
  return (
    <div className="flex items-center gap-2 text-foreground">
      <BrainCircuit className="h-7 w-7 text-primary" />
      <span className="font-headline text-2xl font-bold tracking-tighter">AbleMind</span>
    </div>
  );
}
