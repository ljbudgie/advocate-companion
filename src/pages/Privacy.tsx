import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-heading text-lg font-semibold">Privacy Policy</h1>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6 text-sm leading-relaxed">
        <p className="text-muted-foreground">Last updated: 6 April 2025</p>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">1. Who we are</h2>
          <p>
            The Burgess Principle Companion ("we", "us", "our") is a digital advocacy tool
            designed to support individuals with hidden disabilities. This policy explains how
            we handle your data in compliance with the UK General Data Protection Regulation
            (UK GDPR) and the Data Protection Act 2018.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">2. What data we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Conversations:</strong> Text you enter when chatting with the AI helper. These are stored locally on your device only.</li>
            <li><strong>Journal entries:</strong> Saved conversations are stored locally on your device.</li>
            <li><strong>AI memory:</strong> Preferences and disability-related context you share are stored locally on your device to personalise responses.</li>
            <li><strong>Cookie consent preference:</strong> Whether you accepted or declined cookies, stored locally.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">3. How we use your data</h2>
          <p>
            Your data is used solely to provide and improve your experience with the companion tool.
            We do not sell, share, or transfer your personal data to third parties for marketing purposes.
          </p>
          <p>
            When you interact with the AI helper, your messages are sent to our backend service to
            generate responses. We do not retain these messages on our servers after the response is generated.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">4. Data storage &amp; security</h2>
          <p>
            All personal data (conversations, journal entries, AI memory) is stored locally in your
            browser's localStorage. This means your data stays on your device and is not accessible
            to us or any third party. Clearing your browser data will remove this information.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">5. Cookies</h2>
          <p>
            We use only essential cookies required for the application to function. We do not use
            tracking, analytics, or advertising cookies. You can manage your cookie preferences
            via the consent banner shown when you first visit the site.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">6. Your rights</h2>
          <p>Under UK GDPR, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Rectify inaccurate personal data</li>
            <li>Erase your personal data ("right to be forgotten")</li>
            <li>Restrict or object to processing</li>
            <li>Data portability</li>
          </ul>
          <p>
            Since all data is stored locally on your device, you can exercise these rights by
            clearing your browser data or using the in-app settings to view and delete your
            AI memory and journal entries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">7. Children's privacy</h2>
          <p>
            This service is not directed at children under 13. We do not knowingly collect
            personal data from children.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">8. Changes to this policy</h2>
          <p>
            We may update this policy from time to time. Any changes will be reflected on this
            page with an updated date.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold">9. Contact</h2>
          <p>
            If you have questions about this privacy policy or your data, please reach out
            through the app's feedback channels.
          </p>
        </section>
      </main>
    </div>
  );
};

export default Privacy;
