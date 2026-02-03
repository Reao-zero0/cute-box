import { Paper } from '../types';

const STORAGE_KEY = 'mystery_papers_data';
const HISTORY_KEY = 'mystery_papers_history';

export const getPapers = (): Paper[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading storage", e);
    return [];
  }
};

// Helper to get papers grouped by content for Admin UI
export const getGroupedPapers = (): { content: string; count: number }[] => {
  const papers = getPapers();
  const groups: Record<string, number> = {};
  
  papers.forEach(p => {
    // Safety check for invalid content
    if (!p.content) return;
    
    // Normalize content
    const content = String(p.content).trim(); 
    groups[content] = (groups[content] || 0) + 1;
  });

  return Object.entries(groups).map(([content, count]) => ({ content, count }));
};

export const getHistory = (): Paper[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Error reading history", e);
    return [];
  }
};

export const savePapers = (papers: Paper[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(papers));
};

export const saveHistory = (papers: Paper[]) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(papers));
};

export const addPaper = (content: string): Paper => {
  const papers = getPapers();
  const newPaper: Paper = {
    id: crypto.randomUUID(),
    content: content.trim(),
    createdAt: Date.now(),
  };
  papers.push(newPaper);
  savePapers(papers);
  return newPaper;
};

// Update a group of papers (change content and/or quantity)
export const updatePaperGroup = (oldContent: string, newContent: string, newCount: number) => {
  let papers = getPapers();
  const normalizedOld = oldContent.trim();
  const normalizedNew = newContent.trim();

  // 1. Remove all instances of the old content
  const otherPapers = papers.filter(p => (p.content || '').trim() !== normalizedOld);

  // 2. Create new instances based on the new count
  const newPapers: Paper[] = Array(newCount).fill(null).map(() => ({
    id: crypto.randomUUID(),
    content: normalizedNew,
    createdAt: Date.now()
  }));

  // 3. Save combined list
  savePapers([...otherPapers, ...newPapers]);
};

// Delete all papers with specific content
export const deletePaperGroup = (content: string) => {
  const papers = getPapers();
  // Ensure strict comparison with trimmed string
  const target = content.trim();
  const filtered = papers.filter(p => (p.content || '').trim() !== target);
  savePapers(filtered);
};

export const deletePaper = (id: string) => {
  const papers = getPapers();
  const filtered = papers.filter(p => p.id !== id);
  savePapers(filtered);
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

export const drawRandomPaper = (): string | null => {
  const papers = getPapers();
  if (papers.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * papers.length);
  const selectedPaper = papers[randomIndex];

  // Add to history with opened timestamp
  const history = getHistory();
  history.push({ ...selectedPaper, openedAt: Date.now() });
  saveHistory(history);

  // Remove from active papers
  papers.splice(randomIndex, 1);
  savePapers(papers);

  return selectedPaper.content;
};