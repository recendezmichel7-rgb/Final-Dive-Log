
import { DiveEntry } from '../types';

const SHEET_ID = '1Xn4HTnQ_i8YgqCD_jdNcO8odXTznGstFVNZzvnoVAX0';
const TAB_NAME = 'Form Responses 1';

/**
 * Fetches data from Google Sheets as CSV and parses it.
 * Note: The sheet must be "Published to the web" or publicly accessible.
 */
export async function fetchDiveData(): Promise<DiveEntry[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(TAB_NAME)}`;
    const response = await fetch(url);
    const csvText = await response.text();
    
    // Manual CSV parsing (assuming simple standard format from Google Forms)
    // For more robust parsing in production, use a library like PapaParse
    const lines = csvText.split('\n');
    const entries: DiveEntry[] = [];

    // Skip header (i=0)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Handle CSV escaping (roughly)
      const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
      if (!matches) continue;
      
      const clean = (val: string) => val.replace(/^"|"$/g, '').trim();

      // Based on user prompt:
      // Index 1 (B): Date
      // Index 2 (C): Dive Site
      // Index 3 (D): Total Time
      // Index 4 (E): Maximum Depth
      // Index 5 (F): Average Depth
      // Index 6 (G): Water Temperature
      // Index 7 (H): Visibility
      // Index 8 (I): Current
      // Index 9 (J): Waves
      // Index 10 (K): Guide
      // Index 11 (L): Type of Air

      entries.push({
        date: clean(matches[1] || ''),
        diveSite: clean(matches[2] || 'Unknown Site'),
        totalTime: clean(matches[3] || ''),
        maxDepth: clean(matches[4] || ''),
        avgDepth: clean(matches[5] || ''),
        waterTemp: clean(matches[6] || ''),
        visibility: clean(matches[7] || ''),
        current: clean(matches[8] || ''),
        waves: clean(matches[9] || ''),
        guide: clean(matches[10] || ''),
        typeOfAir: clean(matches[11] || ''),
      });
    }

    return entries.reverse(); // Newest first
  } catch (error) {
    console.error('Error fetching dive data:', error);
    return [];
  }
}
