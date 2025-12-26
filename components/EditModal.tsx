import React, { useState, useEffect } from 'react';
import { Priority, Todo } from '../types';
import { X, Calendar, Hash, Flag, Tag } from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Partial<Todo>) => void;
  initialTodo?: Todo | null;
  onDelete?: (id: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, onSave, initialTodo, onDelete }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<Priority>(null);
  const [dueDate, setDueDate] = useState('');
  const [projectInput, setProjectInput] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      if (initialTodo) {
        setText(initialTodo.text);
        setPriority(initialTodo.priority);
        setDueDate(initialTodo.dueDate || '');
        setProjectInput(initialTodo.projects.join(' '));
      } else {
        // Reset for new task
        setText('');
        setPriority(null);
        setDueDate('');
        setProjectInput('');
      }
    }
  }, [isOpen, initialTodo]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!text.trim()) return;
    
    const projects = projectInput.split(' ').filter(p => p.length > 0).map(p => p.startsWith('+') ? p.substring(1) : p);

    onSave({
      id: initialTodo?.id,
      text,
      priority,
      dueDate: dueDate || undefined,
      projects
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm pointer-events-auto transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="bg-white w-full max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl pointer-events-auto transform transition-transform duration-300 p-6 pb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {initialTodo ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Text Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Description</label>
            <textarea
              className="w-full text-lg border-b-2 border-gray-100 focus:border-blue-500 outline-none py-2 resize-none text-gray-800 placeholder-gray-300"
              rows={2}
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              autoFocus
            />
          </div>

          {/* Priority Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Flag size={12} /> Priority
            </label>
            <div className="flex gap-2">
              {(['A', 'B', 'C', null] as Priority[]).map((p) => (
                <button
                  key={String(p)}
                  onClick={() => setPriority(p)}
                  className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition-all ${
                    priority === p 
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' 
                      : 'opacity-60 hover:opacity-100'
                  } ${
                    p === 'A' ? 'bg-rose-500 text-white shadow-rose-200' :
                    p === 'B' ? 'bg-sky-500 text-white shadow-sky-200' :
                    p === 'C' ? 'bg-amber-400 text-white shadow-amber-200' :
                    'bg-gray-200 text-gray-500'
                  }`}
                >
                  {p || '-'}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar size={12} /> Due Date
              </label>
              <input 
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

             {/* Projects */}
             <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Tag size={12} /> Projects
              </label>
              <input 
                type="text"
                placeholder="Home Work"
                value={projectInput}
                onChange={(e) => setProjectInput(e.target.value)}
                className="w-full bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {initialTodo && onDelete && (
              <button 
                onClick={() => { onDelete(initialTodo.id); onClose(); }}
                className="px-5 py-3 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            )}
            <button 
              onClick={handleSave}
              className="flex-1 bg-gray-900 text-white rounded-xl py-3 font-semibold shadow-lg shadow-gray-300 hover:bg-gray-800 transition-all active:scale-95"
            >
              {initialTodo ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
