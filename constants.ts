import { Todo } from './types';

export const INITIAL_TODOS: Todo[] = [
  {
    id: '1',
    text: 'Email Deb about the contract',
    isCompleted: false,
    priority: 'A',
    projects: ['Zapier'],
    contexts: ['work'],
    dueDate: '2025-01-08',
    creationDate: '2025-01-01',
  },
  {
    id: '2',
    text: 'Clear the inbox',
    isCompleted: false,
    priority: 'A',
    projects: [],
    contexts: [],
    recurrence: '1d',
    creationDate: '2025-01-02',
  },
  {
    id: '3',
    text: 'Lubricate roller screens',
    isCompleted: false,
    priority: 'C',
    projects: ['Home'],
    contexts: [],
    dueDate: '2025-01-08',
    recurrence: '3m',
    creationDate: '2025-01-03',
  },
  {
    id: '4',
    text: 'Sort kitchen pantry',
    isCompleted: false,
    priority: null, // No priority (D/E implicit)
    projects: ['Home'],
    contexts: [],
    creationDate: '2025-01-04',
  },
  {
    id: '5',
    text: 'Organize bedroom cupboard',
    isCompleted: false,
    priority: null,
    projects: ['Home'],
    contexts: [],
    creationDate: '2025-01-05',
  },
];

export const PRIORITY_COLORS: Record<string, string> = {
  'A': 'bg-rose-500',
  'B': 'bg-sky-500',
  'C': 'bg-amber-400',
  'D': 'bg-gray-300',
  'null': 'bg-gray-200'
};

export const PRIORITY_TEXT_COLORS: Record<string, string> = {
  'A': 'text-rose-600',
  'B': 'text-sky-600',
  'C': 'text-amber-500',
  'D': 'text-gray-400',
  'null': 'text-gray-300'
};
