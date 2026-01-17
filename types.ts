
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

// Added GeminiInsight interface to fix import error in geminiService.ts
export interface GeminiInsight {
  title: string;
  content: string;
  advice: string;
}
