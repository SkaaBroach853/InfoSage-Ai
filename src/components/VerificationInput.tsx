import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Sparkles, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VerificationInputProps {
  onVerify: (content: string, type: "text" | "link" | "file") => void;
  isLoading?: boolean;
}

const VerificationInput = ({ onVerify, isLoading }: VerificationInputProps) => {
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some content to verify",
        variant: "destructive",
      });
      return;
    }

    const type = input.startsWith("http") ? "link" : "text";
    onVerify(input, type);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we'll just show a toast
      toast({
        title: "File uploaded",
        description: `Processing ${file.name}...`,
      });
      onVerify(file.name, "file");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="gradient-card rounded-2xl shadow-elegant p-8 border border-border">
        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste any message, link, or claim to verify..."
              className="min-h-[180px] text-base resize-none border-2 focus:border-primary transition-smooth"
              disabled={isLoading}
            />
            <div className="absolute bottom-3 right-3">
              <LinkIcon className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !input.trim()}
              className="flex-1 h-12 text-base font-semibold gradient-primary hover:opacity-90 transition-smooth shadow-md"
            >
              {isLoading ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                  Verifying across trusted sources...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Check Authenticity
                </>
              )}
            </Button>

            <div className="relative">
              <input
                type="file"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept="image/*,video/*"
                disabled={isLoading}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
                disabled={isLoading}
                className="w-full sm:w-auto h-12 text-base border-2 hover:border-primary transition-smooth"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload File
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Supports text, links, images, and videos
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationInput;
