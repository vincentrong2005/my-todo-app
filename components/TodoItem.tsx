import React from 'react';
import { Todo } from '../types';
import { PRIORITY_COLORS } from '../constants';
import { Check } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onClick: (todo: Todo) => void;
  compact?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onClick, compact }) => {
  const priorityColor = todo.priority ? PRIORITY_COLORS[todo.priority] : PRIORITY_COLORS['null'];
  
  return (
    <div 
      onClick={() => onClick(todo)}
      className={`group relative bg-white rounded-2xl mb-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-[0.99] transition-transform duration-200 overflow-hidden cursor-pointer ${compact ? 'p-2' : 'p-4'}`}
    >
      {/* Colored Sidebar Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${priorityColor}`} />

      <div className={`flex items-start pl-3 gap-3 ${compact ? 'items-center' : ''}`}>
        {/* Checkbox Area */}
        <div className="pt-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(todo.id);
            }}
            className={`rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
              compact ? 'w-5 h-5' : 'w-6 h-6'
            } ${
              todo.isCompleted 
                ? 'bg-gray-300 border-gray-300' 
                : 'border-blue-400 hover:bg-blue-50'
            }`}
          >
            {todo.isCompleted && <Check size={compact ? 12 : 14} className="text-white" />}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium leading-tight truncate ${todo.isCompleted ? 'text-gray-400 line-through' : 'text-slate-700'} ${compact ? 'mb-0' : 'mb-2'}`}>
            {todo.text}
          </h3>

          {!compact && (
            <div className="flex flex-wrap gap-2 items-center">
              {/* Projects (+Tag) */}
              {todo.projects.map((proj) => (
                <span key={proj} className="bg-purple-100 text-purple-700 text-[11px] font-medium px-2 py-0.5 rounded-md">
                  +{proj}
                </span>
              ))}

              {/* Contexts (@Tag) */}
              {todo.contexts.map((ctx) => (
                <span key={ctx} className="bg-blue-100 text-blue-700 text-[11px] font-medium px-2 py-0.5 rounded-md">
                  @{ctx}
                </span>
              ))}

              {/* Due Date */}
              {todo.dueDate && (
                <span className="bg-gray-600 text-white text-[11px] px-2 py-0.5 rounded-md flex items-center gap-1">
                   due: {todo.dueDate}
                </span>
              )}
            </div>
          )}
          {compact && todo.dueDate && (
             <span className="text-[10px] text-gray-400 ml-2">
                {todo.dueDate}
             </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;
