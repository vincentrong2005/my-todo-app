import { Todo } from "./types";

// 将此数组改为清空状态，这样 App 初始化时就是干净的
export const INITIAL_TODOS: Todo[] = [];

export const PRIORITY_COLORS: Record<string, string> = {
  A: "bg-rose-500",
  B: "bg-sky-500",
  C: "bg-amber-400",
  D: "bg-gray-300",
  null: "bg-gray-200",
};

export const PRIORITY_TEXT_COLORS: Record<string, string> = {
  A: "text-rose-600",
  B: "text-sky-600",
  C: "text-amber-500",
  D: "text-gray-400",
  null: "text-gray-300",
};
