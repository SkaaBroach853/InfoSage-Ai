import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, type } = await req.json();
    console.log('Verifying content:', { content: content.substring(0, 100), type });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Multi-agent system prompt
    const systemPrompt = `You are InfoSage AI, a multi-agent misinformation detection system. Your role is to:

1. Extract the main claim from the provided content
2. Analyze the claim against factual databases and credible sources
3. Provide an accuracy score (0-100%)
4. Determine verdict: "true" (70-100%), "unclear" (40-69%), or "false" (0-39%)
5. Cite 3 verified evidence sources with URLs
6. Write a clear explanation in plain language
7. Provide an awareness tip to help users identify misinformation

Return a JSON object with this exact structure:
{
  "claim": "extracted main claim (max 150 chars)",
  "accuracy": 0-100,
  "verdict": "true" | "unclear" | "false",
  "evidence": [
    {
      "source": "Source name",
      "url": "https://...",
      "snippet": "Brief quote or summary"
    }
  ],
  "explanation": "Analysis in 2-3 sentences",
  "awarenessTip": "Practical tip to avoid similar misinformation"
}

Be objective, cite real sources when possible, and prioritize user education.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Verify this ${type}: ${content}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again shortly.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const aiContent = aiResponse.choices[0]?.message?.content;

    if (!aiContent) {
      throw new Error('No response from AI');
    }

    console.log('AI Response:', aiContent);

    // Parse JSON from AI response
    let result;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiContent.match(/```json\n([\s\S]*?)\n```/) || 
                       aiContent.match(/```\n([\s\S]*?)\n```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiContent;
      result = JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      // Fallback response if parsing fails
      result = {
        claim: content.substring(0, 150),
        accuracy: 50,
        verdict: "unclear",
        evidence: [
          {
            source: "Verification System",
            url: "https://www.snopes.com/",
            snippet: "Unable to automatically verify this claim. Manual fact-checking recommended."
          }
        ],
        explanation: "The verification system encountered difficulty analyzing this content. Please consult trusted fact-checking sources for manual verification.",
        awarenessTip: "When in doubt, cross-reference claims with multiple authoritative sources like WHO, Reuters, or government agencies."
      };
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Verification failed',
        details: 'Please try again or contact support if the issue persists.'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
