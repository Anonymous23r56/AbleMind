
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:py-20">
      <div className="text-center space-y-4 mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight text-primary">
          Our Story
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Understanding our place in a world increasingly shaped by artificial intelligence.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">The Genesis of AbleMind</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground leading-relaxed">
          <p>
            AbleMind was born from a simple yet profound question: as we rely more on AI, how do we ensure our own cognitive abilities remain sharp and balanced? We are Nova Team 3, a group of thinkers, creators, and technologists passionate about human potential. We saw a future where the line between human and artificial intelligence blurs, and we wanted to build a tool to help people navigate this new reality.
          </p>
          <p>
            Our mission is not to reject AI, but to foster a symbiotic relationship with it. We believe that AI should be a partner that enhances our abilities, not a crutch that diminishes them. The AbleMind assessment is our first step towards this goal. It's a "digital mirror" designed to give you a snapshot of your cognitive balance—your unique blend of creativity, instinct, and logic.
          </p>
          <p>
            By understanding your cognitive profile, you can become more intentional about how you use AI. You can leverage it to augment your strengths and consciously work on areas where you might be over-relying on technology.
          </p>
          <p>
            This is just the beginning. We are committed to exploring the dynamic between human and machine, and to building tools that empower individuals to thrive in the age of AI. Thank you for joining us on this journey.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
