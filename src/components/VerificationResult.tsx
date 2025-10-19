import { CheckCircle, XCircle, AlertTriangle, ExternalLink, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface VerificationResultProps {
  claim: string;
  accuracy: number;
  verdict: "true" | "false" | "unclear";
  evidence: Array<{ source: string; url: string; snippet: string }>;
  explanation: string;
  awarenessTip: string;
}

const VerificationResult = ({
  claim,
  accuracy,
  verdict,
  evidence,
  explanation,
  awarenessTip,
}: VerificationResultProps) => {
  const verdictConfig = {
    true: {
      icon: CheckCircle,
      color: "text-success",
      bg: "bg-success-light",
      label: "Verified True",
      badgeVariant: "default" as const,
    },
    false: {
      icon: XCircle,
      color: "text-destructive",
      bg: "bg-destructive-light",
      label: "False Information",
      badgeVariant: "destructive" as const,
    },
    unclear: {
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning-light",
      label: "Needs Context",
      badgeVariant: "secondary" as const,
    },
  };

  const config = verdictConfig[verdict];
  const Icon = config.icon;

  const getProgressColor = () => {
    if (accuracy >= 70) return "bg-success";
    if (accuracy >= 40) return "bg-warning";
    return "bg-destructive";
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Main Claim */}
      <Card className="p-6 gradient-card border-2">
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">Main Claim</h3>
        <p className="text-xl font-semibold text-foreground">{claim}</p>
      </Card>

      {/* Accuracy Score */}
      <Card className="p-6 border-2">
        <div className="flex items-start gap-4">
          <div className={cn("p-3 rounded-xl", config.bg)}>
            <Icon className={cn("w-8 h-8", config.color)} />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Accuracy Score</h3>
              <Badge variant={config.badgeVariant} className="text-sm px-3 py-1">
                {config.label}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Confidence Level</span>
                <span className={cn("font-bold text-lg", config.color)}>{accuracy}%</span>
              </div>
              <Progress value={accuracy} className="h-3">
                <div className={cn("h-full rounded-full transition-all", getProgressColor())} />
              </Progress>
            </div>
          </div>
        </div>
      </Card>

      {/* Explanation */}
      <Card className="p-6 border-2">
        <h3 className="text-lg font-bold text-foreground mb-3">Analysis</h3>
        <p className="text-muted-foreground leading-relaxed">{explanation}</p>
      </Card>

      {/* Evidence */}
      <Card className="p-6 border-2">
        <h3 className="text-lg font-bold text-foreground mb-4">Verified Evidence</h3>
        <div className="space-y-3">
          {evidence.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth group"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-foreground group-hover:text-primary transition-smooth">
                      {item.source}
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-smooth" />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.snippet}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </Card>

      {/* Awareness Tip */}
      <Card className="p-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Lightbulb className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground mb-2">Awareness Tip</h3>
            <p className="text-muted-foreground leading-relaxed">{awarenessTip}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VerificationResult;
