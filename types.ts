export interface Founder {
  name: string;
  achievements: string;
  imageUrl: string;
  profileUrl: string;
}

export interface FilterAnalysis {
  filterName: string;
  description: string;
  verdict: 'Positive' | 'Negative' | 'Neutral';
  level: string; // e.g., 'Low', 'High', 'None'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface AnalysisResult {
  projectName: string;
  twitterUrl: string;
  iconUrl: string;
  overallScore: number;
  scoreRationale: string; // Used as the "Quick Verdict"
  founders: Founder[];
  filterAnalysis: FilterAnalysis[];
  airdropTasks: string[];
  groundingAttribution: GroundingSource[];
  primeSource?: GroundingSource;
}

export enum AppScreen {
  Search = 'search',
  Loading = 'loading',
  Results = 'results',
  Favorites = 'favorites',
}

export enum RiskLevel {
  Risky = 'Risky',
  Moderate = 'Moderate',
  Safest = 'Safest',
}

export enum FilterMode {
  Default = 'Default Profile',
  Custom = 'Custom Filters',
}
