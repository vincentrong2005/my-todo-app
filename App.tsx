import React, { useState, useMemo } from 'react';
import { Filter, Plus, Search, Settings, Calendar, X } from 'lucide-react';
import { INITIAL_TODOS } from './constants';
import { Todo, SortType, AppSettings } from './types';
import TodoItem from './components/TodoItem';
import EditModal from './components/EditModal';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(INITIAL_TODOS);
  const [sortType, setSortType] = useState<SortType>('Priority');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  const [settings, setSettings] = useState<AppSettings>({
    fontSize: 'medium',
    compact: false
  });

  // Derived Classes based on settings
  const fontClass = {
    'small': 'text-sm',
    'medium': 'text-base',
    'large': 'text-lg'
  }[settings.fontSize];

  // Grouping Logic
  const groupedTodos = useMemo(() => {
    // 0. Filter by Search
    let filtered = todos;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = todos.filter(t => t.text.toLowerCase().includes(q) || t.projects.some(p => p.toLowerCase().includes(q)));
    }

    const groups: Record<string, Todo[]> = {};
    const groupKeys: string[] = [];

    if (sortType === 'Priority') {
      // Sort: Priority A->Z, then null. Within Priority, by due date.
      const sorted = [...filtered].sort((a, b) => {
        if (a.priority && !b.priority) return -1;
        if (!a.priority && b.priority) return 1;
        if (a.priority && b.priority && a.priority !== b.priority) {
          return a.priority.localeCompare(b.priority);
        }
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      });

      sorted.forEach(todo => {
        const key = todo.priority || 'No Priority';
        if (!groups[key]) {
          groups[key] = [];
          groupKeys.push(key);
        }
        groups[key].push(todo);
      });
    } else if (sortType === 'Due') {
      // Sort by Due Date
      const today = new Date().toISOString().split('T')[0];
      const getDueKey = (date?: string) => {
        if (!date) return 'No Date';
        if (date < today) return 'Overdue';
        if (date === today) return 'Today';
        
        const tmrw = new Date();
        tmrw.setDate(tmrw.getDate() + 1);
        if (date === tmrw.toISOString().split('T')[0]) return 'Tomorrow';
        
        return 'Later';
      };

      // Order of keys
      const precedence = ['Overdue', 'Today', 'Tomorrow', 'Later', 'No Date'];

      filtered.forEach(todo => {
        const key = getDueKey(todo.dueDate);
        if (!groups[key]) groups[key] = [];
        groups[key].push(todo);
      });

      // Sort keys based on precedence
      groupKeys.push(...Object.keys(groups).sort((a, b) => {
        return precedence.indexOf(a) - precedence.indexOf(b);
      }));
      
      // Sort within groups by priority then text
      groupKeys.forEach(k => {
        groups[k].sort((a, b) => {
          // simple priority sort inside date groups
          const pA = a.priority || 'Z';
          const pB = b.priority || 'Z';
          return pA.localeCompare(pB);
        });
      });
    }

    return { groups, groupKeys };
  }, [todos, sortType, searchQuery]);

  // Handlers
  const handleToggle = (id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const handleDelete = (id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleSave = (partialTodo: Partial<Todo>) => {
    if (editingTodo) {
      // Edit
      setTodos(prev => prev.map(t => t.id === editingTodo.id ? { ...editingTodo, ...partialTodo } as Todo : t));
    } else {
      // Create
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: partialTodo.text!,
        isCompleted: false,
        priority: partialTodo.priority || null,
        projects: partialTodo.projects || [],
        contexts: [],
        dueDate: partialTodo.dueDate,
        creationDate: new Date().toISOString().split('T')[0]
      };
      setTodos(prev => [...prev, newTodo]);
    }
  };

  const openNewTaskModal = () => {
    setEditingTodo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  return (
    <div className={`min-h-screen bg-[#f3f4f6] text-slate-800 font-sans flex justify-center ${fontClass}`}>
      
      {/* Mobile Container */}
      <div className="w-full max-w-md bg-[#f3f4f6] min-h-screen flex flex-col relative shadow-2xl">
        
        {/* Header */}
        <header className="px-6 pt-6 pb-2 bg-[#f3f4f6] z-10 sticky top-0 transition-all">
          <div className="flex justify-between items-center mb-4 min-h-[44px]">
            {isSearchActive ? (
              <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
                <Search size={18} className="text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search tasks..."
                  className="flex-1 outline-none bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => { setIsSearchActive(false); setSearchQuery(''); }}>
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
            ) : (
              <>
                 {/* Replaced 'sleek.mobile' with 'Tasks' or just empty if purely minimalist. Using Tasks for usability. */}
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tasks</h1>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsSearchActive(true)} 
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-500 hover:text-blue-600 shadow-sm transition-colors"
                  >
                    <Search size={20} />
                  </button>
                  <button 
                    onClick={() => setIsSettingsOpen(true)} 
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-gray-500 hover:text-blue-600 shadow-sm transition-colors"
                  >
                    <Settings size={20} />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Sort Chips */}
          <div className="flex gap-3 pb-2">
            <button 
              onClick={() => setSortType('Priority')}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                sortType === 'Priority' 
                  ? 'bg-gray-900 text-white shadow-md' 
                  : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <Filter size={14} /> Priority
            </button>
            <button 
               onClick={() => setSortType('Due')}
               className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
                 sortType === 'Due' 
                   ? 'bg-gray-900 text-white shadow-md' 
                   : 'bg-white text-gray-500 hover:bg-gray-100 shadow-sm'
               }`}
            >
              <Calendar size={14} /> Due Date
            </button>
          </div>
        </header>

        {/* List Content */}
        <main className="flex-1 px-4 pb-24 overflow-y-auto">
          {groupedTodos.groupKeys.map(key => (
            <div key={key} className="mb-6">
              {/* Group Header */}
              <div className="flex items-center gap-2 mb-3 mt-2 px-2">
                {sortType === 'Priority' ? (
                  key !== 'No Priority' ? (
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm ${key === 'A' ? 'bg-rose-500' : key === 'B' ? 'bg-sky-500' : 'bg-amber-400'}`}>
                      {key}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-300 text-white font-bold text-sm">
                      -
                    </div>
                  )
                ) : (
                  // Due Date Header Style
                  <span className={`text-sm font-bold uppercase tracking-wider ${
                    key === 'Overdue' ? 'text-red-500' : 
                    key === 'Today' ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {key}
                  </span>
                )}
                
                {/* Count Badge */}
                {sortType === 'Priority' && (
                  <div className="relative">
                     <span className="text-xs font-bold text-gray-400 bg-white px-2 py-0.5 rounded-full shadow-sm border border-gray-100">
                       {groupedTodos.groups[key].length}
                     </span>
                  </div>
                )}
              </div>

              {/* Tasks */}
              <div>
                {groupedTodos.groups[key].map(todo => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onToggle={handleToggle}
                    onClick={openEditModal}
                    compact={settings.compact}
                  />
                ))}
              </div>
            </div>
          ))}

          {todos.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Plus size={32} className="text-gray-300" />
              </div>
              <p>No tasks found. Add one!</p>
            </div>
          )}
        </main>

        {/* FAB */}
        <div className="absolute bottom-6 right-6 z-20">
          <button 
            onClick={openNewTaskModal}
            className="w-14 h-14 bg-gray-900 text-white rounded-2xl shadow-xl shadow-gray-400/50 flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={28} />
          </button>
        </div>

        {/* Bottom Nav */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-100 flex items-center justify-around px-6 pb-2 text-gray-400 z-10">
          <button className="p-2 text-blue-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:text-gray-600"
          >
            <Settings size={24} />
          </button>
        </div>

      </div>

      <EditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialTodo={editingTodo}
        onDelete={handleDelete}
      />
      
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
}
