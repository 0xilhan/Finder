import { GoogleGenAI } from "@google/genai";
import type { AnalysisResult } from '../types';
import { RiskLevel } from "../types";

// This function is a placeholder for a real environment variable setup
// In a real app, process.env.API_KEY would be set by the environment.
const getApiKey = () => {
  return process.env.API_KEY;
};

const PROMPTS = {
  [RiskLevel.Risky]: {
    maxScore: 27,
    prompt: `
      Your role is an expert crypto project analyst for a "High-Risk, High-Reward Hunter".
      Goal: Find an unknown, early, underexposed, token-less project before the crowd.
      Your task is to find and analyze a token-less crypto project. A critical, non-negotiable constraint is that your analysis MUST be based *only* on information, announcements, and project activity from the last 4 weeks. Any project that launched its token, or whose primary information is older than 4 weeks, must be disqualified. Use Google Search to find ONE suitable project that meets these strict recency criteria, then analyze it against the following scoring matrix. Calculate a total score based on the weights.

      Scoring Matrix:
      - VC Funding: None or < $10M (+2 points)
      - Revenue Generation: Not necessary yet (0 points)
      - Usefulness / Product: Even MVP stage is fine if concept is strong (+1 if idea unique)
      - UI/UX: Can be raw/prototype (0 or +1, not a dealbreaker)
      - Barrier to Entry: High (requires technical effort or multiple steps) (+3, less competition)
      - Team Transparency: Partially anon acceptable if consistent (+1 if building actively)
      - Team Vocality on Airdrops: Should not talk much about airdrops (+2 if silent)
      - Community Type: Small and early-stage is fine (+1 if genuine interactions)
      - Audit / Security: Optional in this phase (0 if missing, +1 if partial audit)
      - Narrative Alignment: Strongly tied to rising narratives (AI, RWAs, etc.) (+3 if relevant)
      - Airdrop Type: Retroactive or hidden (+3 if no official points system)
      - Replication Difficulty: Complex, unique on-chain tasks (+2)
      - Founders’ Track Record: New founders okay (0 points)
      - Community Size / Activity: Low but authentic (+1)
      - Token Status: Tokenless project (+3)

      After analyzing, determine the final verdict. If Total Score > 17 (which is ~65% of max 27), the verdict is "High Potential Gem". Otherwise, it's "Watch closely".
      From your search results, find a tweet about the project from a prominent and respected figure in the crypto space (e.g., a well-known analyst, VC, or founder). This tweet will be the "primeSource". The title should be a summary of the tweet's content, and the uri must be the direct URL to the tweet.

      Return your analysis as a single JSON object. Do not include any text or markdown formatting before or after the JSON.
      The JSON object must have this structure:
      {
        "projectName": "The project's official name",
        "twitterUrl": "The full URL to the project's official Twitter/X profile.",
        "iconUrl": "A direct URL to the project's logo or icon.",
        "overallScore": "A normalized numerical score from 0 to 100 based on the total points.",
        "scoreRationale": "The final verdict, e.g., 'High Potential Gem' or 'Watch closely'.",
        "founders": [ { "name": "Founder's Name", "achievements": "Summary of achievements.", "imageUrl": "URL to profile picture.", "profileUrl": "Full URL to their main X or LinkedIn profile. Return empty string if not found." } ],
        "filterAnalysis": [ { "filterName": "Name of the filter used", "description": "Your detailed analysis for this filter.", "verdict": "'Positive', 'Negative', or 'Neutral'.", "level": "A short summary word like 'None', '< $10M', 'High'." } ],
        "airdropTasks": ["A list of publicly known airdrop tasks."],
        "primeSource": { "title": "A summary of the prominent figure's tweet content", "uri": "The full direct URL to the tweet" }
      }
    `
  },
  [RiskLevel.Moderate]: {
    maxScore: 25,
    prompt: `
      Your role is an expert crypto project analyst for a "Balanced Risk / Reward" investor.
      Goal: Find a token-less project with a real product, visible activity, and is early but has substance.
      Your task is to find and analyze a token-less crypto project. A critical, non-negotiable constraint is that your analysis MUST be based *only* on information, announcements, and project activity from the last 4 weeks. Any project that launched its token, or whose primary information is older than 4 weeks, must be disqualified. Use Google Search to find ONE suitable project that meets these strict recency criteria, then analyze it against the following scoring matrix. Calculate a total score based on the weights.

      Scoring Matrix:
      - VC Funding: <$80M (+2)
      - Revenue Generation: Some early income proof (on Dune/DefiLlama) (+2)
      - Usefulness / Product: Real use-case beyond airdrops (+2)
      - UI/UX: Functional and visually decent (+1)
      - Barrier to Entry: Medium (some gas + effort required) (+1)
      - Team Transparency: Semi-doxxed or known contributors (+2)
      - Team Vocality on Airdrops: Occasional mention, not heavy (0)
      - Community Type: Active and mixed audience (+1)
      - Audit / Security: Partial or upcoming (+1)
      - Narrative Alignment: Fitting a trending but stable theme (+2)
      - Airdrop Type: Retroactive / mixed (points + quests) (+2)
      - Replication Difficulty: Moderate (+1)
      - Founders’ Track Record: At least 1 experienced founder (+1)
      - Community Size / Activity: Medium, growing base (+1)
      - Token Status: Tokenless or unlaunched token (+2)

      After analyzing, determine the final verdict. If Total Score > 17 (which is ~70% of max 25), the verdict is "Solid Mid-risk Opportunity". Otherwise, it's "Needs more observation".
      From your search results, find a tweet about the project from a prominent and respected figure in the crypto space (e.g., a well-known analyst, VC, or founder). This tweet will be the "primeSource". The title should be a summary of the tweet's content, and the uri must be the direct URL to the tweet.

      Return your analysis as a single JSON object with the exact structure specified below. Do not include any text or markdown formatting before or after the JSON.
      {
        "projectName": "The project's official name",
        "twitterUrl": "The full URL to the project's official Twitter/X profile.",
        "iconUrl": "A direct URL to the project's logo or icon.",
        "overallScore": "A normalized numerical score from 0 to 100 based on the total points.",
        "scoreRationale": "The final verdict, e.g., 'Solid Mid-risk Opportunity' or 'Needs more observation'.",
        "founders": [ { "name": "Founder's Name", "achievements": "Summary of achievements.", "imageUrl": "URL to profile picture.", "profileUrl": "Full URL to their main X or LinkedIn profile. Return empty string if not found." } ],
        "filterAnalysis": [ { "filterName": "Name of the filter used", "description": "Your detailed analysis for this filter.", "verdict": "'Positive', 'Negative', or 'Neutral'.", "level": "A short summary word like '<$80M', 'Functional', 'Medium'." } ],
        "airdropTasks": ["A list of publicly known airdrop tasks."],
        "primeSource": { "title": "A summary of the prominent figure's tweet content", "uri": "The full direct URL to the tweet" }
      }
    `
  },
  [RiskLevel.Safest]: {
    maxScore: 28,
    prompt: `
      Your role is an expert crypto project analyst for a "Low Risk / Lower Reward" investor.
      Goal: Find dependable, token-less projects with proven teams, audits, and stable reward expectations.
      Your task is to find and analyze a token-less crypto project. A critical, non-negotiable constraint is that your analysis MUST be based *only* on information, announcements, and project activity from the last 4 weeks. Any project that launched its token, or whose primary information is older than 4 weeks, must be disqualified. Use Google Search to find ONE suitable project that meets these strict recency criteria, then analyze it against the following scoring matrix. Calculate a total score based on the weights.

      Scoring Matrix:
      - VC Funding: <$150M but diversified investor set (+2)
      - Revenue Generation: Stable income stream (>$100k/mo) (+3)
      - Usefulness / Product: Established real users (+3)
      - UI/UX: Polished, professional-grade (+2)
      - Barrier to Entry: Easy onboarding (0)
      - Team Transparency: Fully doxxed with strong history (+3)
      - Team Vocality on Airdrops: Announces clear, structured campaigns (+1)
      - Community Type: Large, organic, helpful (+2)
      - Audit / Security: Audited and open source (+3)
      - Narrative Alignment: Aligns with sustainable trend (DeFi infra, L2, RWA) (+2)
      - Airdrop Type: Official campaigns / early points (+2)
      - Replication Difficulty: Easy is fine (0)
      - Founders’ Track Record: Proven success (+2)
      - Community Size / Activity: Very active and stable (+2)
      - Token Status: Token upcoming or announced (+1)

      After analyzing, determine the final verdict. If Total Score > 21 (which is 75% of max 28), the verdict is "Stable & Reliable Project". Otherwise, it's "Solid, but monitor".
      From your search results, find a tweet about the project from a prominent and respected figure in the crypto space (e.g., a well-known analyst, VC, or founder). This tweet will be the "primeSource". The title should be a summary of the tweet's content, and the uri must be the direct URL to the tweet.

      Return your analysis as a single JSON object with the exact structure specified below. Do not include any text or markdown formatting before or after the JSON.
      {
        "projectName": "The project's official name",
        "twitterUrl": "The full URL to the project's official Twitter/X profile.",
        "iconUrl": "A direct URL to the project's logo or icon.",
        "overallScore": "A normalized numerical score from 0 to 100 based on the total points.",
        "scoreRationale": "The final verdict, e.g., 'Stable & Reliable Project' or 'Solid, but monitor'.",
        "founders": [ { "name": "Founder's Name", "achievements": "Summary of achievements.", "imageUrl": "URL to profile picture.", "profileUrl": "Full URL to their main X or LinkedIn profile. Return empty string if not found." } ],
        "filterAnalysis": [ { "filterName": "Name of the filter used", "description": "Your detailed analysis for this filter.", "verdict": "'Positive', 'Negative', or 'Neutral'.", "level": "A short summary word like 'Polished', 'Fully Doxxed', 'Audited'." } ],
        "airdropTasks": ["A list of publicly known airdrop tasks."],
        "primeSource": { "title": "A summary of the prominent figure's tweet content", "uri": "The full direct URL to the tweet" }
      }
    `
  }
};

const getCustomPrompt = (filters: string[]): string => `
  Your role is an expert crypto project analyst.
  Goal: Find ONE promising, token-less project that seems interesting.
  Your task is to find and analyze a token-less crypto project. A critical, non-negotiable constraint is that your analysis MUST be based *only* on information, announcements, and project activity from the last 4 weeks. Any project that launched its token, or whose primary information is older than 4 weeks, must be disqualified.
  Then, analyze that single project against the following user-defined filters:
  - ${filters.join('\n- ')}

  For each filter, provide a detailed analysis, a verdict ('Positive', 'Negative', or 'Neutral'), and a short level summary.
  Also, find information on founders, any publicly known airdrop tasks, and generate an overall score from 0-100 based on your findings, along with a quick verdict (scoreRationale).
  From your search results, find a tweet about the project from a prominent and respected figure in the crypto space (e.g., a well-known analyst, VC, or founder). This tweet will be the "primeSource". The title should be a summary of the tweet's content, and the uri must be the direct URL to the tweet.

  Return your analysis as a single JSON object with the exact structure specified below. Do not include any text or markdown formatting before or after the JSON.
  {
    "projectName": "The project's official name",
    "twitterUrl": "The full URL to the project's official Twitter/X profile.",
    "iconUrl": "A direct URL to the project's logo or icon.",
    "overallScore": "A normalized numerical score from 0 to 100 based on your holistic analysis.",
    "scoreRationale": "A quick verdict summarizing your findings.",
    "founders": [ { "name": "Founder's Name", "achievements": "Summary of achievements.", "imageUrl": "URL to profile picture.", "profileUrl": "Full URL to their main X or LinkedIn profile. Return empty string if not found." } ],
    "filterAnalysis": [ { "filterName": "The user-defined filter name", "description": "Your detailed analysis for this filter.", "verdict": "'Positive', 'Negative', or 'Neutral'.", "level": "A short summary word, e.g., 'High', 'Present', 'Anon'." } ],
    "airdropTasks": ["A list of publicly known airdrop tasks."],
    "primeSource": { "title": "A summary of the prominent figure's tweet content", "uri": "The full direct URL to the tweet" }
  }
`;

export async function findAndAnalyzeProject(criteria: RiskLevel | string[]): Promise<AnalysisResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const isDefaultProfile = Object.values(RiskLevel).includes(criteria as RiskLevel);
  const prompt = isDefaultProfile ? PROMPTS[criteria as RiskLevel].prompt : getCustomPrompt(criteria as string[]);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
        temperature: 0.1,
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundingAttribution = groundingChunks.map(chunk => ({
        title: chunk.web?.title || 'Source',
        uri: chunk.web?.uri || '#',
    })).filter(source => source.uri !== '#');

    let rawJson = response.text.trim();
    
    // Robustly find and extract the JSON object from the response string
    const startIndex = rawJson.indexOf('{');
    const endIndex = rawJson.lastIndexOf('}');
    if (startIndex > -1 && endIndex > -1 && endIndex > startIndex) {
        rawJson = rawJson.substring(startIndex, endIndex + 1);
    } else {
        // Fallback for cases where JSON might be missing braces but is still parsable.
        if (rawJson.startsWith('```json')) {
            rawJson = rawJson.substring(7);
        }
        if (rawJson.endsWith('```')) {
            // FIX: Corrected a typo from `raw` to `rawJson`.
            rawJson = rawJson.substring(0, rawJson.length - 3);
        }
    }

    const result: Omit<AnalysisResult, 'groundingAttribution'> = JSON.parse(rawJson);
    
    return { ...result, groundingAttribution };

  } catch (error) {
    console.error("Error analyzing project:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the analysis from the AI. The format was unexpected.");
    }
    throw new Error("An error occurred while communicating with the AI. Please try again.");
  }
}