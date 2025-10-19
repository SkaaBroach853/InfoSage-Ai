import { useState } from "react";
import Navigation from "@/components/Navigation";
import VerificationInput from "@/components/VerificationInput";
import VerificationResult from "@/components/VerificationResult";
import { Shield } from "lucide-react";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async (content: string, type: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-content`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content, type }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Verification failed');
      }

      const result = await response.json();
      setResult(result);
    } catch (error) {
      console.error('Verification error:', error);
      setResult({
        claim: content.substring(0, 150),
        accuracy: 0,
        verdict: "unclear",
        evidence: [
          {
            source: "System Error",
            url: "#",
            snippet: "Unable to complete verification. Please try again.",
          },
        ],
        explanation: error instanceof Error ? error.message : "An error occurred during verification.",
        awarenessTip: "Always cross-check information from multiple reliable sources.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {!result ? (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-4 animate-fade-in">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-primary shadow-xl mb-4">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                Truth, Verified by AI
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Instantly detect misinformation and fake news with advanced AI analysis.
                Paste any message, link, or upload content to get verified results.
              </p>
            </div>

            {/* Input Section */}
            <VerificationInput onVerify={handleVerify} isLoading={isLoading} />

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { label: "AI-Powered", value: "Multi-Agent" },
                { label: "Sources", value: "50+ Verified" },
                { label: "Response Time", value: "< 5 seconds" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-6 rounded-xl gradient-card border border-border shadow-md"
                >
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setResult(null)}
              className="text-primary hover:text-primary-dark font-semibold transition-smooth"
            >
              ← New Verification
            </button>
            <VerificationResult {...result} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
