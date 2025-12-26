export type Priority = 'A' | 'B' | 'C' | 'D' | null;

export interface Todo {
  id: string;
  text: string;
  isCompleted: boolean;
  priority: Priority;
  projects: string[]; // +Project
  contexts: string[]; // @Context
  dueDate?: string;   // YYYY-MM-DD
  recurrence?: string; // e.g., "1d", "1w"
  creationDate: string;
}

export type SortType = 'Priority' | 'Due';

export interface AppSettings {
  fontSize: 'small' | 'medium' | 'large';
  compact: boolean;
}
