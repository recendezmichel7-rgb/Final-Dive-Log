
export interface DiveEntry {
  date: string;
  diveSite: string;
  totalTime: string;
  maxDepth: string;
  avgDepth: string;
  waterTemp: string;
  visibility: string;
  current: string;
  waves: string;
  guide: string;
  typeOfAir: string;
}

/**
 * Interface for AI-generated pro diver insights based on site conditions.
 */
export interface GeminiInsight {
  title: string;
  content: string;
  advice: string;
}
