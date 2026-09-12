/**
 * Client-side Auto Spell & Grammar Checker engine.
 * Detects common spelling mistakes, repeated duplicate words (e.g. "and and"),
 * and common typographical errors with instant one-click corrections.
 */

export interface TypoIssue {
  id: string;
  original: string;
  suggestion: string;
  alternatives?: string[];
  type: 'spelling' | 'duplicate' | 'grammar';
  reason: string;
  context: string;
}

// High-confidence common typographical and spelling errors dictionary
export const COMMON_TYPOS: Record<string, string> = {
  // Common slips
  teh: 'the',
  adn: 'and',
  recieve: 'receive',
  recieved: 'received',
  recieving: 'receiving',
  seperate: 'separate',
  seperated: 'separated',
  seperating: 'separating',
  definately: 'definitely',
  definate: 'definite',
  occurance: 'occurrence',
  occured: 'occurred',
  untill: 'until',
  truely: 'truly',
  wierd: 'weird',
  wierdly: 'weirdly',
  accomodate: 'accommodate',
  accomodation: 'accommodation',
  beleive: 'believe',
  beleived: 'believed',
  beleiving: 'believing',
  calender: 'calendar',
  embarass: 'embarrass',
  embarassed: 'embarrassed',
  enviroment: 'environment',
  goverment: 'government',
  grammer: 'grammar',
  happend: 'happened',
  knowlege: 'knowledge',
  neccessary: 'necessary',
  unneccessary: 'unnecessary',
  peice: 'piece',
  possession: 'possession',
  priviledge: 'privilege',
  refering: 'referring',
  suprise: 'surprise',
  suprised: 'surprised',
  tommorrow: 'tomorrow',
  tomorow: 'tomorrow',
  writting: 'writing',
  writen: 'written',
  alot: 'a lot',
  reccomend: 'recommend',
  recomended: 'recommended',
  independant: 'independent',
  acheive: 'achieve',
  acheived: 'achieved',
  acheivement: 'achievement',
  apparantly: 'apparently',
  arguement: 'argument',
  begining: 'beginning',
  colleage: 'college',
  collegue: 'colleague',
  collegues: 'colleagues',
  concious: 'conscious',
  dissapear: 'disappear',
  dissapoint: 'disappoint',
  existance: 'existence',
  foriegn: 'foreign',
  garantee: 'guarantee',
  guarentee: 'guarantee',
  harasment: 'harassment',
  heigth: 'height',
  hieght: 'height',
  hierachy: 'hierarchy',
  humourous: 'humorous',
  immediatly: 'immediately',
  incidently: 'incidentally',
  inteligence: 'intelligence',
  interupt: 'interrupt',
  judgement: 'judgment',
  liaison: 'liaison',
  maintainance: 'maintenance',
  millenium: 'millennium',
  miniture: 'miniature',
  mispell: 'misspell',
  mispelled: 'misspelled',
  noticable: 'noticeable',
  occassion: 'occasion',
  occassionally: 'occasionally',
  paralell: 'parallel',
  persue: 'pursue',
  posession: 'possession',
  prefered: 'preferred',
  pronounciation: 'pronunciation',
  relevent: 'relevant',
  relavent: 'relevant',
  religous: 'religious',
  resistence: 'resistance',
  rythm: 'rhythm',
  sence: 'sense',
  sieze: 'seize',
  successfull: 'successful',
  supercede: 'supersede',
  tendancy: 'tendency',
  threshhold: 'threshold',
  transfered: 'transferred',
  unforseen: 'unforeseen',
  untilll: 'until',
  vehical: 'vehicle',
  vaccum: 'vacuum',
  weild: 'wield',
  yeild: 'yield',
  yhe: 'the',
  taht: 'that',
  waht: 'what',
  wiht: 'with',
  thier: 'their',
  ther: 'there',
  dont: "don't",
  cant: "can't",
  wont: "won't",
  isnt: "isn't",
  arent: "aren't",
  couldnt: "couldn't",
  shouldnt: "shouldn't",
  wouldnt: "wouldn't",
  didnt: "didn't",
  hasnt: "hasn't",
  havent: "haven't",
};

/**
 * Scan text or HTML content for typos and repeated words
 */
export function scanForTypos(content: string): TypoIssue[] {
  if (!content) return [];

  // Strip HTML tags for token parsing while preserving text
  const doc = new DOMParser().parseFromString(`<body>${content}</body>`, 'text/html');
  const plainText = doc.body.textContent || '';

  const issues: TypoIssue[] = [];
  const words = plainText.split(/\s+/).filter(Boolean);

  // 1. Check for Duplicate Repeated Words (e.g. "and and", "the the", "in in", "is is")
  const commonDuplicateCheck = new Set(['and', 'the', 'in', 'is', 'it', 'to', 'of', 'that', 'with', 'for', 'on', 'as', 'at', 'by', 'this', 'we', 'you', 'they']);
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i].replace(/[^\w]/g, '').toLowerCase();
    const w2 = words[i + 1].replace(/[^\w]/g, '').toLowerCase();

    if (w1 && w1 === w2 && commonDuplicateCheck.has(w1)) {
      const phrase = `${words[i]} ${words[i + 1]}`;
      issues.push({
        id: `dup_${i}_${w1}`,
        original: phrase,
        suggestion: words[i],
        type: 'duplicate',
        reason: `Repeated word "${w1}"`,
        context: `"...${words.slice(Math.max(0, i - 2), Math.min(words.length, i + 4)).join(' ')}..."`,
      });
    }
  }

  // 2. Check for Dictionary Typo Matches
  for (let i = 0; i < words.length; i++) {
    const rawWord = words[i];
    const cleaned = rawWord.replace(/[^\w]/g, '').toLowerCase();
    if (!cleaned || cleaned.length < 2) continue;

    if (COMMON_TYPOS[cleaned]) {
      const correct = COMMON_TYPOS[cleaned];
      // Preserve uppercase if original had it
      let finalSuggestion = correct;
      if (rawWord[0] === rawWord[0].toUpperCase() && rawWord[0] !== rawWord[0].toLowerCase()) {
        finalSuggestion = correct.charAt(0).toUpperCase() + correct.slice(1);
      }

      // Avoid adding if same token already flagged as duplicate
      if (!issues.some((iss) => iss.original.toLowerCase() === rawWord.toLowerCase())) {
        issues.push({
          id: `typo_${i}_${cleaned}`,
          original: rawWord,
          suggestion: finalSuggestion,
          type: 'spelling',
          reason: `Misspelled word "${rawWord}"`,
          context: `"...${words.slice(Math.max(0, i - 2), Math.min(words.length, i + 3)).join(' ')}..."`,
        });
      }
    }
  }

  return issues;
}

/**
 * Apply a single typo fix to document HTML safely
 */
export function applyTypoFix(html: string, issue: TypoIssue, overrideSuggestion?: string): string {
  const target = issue.original;
  const replacement = overrideSuggestion || issue.suggestion;

  // Exact word boundary regex
  const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');

  return html.replace(regex, replacement);
}

/**
 * Auto-correct all detected typos in one click
 */
export function autoCorrectAllTypos(html: string, issues: TypoIssue[]): { updatedHtml: string; count: number } {
  let result = html;
  let count = 0;

  for (const issue of issues) {
    const escaped = issue.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, issue.suggestion);
      count++;
    }
  }

  return { updatedHtml: result, count };
}
