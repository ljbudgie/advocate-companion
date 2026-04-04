import { Button } from "@/components/ui/button";
import {
  Shield,
  ArrowRight,
  Globe,
  Bot,
  Eye,
  Lock,
  FileText,
  MessageSquare,
  Scale,
  Heart,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const SUPPORTED_COUNTRIES = [
  { name: "United Kingdom", law: "Equality Act 2010" },
  { name: "United States", law: "Americans with Disabilities Act (ADA)" },
  { name: "Canada", law: "Canadian Human Rights Act" },
  { name: "Australia", law: "Disability Discrimination Act 1992" },
  { name: "Ireland", law: "Employment Equality Acts" },
  { name: "New Zealand", law: "Human Rights Act 1993" },
  { name: "South Africa", law: "Employment Equity Act" },
  { name: "India", law: "Rights of Persons with Disabilities Act 2016" },
  { name: "Germany", law: "General Equal Treatment Act (AGG)" },
  { name: "France", law: "Disability Discrimination Law 2005" },
  { name: "Netherlands", law: "Equal Treatment on the Grounds of Disability Act" },
  { name: "Sweden", law: "Discrimination Act 2008" },
  { name: "Norway", law: "Equality and Anti-Discrimination Act" },
  { name: "Denmark", law: "Act on Prohibition of Discrimination" },
  { name: "Finland", law: "Non-Discrimination Act" },
  { name: "Spain", law: "General Law on the Rights of Persons with Disabilities" },
  { name: "Italy", law: "Law 68/1999 on Disability Rights" },
  { name: "Japan", law: "Act on Elimination of Disability Discrimination" },
  { name: "South Korea", law: "Anti-Discrimination Against Persons with Disabilities Act" },
  { name: "Brazil", law: "Brazilian Inclusion Law (Estatuto da Pessoa com Deficiência)" },
];

const EXAMPLE_SCENARIOS = [
  {
    title: "Requesting a quiet space at work",
    condition: "Autism / ASD",
    context:
      "A busy open-plan office causes sensory overload, making it difficult to concentrate.",
    example:
      "Hello, my name is Alex. I have autism and the open-plan environment causes sensory overload. Under the Equality Act 2010, I'd like to request a reasonable adjustment — a quiet workspace or noise-cancelling headphone allowance.",
  },
  {
    title: "Flexible scheduling for medical appointments",
    condition: "Chronic pain",
    context:
      "Regular physiotherapy sessions require time during working hours.",
    example:
      "Hello, my name is Sam. I live with chronic pain and attend regular physiotherapy. I'm requesting a flexible schedule adjustment to attend appointments. This is a reasonable adjustment under disability rights law.",
  },
  {
    title: "Challenging a blanket policy",
    condition: "ADHD",
    context:
      "A company insists all employees follow the same rigid time-tracking method that doesn't account for neurodivergent working patterns.",
    example:
      "Hello, my name is Jordan. I have ADHD and the current rigid time-tracking requirement doesn't accommodate my working style. Before this policy is applied to me, I'd ask that my individual circumstances are considered — as is my right under reasonable adjustment provisions.",
  },
];

const FEATURES = [
  {
    icon: Bot,
    title: "AI-Powered Advocacy",
    description:
      "An AI co-pilot suggests calm, polite, and legally informed responses tailored to your situation and country.",
  },
  {
    icon: Eye,
    title: "Staff Display Mode",
    description:
      "Show messages directly to staff on your phone with large, clear text — no awkward explanations needed.",
  },
  {
    icon: Globe,
    title: "21 Countries Supported",
    description:
      "Country-specific legal references for the UK, US, Canada, Australia, and 17 more nations.",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "Your data stays on your device. Nothing is stored on servers. Your conversations are yours alone.",
  },
  {
    icon: FileText,
    title: "PDF Export",
    description:
      "Download your conversation as a PDF record for your files, HR submissions, or legal documentation.",
  },
  {
    icon: Heart,
    title: "30+ Conditions",
    description:
      "ADHD, autism, chronic pain, epilepsy, visual impairment, mental health conditions, and many more.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background" role="main" id="main-content">
      {/* Navigation */}
      <nav
        className="border-b bg-card px-4 py-3 sticky top-0 z-10"
        aria-label="Landing page navigation"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" aria-hidden="true" />
            <span className="font-serif font-semibold text-foreground">
              The Burgess Principle
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Button onClick={() => navigate("/")} size="sm">
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="px-4 py-16 md:py-24"
        aria-labelledby="hero-heading"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary-foreground" aria-hidden="true" />
          </div>
          <h1
            id="hero-heading"
            className="text-3xl md:text-5xl font-serif font-bold text-foreground leading-tight"
          >
            Assert your right to reasonable adjustments — with confidence
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            A free, AI-powered companion that helps people with hidden
            disabilities navigate conversations about their rights. Available
            across 21 countries. No sign-up required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="text-base h-14 px-8"
            >
              Start a conversation <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/about")}
              size="lg"
              className="text-base h-14 px-8"
            >
              Learn more
            </Button>
          </div>
        </div>
      </section>

      {/* What Is The Burgess Principle */}
      <section
        className="px-4 py-16 bg-card border-y"
        aria-labelledby="what-heading"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <h2
            id="what-heading"
            className="text-2xl md:text-3xl font-serif font-bold text-foreground"
          >
            What is The Burgess Principle?
          </h2>
          <blockquote className="border-l-4 border-accent pl-4 py-2 bg-accent/5 rounded-r-lg text-lg font-medium">
            Before a decision is made about you, someone should actually look at{" "}
            <em>your</em> situation — not just apply a blanket rule.
          </blockquote>
          <p className="text-base text-muted-foreground leading-relaxed">
            Too often, organisations hide behind rigid policies: &ldquo;That's
            just how we do things.&rdquo; But people aren't all the same. What
            works for one person might be impossible — or unfair — for another.
            The Burgess Principle says that a real person should consider your
            individual circumstances before making a decision that affects you.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed">
            This tool helps you have that conversation. It generates clear,
            polite messages you can show directly to staff on your phone. If the
            conversation gets difficult, the AI co-pilot suggests what to say
            next — always calm, always respectful, but firm about your rights.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16" aria-labelledby="features-heading">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center">
            <h2
              id="features-heading"
              className="text-2xl md:text-3xl font-serif font-bold text-foreground"
            >
              How it helps
            </h2>
            <p className="mt-3 text-muted-foreground text-base max-w-xl mx-auto">
              Everything you need to advocate for yourself — in one free,
              private, and accessible tool.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="border rounded-xl p-6 bg-card space-y-3"
              >
                <feature.icon
                  className="w-6 h-6 text-accent"
                  aria-hidden="true"
                />
                <h3 className="text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Scenarios / Guides */}
      <section
        className="px-4 py-16 bg-card border-y"
        aria-labelledby="examples-heading"
      >
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center">
            <h2
              id="examples-heading"
              className="text-2xl md:text-3xl font-serif font-bold text-foreground"
            >
              Example scenarios
            </h2>
            <p className="mt-3 text-muted-foreground text-base max-w-xl mx-auto">
              See how the companion helps in real-world situations. These are
              illustrative examples — the AI tailors messages to your specific
              circumstances.
            </p>
          </div>
          <div className="space-y-6">
            {EXAMPLE_SCENARIOS.map((scenario) => (
              <article
                key={scenario.title}
                className="border rounded-xl p-6 bg-background space-y-4"
              >
                <div className="flex items-start gap-3">
                  <MessageSquare
                    className="w-5 h-5 text-accent mt-1 shrink-0"
                    aria-hidden="true"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {scenario.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Condition: {scenario.condition}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>Situation:</strong> {scenario.context}
                </p>
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <p className="text-sm font-medium text-foreground mb-1">
                    Example message:
                  </p>
                  <p className="text-sm text-muted-foreground italic">
                    &ldquo;{scenario.example}&rdquo;
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Overview by Country */}
      <section className="px-4 py-16" aria-labelledby="legal-heading">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center">
            <h2
              id="legal-heading"
              className="text-2xl md:text-3xl font-serif font-bold text-foreground"
            >
              Legal frameworks across 21 countries
            </h2>
            <p className="mt-3 text-muted-foreground text-base max-w-2xl mx-auto">
              The companion references your country's specific disability rights
              legislation, so you always speak the right legal language.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUPPORTED_COUNTRIES.map((country) => (
              <div
                key={country.name}
                className="border rounded-lg p-4 bg-card"
              >
                <p className="font-medium text-foreground text-sm">
                  {country.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {country.law}
                </p>
              </div>
            ))}
            <div className="border rounded-lg p-4 bg-card border-dashed">
              <p className="font-medium text-foreground text-sm">
                Other countries
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Generic reasonable adjustment language
              </p>
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div
            className="bg-destructive/5 border border-destructive/20 rounded-xl p-6"
            role="note"
            aria-label="Legal disclaimer"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle
                className="w-5 h-5 text-destructive mt-0.5 shrink-0"
                aria-hidden="true"
              />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">
                  Important: This is not legal advice
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  The Burgess Principle Companion is an educational and
                  self-advocacy tool. It provides general information about
                  disability rights and reasonable adjustments based on publicly
                  available legal frameworks. It does not constitute legal
                  advice, and should not be treated as a substitute for
                  professional legal counsel. If you are facing a legal dispute
                  or need specific legal guidance, please consult a qualified
                  solicitor, attorney, or legal aid service in your
                  jurisdiction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility Statement */}
      <section
        className="px-4 py-16 bg-card border-y"
        aria-labelledby="accessibility-heading"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          <h2
            id="accessibility-heading"
            className="text-2xl md:text-3xl font-serif font-bold text-foreground"
          >
            Accessibility commitment
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            As a tool designed for people with disabilities, accessibility is a
            core priority — not an afterthought. We are committed to meeting
            WCAG 2.1 AA standards and continuously improving the experience for
            all users.
          </p>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5" aria-hidden="true">✓</span>
              <span>Keyboard-navigable interface with visible focus indicators</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5" aria-hidden="true">✓</span>
              <span>Screen reader compatible with semantic HTML and ARIA labels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5" aria-hidden="true">✓</span>
              <span>Colour scheme designed for readability with dark mode support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5" aria-hidden="true">✓</span>
              <span>Large, readable text in staff display mode</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5" aria-hidden="true">✓</span>
              <span>Mobile-first, responsive design that works on any device</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-accent mt-0.5" aria-hidden="true">✓</span>
              <span>No auto-playing media, animations respect reduced motion preferences</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Open Source */}
      <section className="px-4 py-16" aria-labelledby="opensource-heading">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2
            id="opensource-heading"
            className="text-2xl md:text-3xl font-serif font-bold text-foreground"
          >
            Free and open source
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            The Burgess Principle Companion is{" "}
            <strong>completely free to use</strong> and{" "}
            <strong>open source under the MIT licence</strong>. We believe
            advocacy tools should be accessible to everyone, without paywalls or
            subscriptions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://github.com/ljbudgie/advocate-companion"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
            >
              View on GitHub <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
            <span className="text-muted-foreground text-sm hidden sm:block">
              •
            </span>
            <Link
              to="/about"
              className="text-sm text-accent hover:underline"
            >
              Read more about The Burgess Principle
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="px-4 py-16 bg-primary text-primary-foreground"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Scale className="w-10 h-10 mx-auto opacity-80" aria-hidden="true" />
          <h2
            id="cta-heading"
            className="text-2xl md:text-3xl font-serif font-bold"
          >
            Ready to advocate for yourself?
          </h2>
          <p className="text-base opacity-90 max-w-xl mx-auto">
            No sign-up. No data stored. Just a calm, informed companion that
            helps you assert your right to be treated as an individual.
          </p>
          <Button
            onClick={() => navigate("/")}
            size="lg"
            variant="secondary"
            className="text-base h-14 px-8"
          >
            Start your conversation <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-8 bg-card" role="contentinfo">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">
                The Burgess Principle
              </span>
            </div>
            <nav aria-label="Footer navigation">
              <div className="flex gap-6 text-sm text-muted-foreground">
                <Link to="/" className="hover:text-foreground transition-colors">
                  App
                </Link>
                <Link
                  to="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About
                </Link>
                <a
                  href="https://github.com/ljbudgie/advocate-companion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </div>
            </nav>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            UK Certification Mark — Registration UK00004343685. This tool
            provides general information, not legal advice. MIT Licence.
          </p>
        </div>
      </footer>
    </div>
  );
}
