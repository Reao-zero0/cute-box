export interface Paper {
  id: string;
  content: string;
  createdAt: number;
  openedAt?: number; // Optional: exists if the paper has been opened/moved to history
}

export interface GameState {
  clicks: number;
  isOpen: boolean;
  message: string | null;
}