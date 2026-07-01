import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background" id="main-content">
      <header className="border-b bg-card px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-accent" />
          <span className="font-serif font-semibold text-foreground">About</span>
        </div>
      </header>

      <div className="max-w-lg mx-auto p-6 space-y-8">
        <div className="space-y-3">
          <h1 className="text-2xl font-serif font-bold text-foreground">
            What is the Burgess Principle?
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            A simple idea that protects everyone.
          </p>
        </div>

        <div className="space-y-5 text-base text-foreground leading-relaxed">
          <p>
            The Burgess Principle is built on one straightforward question:
          </p>

          <blockquote className="border-l-4 border-accent pl-4 py-2 bg-accent/5 rounded-r-lg text-lg font-medium">
            Was a human able to personally review the specific facts of <em>your</em> situation — or was a blanket rule simply applied?
          </blockquote>

          <p>
            Too often, organisations hide behind rigid policies. "That's just how we do things." "We can't make exceptions." "Everyone has to follow the same process."
          </p>

          <p>
            But people aren't all the same. What works for one person might be impossible — or unfair — for another. The Burgess Principle says that a real, named person should consider your individual circumstances before making a decision that affects you.
          </p>

          <h2 className="text-xl font-serif font-semibold pt-2">The three answers</h2>

          <p>
            Every institutional response falls into one of three outcomes:
          </p>

          <ul className="space-y-2 list-none pl-0">
            <li>
              <strong>SOVEREIGN</strong> — a named human individually reviewed the specific facts of your case before acting.
            </li>
            <li>
              <strong>NULL</strong> — no individual human review took place. The decision was processed, not considered.
            </li>
            <li>
              <strong>AMBIGUOUS</strong> — vague process language ("human oversight", "reviewed in line with policy") without confirming that a named reviewer actually looked at <em>your</em> facts. Treat this as NULL until it is clarified.
            </li>
          </ul>

          <p>
            NULL and AMBIGUOUS are not the end of the road — they are the documented starting point for asking again, escalating, and putting things right.
          </p>

          <h2 className="text-xl font-serif font-semibold pt-2">Who is it for?</h2>

          <p>
            <strong>Everyone.</strong> While it's especially important for people with disabilities or hidden disabilities — who are often told "we can't make adjustments" — the principle applies to anyone facing a blanket policy that ignores their individual needs.
          </p>

          <h2 className="text-xl font-serif font-semibold pt-2">What does this tool do?</h2>

          <p>
            This companion helps you have the conversation. It generates clear, polite messages you can show directly to staff on your phone. If the conversation gets difficult, the AI co-pilot suggests what to say next — always calm, always respectful, but firm about your right to be treated as an individual.
          </p>

          <h2 className="text-xl font-serif font-semibold pt-2">Is it legal?</h2>

          <p>
            The Burgess Principle is a registered UK Certification Mark. In many places, the law already requires organisations to consider individual circumstances or to provide meaningful human review — like the Equality Act 2010 and the right to meaningful human involvement under UK GDPR Articles 22A–22D (Data (Use and Access) Act 2025) in the UK, the EU AI Act (Article 14), or the ADA in the US. This tool helps you reference those rights in plain language, without needing to be a lawyer.
          </p>
        </div>

        <div className="border rounded-xl p-5 bg-card space-y-3">
          <p className="text-sm font-medium text-foreground">UK Certification Mark</p>
          <p className="text-sm text-muted-foreground">
            Registration number UK00004343685
          </p>
          <a
            href="https://trademarks.ipo.gov.uk/ipo-tmcase/page/Results/1/UK00004343685"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            View on IPO Register <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <Button onClick={() => navigate("/")} className="w-full h-12 text-base">
          Get started
        </Button>
      </div>
    </div>
  );
}
